import { aiLogic } from './logic.js';
import { aiResponses } from './response.js';
import { basicQuestions } from './basicQA.js';
import { codeLibrary } from './codeLibrary.js';
import { fetchQuote, fetchWikipediaSummary, handleMultipleWikipediaQueries } from './apiService.js';

const questionStarters = ['what', 'who', 'where', 'when', 'why', 'which', 'is', 'can', 'will', 'there'];

let lastUserInput = ''; // Module-level state to store the last user input
let frustrationCount = 0; // Tracks consecutive frustration messages

function isFactQuestion(text) {
    let lower = text.toLowerCase().trim();

    // Create a regex from greeting words to find and remove them from the start.
    // This is more robust than a simple loop.
    const greetingRegex = new RegExp(`^(${aiLogic.greetings.words.join('|')})[\\s,!?]*`, 'i');

    // Remove the greeting part from the beginning of the string
    const textWithoutGreeting = lower.replace(greetingRegex, '').trim();

    // Now check if the remaining text starts with a question word.
    return questionStarters.some(
        word => textWithoutGreeting.startsWith(word + ' ') || textWithoutGreeting.startsWith(word + '?')
    );
}

/**
 * Checks if an input consists only of filler words.
 * @param {string} input The user's input.
 * @param {string[]} fillerList A list of filler words.
 * @returns {boolean}
 */
function isOnlyFillers(input, fillerList) {
    const words = input.toLowerCase().split(/\s+/).filter(Boolean);
    if (words.length === 0 || words.length > 3) return false; // Only for short inputs
    return words.every(word => fillerList.includes(word.replace(/[^\w]/g, '')));
}

const levenshteinDistance = (s1, s2) => {
    if (s1.length < s2.length) return levenshteinDistance(s2, s1);
    if (s2.length === 0) return s1.length;
    let previousRow = Array.from({ length: s2.length + 1 }, (_, i) => i);
    for (let i = 0; i < s1.length; i++) {
        let currentRow = [i + 1];
        for (let j = 0; j < s2.length; j++) {
            let insertions = previousRow[j + 1] + 1;
            let deletions = currentRow[j] + 1;
            let substitutions = previousRow[j] + (s1[i] !== s2[j] ? 1 : 0);
            currentRow.push(Math.min(insertions, deletions, substitutions));
        }
        previousRow = currentRow;
    }
    return previousRow[s2.length];
};

export const fuzzyContainsAny = (input, keywords) => {
    const lowerInput = input.toLowerCase();
    const inputWords = lowerInput.split(/\s+/);
    return keywords.some(keyword => {
        // If the keyword is a multi-word phrase, check for simple inclusion.
        if (keyword.includes(' ')) {
            return lowerInput.includes(keyword);
        }
        // Otherwise, do fuzzy matching on single words.
        return inputWords.some(inputWord => {
            const maxDistance = keyword.length > 5 ? 2 : 1;
            return keyword.length >= 3 && levenshteinDistance(inputWord, keyword) <= maxDistance;
        });
    });
};

export const getRandomResponse = (responses) => {
    if (!Array.isArray(responses) || responses.length === 0) return "";
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
};

/**
 * Detects and solves mathematical expressions in user input.
 * @param {string} input - The user's raw input string.
 * @returns {object|null} An object with {type, result} or null if no math is detected.
 */
