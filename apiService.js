//apiService.js
//Core of calling APIs

import { aiLogic } from './logic.js';

/**
 * Fetches a random quote from the Quotable API.
 * @returns {Promise<object|null>} A promise that resolves to an object with { content, author } or null if an error occurs.
 */
async function fetchQuote(signal) {
    try {
        const response = await fetch('https://api.quotable.io/random', { signal });
        if (!response.ok) {
            console.error("API request failed with status:", response.status);
            return null;
        }
        const data = await response.json();
        return { content: data.content, author: data.author };
    } catch (error) {
        console.error("Error fetching quote:", error);
        return null;
    }
}

/**
 * Fetches a description from Wikidata as a fallback.
 * @param {string} query - The search term.
 * @returns {Promise<object|null>} An object with { title, extract } or null.
 */
async function fetchWikidataDescription(query, signal) {
    try {
        // 1. Search for the Wikidata entity ID and its description
        const searchResponse = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(query)}&language=en&format=json&origin=*`, { signal });
        if (!searchResponse.ok) return null;
        const searchData = await searchResponse.json();

        if (!searchData.search || searchData.search.length === 0) {
            return null; // No entity found
        }

        const entity = searchData.search[0];
        const entityLabel = entity.label;
        const entityDescription = entity.description;

        // The description from the search result is often sufficient and saves an API call.
        if (entityDescription) {
            console.log(`Using Wikidata description for "${query}"`);
            return { title: entityLabel, extract: `${entityDescription} (Source: Wikidata)` };
        }
        return null; // No usable description found
    } catch (error) {
        console.error("Error fetching Wikidata description:", error);
        return null;
    }
}

/**
 * Extracts the core topic from a user's question by removing common conversational phrases.
 * @param {string} query The user's raw question.
 * @returns {string} The extracted search term.
 */
function _extractSearchTerm(query) {
    let processedQuery = query.toLowerCase().trim();

    // 1. Define question phrases to remove from the beginning.
    // Sorted by length to match longer phrases first.
    const questionPhrases = [
        "can you tell me about", "can you tell me what is", "can you tell me who is",
        "what do you know about", "what is the meaning of",
        "what is a", "what is an", "what is the", "what is",
        "what's a", "what's an", "what's the", "what's",
        "who is a", "who is an", "who is the", "who is",
        "who's a", "who's an", "who's the", "who's",
        "who was", "where is", "what are", "what were",
        "what the", "define", "tell me about", "tell me"
    ].sort((a, b) => b.length - a.length);

    // 2. Remove the identified question phrase from the start.
    for (const phrase of questionPhrases) {
        if (processedQuery.startsWith(phrase + ' ')) {
            processedQuery = processedQuery.substring(phrase.length).trim();
            break;
        }
    }

    // 3. Remove trailing punctuation and filler words.
    processedQuery = processedQuery.replace(/[\?\.]$/, '').trim(); // Remove trailing ? or .
    const trailingNoise = [...aiLogic.fillers.words, 'saying', 'mean', 'is', 'are', 'was', 'were'];
    let words = processedQuery.split(/\s+/);
    while (words.length > 1 && trailingNoise.includes(words[words.length - 1])) {
        words.pop();
    }
    return words.join(' ');
}

/**
 * Fetches an abstract from DBpedia using a SPARQL query.
 * @param {string} searchTerm - The term to search for.
 * @returns {Promise<string|null>} The abstract text or null.
 */
async function fetchDbpediaAbstract(searchTerm, signal) {
    const endpointUrl = 'https://dbpedia.org/sparql';
    const sparqlQuery = `
        PREFIX dbo: <http://dbpedia.org/ontology/>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        SELECT ?abstract WHERE {
            ?resource rdfs:label "${searchTerm}"@en .
            ?resource dbo:abstract ?abstract .
            FILTER (lang(?abstract) = 'en')
        } LIMIT 1
    `;

    const fullUrl = `${endpointUrl}?query=${encodeURIComponent(sparqlQuery)}&format=json`;

    try {
        const response = await fetch(fullUrl, {
            headers: { 'Accept': 'application/sparql-results+json' },
            signal
        });
        if (!response.ok) return null;
        const data = await response.json();
        if (data.results.bindings.length > 0) {
            console.log(`Using DBpedia abstract for "${searchTerm}"`);
            return data.results.bindings[0].abstract.value;
        }
        return null;
    } catch (error) {
        console.error("Error fetching DBpedia abstract:", error);
        return null;
    }
}

/**
 * Fetches a summary from Wikipedia for a given query.
 * @param {string} query - The search term or question from the user.
 * @returns {Promise<string|null>} The formatted summary or null if not found.
 */
async function fetchWikipediaSummary(query, signal) {
    try {
        // Search Wikipedia for pages matching searchTerm
        // The Wikipedia search API is robust enough to handle full questions.
        const wikiSearchResponse = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&utf8=&format=json&origin=*`, { signal });
        if (!wikiSearchResponse.ok) throw new Error('Wikipedia search API failed');
        const wikiSearchData = await wikiSearchResponse.json();

        if (wikiSearchData.query.search.length > 0) {
            const pageTitle = wikiSearchData.query.search[0].title;
            const summaryResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`, { signal });
            const summaryData = await summaryResponse.json();

            // Return the extract if it's valid and not a disambiguation page
            if (summaryData.type !== 'disambiguation' && summaryData.extract) {
                return { title: pageTitle, extract: summaryData.extract };
            }
        }
        // If Wikipedia fails or returns no useful summary, try Wikidata as a fallback.
        return await fetchWikidataDescription(_extractSearchTerm(query), signal);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Wikipedia fetch aborted.');
            throw error; // Re-throw the error to be caught by the caller
        }
        console.error("Error fetching Wikipedia summary, trying Wikidata as fallback:", error);
        return await fetchWikidataDescription(_extractSearchTerm(query), signal);
    }
}

/**
 * Fetches combined data from Wikipedia and DBpedia.
 * @param {string} query The user's question.
 * @returns {Promise<object|null>}
 */
async function fetchCombinedData(query, signal) {
    // 1. Get the primary summary from Wikipedia. This helps normalize the user's query.
    const wikiData = await fetchWikipediaSummary(query, signal);

    // We must have at least the Wikipedia data to proceed.
    if (!wikiData) return null;

    // 2. Now use the clean title from Wikipedia to query DBpedia for a more accurate match.
    const dbpediaAbstract = await fetchDbpediaAbstract(wikiData.title, signal);

    return {
        wiki: wikiData,
        dbpedia: dbpediaAbstract
    };
}

/**
 * Handles multiple questions in one input by fetching a summary for each.
 * @param {string} userInput
 * @returns {Promise<Array<object>>} An array of summary objects {title, extract}.
 */
async function handleMultipleWikipediaQueries(userInput, signal) {
    // Split by 'and' or '?' to extract individual questions
    const questions = userInput
        .split(/(?:\sand\s|\?)/i)
        .map(q => q.trim())
        .filter(q => q.length > 0);

    if (questions.length === 1) {
        const summary = await fetchCombinedData(questions[0], signal);
        return summary ? [summary] : [];
    }

    // Fetch summaries for each question separately
    const promises = questions.map(q => fetchCombinedData(q, signal));
    const results = await Promise.all(promises);
    return results.filter(Boolean); // Filter out any null results
}

export { fetchQuote, fetchWikipediaSummary, handleMultipleWikipediaQueries };