function solveMath(input) {
    // 1. Normalize the input string to make it easier to parse.
    let expression = input.toLowerCase()
        .replace(/what is/g, '')
        .replace(/what's/g, '')
        .replace(/calculate/g, '')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/subtract/g, '-')
        .replace(/times/g, '*')
        .replace(/multiplied by/g, '*')
        .replace(/divided by/g, '/')
        .replace(/\?$/, '')
        .trim();

    // 2. Check for calculus terms first.
    if (expression.includes('integrate') || expression.includes('differentiate') || expression.includes('derivative')) {
        return { type: 'calculus' };
    }

    // 3. Use a regular expression to find a simple arithmetic expression.
    const arithmeticRegex = /(-?\d+(?:\.\d+)?)\s*([+\-*/])\s*(-?\d+(?:\.\d+)?)/;
    const match = expression.match(arithmeticRegex);

    if (match) {
        const num1 = parseFloat(match[1]);
        const operator = match[2];
        const num2 = parseFloat(match[3]);

        let result;
        switch (operator) {
            case '+': result = num1 + num2; break;
            case '-': result = num1 - num2; break;
            case '*': result = num1 * num2; break;
            case '/':
                if (num2 === 0) return { type: 'error', result: "division by zero is not allowed" };
                result = num1 / num2;
                break;
        }
        return { type: 'arithmetic', result: Number.isInteger(result) ? result : parseFloat(result.toFixed(4)) };
    }
    return null; // No parsable math expression found.
}

/**
 * Tries to identify the programming language of a given code snippet using heuristics.
 * @param {string} input The user's input string.
 * @returns {string|null} The name of the language or null if not confident.
 */
function identifyCodeSnippet(input) {
    const trimmed = input.trim();

    // 1. Pre-checks: Don't run on short, simple text. It must look like a code snippet.
    const hasMultipleLines = trimmed.includes('\n');
    const hasBraces = /[{}]/.test(trimmed);
    const hasIndentation = /^\s{2,}|^\t/m.test(trimmed); // Indentation with spaces or tabs
    const hasHtmlTags = /<[a-z][\s\S]*>/i.test(trimmed);

    // It's likely code if it has multiple lines, indentation, braces, or HTML tags.
    const looksLikeCode = hasMultipleLines || hasBraces || hasIndentation || hasHtmlTags;

    // Avoid running on very short inputs that are unlikely to be code.
    if (trimmed.length < 15 || !looksLikeCode) {
        return null;
    }

    // 2. Language-specific patterns for scoring
    const languagePatterns = {
        'Python': [/\b(def|class|import|from|elif|else:|except:|with|as|print|yield|lambda)\b/g],
        'JavaScript': [/\b(function|const|let|var|async|await|=>|return|throw|fetch|Promise|require)\b/g, /[{};]$/m],
        'HTML': [
            /<!DOCTYPE html>/i, /<html/i, /<head/i, /<body/i, /<div/i, /<p/i, /<a\s+href/i,
        ],
        'CSS': [
            /^\s*([#\.]?[\w-]+)\s*\{/gm, // selector {
            /:\s*.*;/gm, // property: value;
            /\b(color|background|font-size|display|position|margin|padding)\b/g,
        ],
        'SQL': [/\b(SELECT|FROM|WHERE|INSERT|INTO|UPDATE|DELETE|CREATE|TABLE|JOIN)\b/ig],
        'Bash/Shell': [
            /^\#!\/bin\/(bash|sh|zsh)/, // Shebang
            /\b(echo|ls|cd|grep|sed|awk|curl|git)\b/g,
        ]
    };

    let scores = {};
    for (const lang in languagePatterns) {
        scores[lang] = 0;
        languagePatterns[lang].forEach(pattern => {
            const matches = trimmed.match(pattern);
            if (matches) {
                // Give strong weight to definitive patterns like DOCTYPE or a shebang
                if (pattern.source.includes('DOCTYPE') || pattern.source.includes('Shebang')) {
                    scores[lang] += 10;
                }
                scores[lang] += matches.length;
            }
        });
    }

    // 3. Determine the winner
    let bestMatch = null;
    let maxScore = 0;
    for (const lang in scores) {
        if (scores[lang] > maxScore) {
            maxScore = scores[lang];
            bestMatch = lang;
        }
    }

    // 4. Confidence check: require a minimum score to avoid false positives on regular text.
    return maxScore > 1 ? bestMatch : null;
}

/**
 * Rephrases a text extract to sound more conversational.
 * @param {string} text - Raw text extract.
 * @returns {string} - Rephrased text.
 */
function rephraseExtract(text) {
    if (!text) return "";
    const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [text];
    const explanationSentences = sentences.slice(0, 3); // Take up to 3 sentences for the body.
    const rephrased = explanationSentences.map(sentence => {
        return sentence
            .replace(/Wikipedia is a free encyclopedia/gi, "Basically, Wikipedia tells us")
            .replace(/It is/gi, "It's")
            .replace(/which means/gi, "meaning")
            .replace(/, also known as/gi, ", or simply")
            .replace(/(?:\b[A-Z][a-z]+) is an? /g, (match) => match.toLowerCase())
            .trim();
    });
    return rephrased.join(' ');
}

/**
 * Creates a structured, multi-part answer from summary data.
 * @param {Array<object>} summaries - An array of summary objects from the API.
 * @param {string|null} customIntro - An optional custom introduction to use.
 * @returns {string} - A formatted, multi-part response string.
 */
function createStructuredAnswer(summaries, customIntro = null) {
    if (!summaries || summaries.length === 0) return "";

    // For a structured answer, we'll focus on the first and most relevant topic found.
    const primarySummary = summaries[0];
    const { wiki, dbpedia } = primarySummary;

    // We must have the primary (Wikipedia/Wikidata) data.
    if (!wiki) return "";

    const { title, extract } = wiki;

    // 1. Introduction: Use custom intro if provided, otherwise generate one.
    const introduction = customIntro || getRandomResponse(aiResponses.structuredIntro).replace('{title}', `${title}`);

    // 2. Deep Explanation: Rephrase the core extract from the API.
    const explanation = rephraseExtract(extract);

    // 3. DBpedia Summary (if available)
    let dbpediaPart = '';
    if (dbpedia) {
        const dbpediaIntro = getRandomResponse(aiResponses.dbpediaIntro);
        // Rephrase DBpedia abstract to be a bit more concise if needed
        const dbpediaSentences = dbpedia.match(/[^\.!\?]+[\.!\?]+/g) || [dbpedia];
        const dbpediaSummary = dbpediaSentences.slice(0, 2).join(' '); // Take first 2 sentences
        dbpediaPart = `\n\n${dbpediaIntro}\n\n*${dbpediaSummary}*`;
    }

    // 4. Conclusion
    const conclusion = getRandomResponse(aiResponses.structuredConclusion);

    // Assemble the final response
    return `${introduction}\n\n${explanation}${dbpediaPart}\n\n${conclusion}`;
}

async function _internalGenerateResponse(userInput, signal) {
    const lowerInput = userInput.toLowerCase();

    // High-priority check for file analysis requests.
    // This relies on the marker added in script.js when a file is processed.
    if (lowerInput.includes('--- content from')) {
        const fileNameMatch = userInput.match(/--- Content from (.*?) ---/);
        const fileName = fileNameMatch ? fileNameMatch[1] : 'your file';

        // If the user's accompanying message asks for analysis, provide the fallback.
        if (fuzzyContainsAny(lowerInput, aiLogic.fileAnalysisWords.words)) {
            return getRandomResponse(aiResponses.fileAnalysisNotPossible).replace('{fileName}', fileName);
        }
    }

    // Check for follow-up queries. This is more specific than just pronouns.
    if (fuzzyContainsAny(lowerInput, aiLogic.followUpQueryWords.words)) {
        if (lastUserInput) {
            // If a follow-up is detected, treat the last input as a new question.
            const summaries = await handleMultipleWikipediaQueries(lastUserInput, signal);
            if (summaries && summaries.length > 0) {
                const customIntro = `Of course! To elaborate on "${lastUserInput}":`;
                return createStructuredAnswer(summaries, customIntro);
            } else {
                return `I'm sorry, I couldn't find more details about "${lastUserInput}".`;
            }
        } else {
            return "What topic would you like me to elaborate on?";
        }
    }

    // Check for positive feedback, which shouldn't trigger other logic.
    if (fuzzyContainsAny(lowerInput, aiLogic.positiveFeedbackWords.words)) {
        return getRandomResponse(aiResponses.positiveFeedback);
    }

    // New check for filler-only messages
    if (isOnlyFillers(userInput, aiLogic.fillers.words)) {
        return getRandomResponse(aiResponses.fillerAcknowledgement);
    }

    // High-priority checks for moderation and user sentiment
    if (fuzzyContainsAny(lowerInput, aiLogic.badWords.words)) {
        frustrationCount = 0; // Reset frustration on a different negative interaction
        return getRandomResponse(aiResponses.badwordResponse);
    }

    if (fuzzyContainsAny(lowerInput, aiLogic.frustrationWords.words)) {
        frustrationCount++;
        if (frustrationCount >= 3) {
            return getRandomResponse(aiResponses.frustrationSpam);
        }

        if (lastUserInput) {
            // There is context for the frustration
            return getRandomResponse(aiResponses.frustrationWithContext);
        } else {
            // No context, user is starting with frustration
            return getRandomResponse(aiResponses.frustrationWithoutContext);
        }
    } else {
        // If the message is not a frustration message, reset the counter.
        frustrationCount = 0;
    }

    // Check for questions about the AI's identity
    if (fuzzyContainsAny(lowerInput, aiLogic.identityWords.words)) {
        return getRandomResponse(aiResponses.identityResponse);
    }

    // Check for opinion-based questions
    if (fuzzyContainsAny(lowerInput, aiLogic.opinionWords.words)) {
        return getRandomResponse(aiResponses.opinionResponse);
    }

    // Check for planning/decision-making requests
    if (fuzzyContainsAny(lowerInput, aiLogic.planningWords.words)) {
        return getRandomResponse(aiResponses.planningResponse);
    }

    // 1. Check for mathematical expressions first.
    const mathResult = solveMath(userInput);
    if (mathResult) {
        switch (mathResult.type) {
            case 'arithmetic':
                return getRandomResponse(aiResponses.mathResult).replace('{result}', mathResult.result);
            case 'calculus':
                return getRandomResponse(aiResponses.calculus);
            case 'error':
                return getRandomResponse(aiResponses.mathError).replace('{error}', mathResult.result);
        }
    }

    // New: Check if the user has pasted a code snippet for identification.
    const identifiedLang = identifyCodeSnippet(userInput);
    if (identifiedLang) {
        return getRandomResponse(aiResponses.codeIdentification).replace('{language}', identifiedLang);
    }

    // New check for local knowledge base questions before trying APIs
    for (const key in basicQuestions) {
        const qa = basicQuestions[key];
        if (fuzzyContainsAny(lowerInput, qa.keywords)) {
            return getRandomResponse(qa.answers);
        }
    }

    // 2. Check for other specific, non-question commands
    for (const category in aiLogic) {
        // Skip categories that are handled with higher priority or have special logic
        const skipCategories = [
            'questionWords', 'followUpQueryWords', 'positiveFeedbackWords', 'fillers',
            'badWords', 'frustrationWords', 'opinionWords', 'identityWords', 'planningWords'
        ];
        if (skipCategories.includes(category)) {
            continue;
        }

        let match = false;
        const { words } = aiLogic[category];

        // Use a different matching strategy for emoji categories vs. word-based categories
        if (category.includes('emojis')) {
            if (words.some(emoji => userInput.includes(emoji))) {
                match = true;
            }
        } else {
            if (fuzzyContainsAny(lowerInput, words)) {
                match = true;
            }
        }

        if (match) {
            switch (category) {
                case 'apiQuoteWords':
                    const quoteData = await fetchQuote(signal);
                    if (quoteData) {
                        let responseTemplate = getRandomResponse(aiResponses.apiQuote);
                        return responseTemplate
                            .replace('{quote}', quoteData.content)
                            .replace('{author}', quoteData.author);
                    }
                    return getRandomResponse(aiResponses.apiError);
                case 'codeRequestWords':
                    let foundSnippet = null;
                    // Search the library for a specific keyword match
                    for (const key in codeLibrary) {
                        const snippet = codeLibrary[key];
                        if (fuzzyContainsAny(lowerInput, snippet.keywords)) {
                            foundSnippet = snippet;
                            break;
                        }
                    }

                    if (foundSnippet) {
                        const codeBlock = `\`\`\`${foundSnippet.language}\n${foundSnippet.code.trim()}\n\`\`\``;
                        return codeBlock;
                    }
                    // If no specific snippet is found, give a generic coding help response.
                    return getRandomResponse(aiResponses.codeHelp);
                case 'greetings':
                    const greetingPart = getRandomResponse(aiResponses.greeting);
                    // Check if the input ALSO contains a factual question.
                    if (isFactQuestion(userInput)) {
                        const summaries = await handleMultipleWikipediaQueries(userInput, signal);
                        if (summaries.length === 0) {
                            return greetingPart; // Just greet if no answer is found
                        }
                        const customIntro = `${greetingPart} Regarding your question,`;
                        return createStructuredAnswer(summaries, customIntro);
                    }
                    return greetingPart;
                case 'farewells':
                    return getRandomResponse(aiResponses.farewell);
                case 'helpWords':
                    return getRandomResponse(aiResponses.help);
                // New cases for handling emotional sentiment from emojis
                case 'angryemojis':
                    // Don't override a more specific intent like a question
                    if (!isFactQuestion(userInput)) return getRandomResponse(aiResponses.angryResponse);
                    break;
                case 'sademojis':
                    if (!isFactQuestion(userInput)) return getRandomResponse(aiResponses.sadResponse);
                    break;
                case 'happyemojis':
                    // This is a lower priority. It shouldn't override greetings, positive feedback, or questions.
                    // We check for it here to see if it's the *only* intent.
                    // If it's combined with a question, that's handled later.
                    if (!isFactQuestion(userInput) && !fuzzyContainsAny(lowerInput, aiLogic.greetings.words) && !fuzzyContainsAny(lowerInput, aiLogic.positiveFeedbackWords.words)) {
                        return getRandomResponse(aiResponses.happyResponse);
                    }
                    break;
            }
        }
    }

    // 3. Wikipedia fallback for fact questions
    if (isFactQuestion(userInput)) {
        const hasFiller = fuzzyContainsAny(lowerInput, aiLogic.fillers.words);
        const hasHappyEmoji = aiLogic.happyemojis.words.some(emoji => userInput.includes(emoji));
        const summaries = await handleMultipleWikipediaQueries(userInput, signal);

        if (summaries.length > 0) {
            const intro = (hasFiller || hasHappyEmoji) ?
                getRandomResponse(aiResponses.friendlyQuestionResponse) :
                null; // Let createStructuredAnswer handle the default intro

            return createStructuredAnswer(summaries, intro);
        }
    }

    // 4. Default fallback
    return getRandomResponse(aiResponses.default);
}

/**
 * Main exported function that acts as a wrapper to manage conversation state.
 * @param {string} userInput The user's current message.
 * @returns {Promise<string>} The AI's final response.
 */
export async function generateAIResponse(userInput, signal) {
    const response = await _internalGenerateResponse(userInput, signal);

    // Update the last user input for context in the next turn,
    // but only if the current input is not just a simple follow-up or feedback phrase.
    const isFollowUp = fuzzyContainsAny(userInput.toLowerCase(), aiLogic.followUpQueryWords.words);
    const isFeedback = fuzzyContainsAny(userInput.toLowerCase(), aiLogic.positiveFeedbackWords.words);
    if (!isFollowUp && !isFeedback) {
        lastUserInput = userInput;
    }
    return response;
}

export function resetConversationContext() {
    lastUserInput = '';
    frustrationCount = 0;
}