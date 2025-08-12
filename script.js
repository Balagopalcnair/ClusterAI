import { generateAIResponse, fuzzyContainsAny, resetConversationContext, getRandomResponse } from './brain.js';
import { aiLogic } from './logic.js';
import { aiResponses } from './response.js';

// Helper to determine the category of a file for processing.
function getFileCategory(file) {
    const type = file.type;
    const name = file.name.toLowerCase();

    if (type.startsWith('image/')) return 'image';
    if (type === 'application/pdf') return 'pdf';
    if (type.startsWith('text/') || name.endsWith('.txt') || name.endsWith('.md') || name.endsWith('.csv')) return 'text';

    // Check for common unsupported types
    if (type.startsWith('audio/') || type.startsWith('video/') || type.includes('zip') || type.includes('excel') || type.includes('word')) {
        return 'unsupported';
    }

    return 'unknown'; // Could be unsupported, let the logic handle it.
}

document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.querySelector('.chat-window');
    const msgInput = document.getElementById('msg-input');
    const sendBtn = document.getElementById('send-btn');
    const historySection = document.querySelector('.history-section');
    const newChatBtn = document.querySelector('.new-chat-btn');
    const attachmentBtn = document.getElementById('attachment-btn');
    const fileInput = document.getElementById('file-input');
    const inputArea = document.querySelector('.input-area');

    let isNewChat = true;
    let currentChatId = null; // To track the active chat
    let selectedFile = null; // To hold the selected file for OCR

    // A helper function to pause execution for a given time
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // --- Function to create and append the user's message ---
    const appendUserMessage = (message) => {
        const messageHTML = `
            <div class="chat-message user-message">
                <div class="message-bubble">
                    <p>${message}</p>
                </div>
            </div>
        `;
        chatWindow.insertAdjacentHTML('beforeend', messageHTML);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Scroll to the latest message
    };

    const saveMessageToHistory = (chatId, message) => {
        if (!chatId) return;
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const chat = history.find(c => c.id === chatId);
        if (chat) {
            chat.messages = chat.messages || [];
            chat.messages.push(message);
            localStorage.setItem('chatHistory', JSON.stringify(history));
        }
    };

    // --- Typewriter effect for regular text bubbles ---
    const typeAIResponseChars = async (element, text) => {
        for (const char of text) {
            element.textContent += char;
            if (element.textContent.length % 5 === 0) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
            await sleep(15);
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // --- Typewriter effect for code inside a terminal ---
    const typeCodeInTerminal = async (element, code) => {
        for (const char of code) {
            element.textContent += char;
            const terminalBody = element.closest('.terminal-body');
            if (terminalBody) terminalBody.scrollTop = terminalBody.scrollHeight;
            await sleep(8);
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // --- Renders an AI response instantly without animations (for loading history) ---
    const renderAIMessage = (rawText) => {
        const codeBlockSplitRegex = /(```(?:\w*)\n[\s\S]*?```)/g;
        const parts = rawText.split(codeBlockSplitRegex).filter(Boolean); // Filter out empty strings

        for (const part of parts) {
            const isCodeBlock = part.startsWith('```');
            if (isCodeBlock) {
                const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                const lang = match[1] || 'shell';
                const code = match[2] ? match[2].trim() : '';
                const sanitizedCode = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const terminalHTML = `
                    <div class="chat-message ai-message has-code">
                        <img src="logo.png" alt="AI Avatar" class="message-avatar">
                        <div class="terminal-window">
                            <div class="terminal-header"><span>${lang}</span><button class="copy-btn">Copy</button></div>
                            <div class="terminal-body"><pre><code contenteditable="true" spellcheck="false">${sanitizedCode}</code></pre></div>
                        </div>
                    </div>
                `;
                chatWindow.insertAdjacentHTML('beforeend', terminalHTML);
            } else {
                const textPart = part.trim();
                if (!textPart) continue;
                const formattedText = textPart
                    .replace(/</g, "&lt;").replace(/>/g, "&gt;")
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>');
                const bubbleHTML = `
                    <div class="chat-message ai-message">
                        <img src="logo.png" alt="AI Avatar" class="message-avatar">
                        <div class="message-bubble"><p>${formattedText.replace(/\n/g, '<br>')}</p></div>
                    </div>
                `;
                chatWindow.insertAdjacentHTML('beforeend', bubbleHTML);
            }
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    };

    // --- Shows a live AI response with typewriter animations ---
    const _showAIResponse = async (responsePromise) => {
        // 1. Show "thinking" indicator
        const indicatorId = `indicator-${Date.now()}`;
        const indicatorHTML = `
            <div class="chat-message ai-message" id="${indicatorId}">
                <img src="logo.png" alt="AI Avatar" class="message-avatar">
                <div class="message-bubble typing-bubble">
                    <div class="thinking-text">Cluster AI is thinking...</div>
                    <div class="typing-dots" style="display: none;"><span></span><span></span><span></span></div>
                </div>
            </div>
        `;
        chatWindow.insertAdjacentHTML('beforeend', indicatorHTML);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        const typingIndicator = document.getElementById(indicatorId);

        // 2. Wait for a natural thinking period, then switch to typing dots
        await sleep(1500);
        if (typingIndicator) {
            typingIndicator.querySelector('.thinking-text').style.display = 'none';
            typingIndicator.querySelector('.typing-dots').style.display = 'flex';
        }

        // 3. Wait for the actual AI response text
        const responseText = await responsePromise;

        // 4. Response is ready, remove the indicator and render the animated response
        typingIndicator?.remove();
        
        const codeBlockSplitRegex = /(```(?:\w*)\n[\s\S]*?```)/g;
        const parts = responseText.split(codeBlockSplitRegex).filter(Boolean);

        for (const part of parts) {
            const isCodeBlock = part.startsWith('```');
            if (isCodeBlock) {
                const match = part.match(/```(\w*)\n([\s\S]*?)```/);
                const lang = match[1] || 'shell';
                const code = match[2] ? match[2].trim() : '';
                const terminalHTML = `
                    <div class="chat-message ai-message has-code">
                        <img src="logo.png" alt="AI Avatar" class="message-avatar">
                        <div class="terminal-window">
                            <div class="terminal-header"><span>${lang}</span><button class="copy-btn">Copy</button></div>
                            <div class="terminal-body"><pre><code contenteditable="true" spellcheck="false"></code></pre></div>
                        </div>
                    </div>
                `;
                chatWindow.insertAdjacentHTML('beforeend', terminalHTML);
                const codeElement = chatWindow.lastElementChild.querySelector('code');
                await typeCodeInTerminal(codeElement, code);
            } else {
                const textPart = part.trim();
                if (!textPart) continue;
                const bubbleHTML = `
                    <div class="chat-message ai-message">
                        <img src="logo.png" alt="AI Avatar" class="message-avatar">
                        <div class="message-bubble"><p class="typing-container"></p></div>
                    </div>
                `;
                chatWindow.insertAdjacentHTML('beforeend', bubbleHTML);
                const typingElement = chatWindow.lastElementChild.querySelector('.typing-container');
                // Type out the raw text first for a clean animation.
                await typeAIResponseChars(typingElement, textPart);
                // Then, replace the content with the final, formatted HTML.
                const formattedText = textPart.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
                typingElement.parentElement.innerHTML = `<p>${formattedText.replace(/\n/g, '<br>')}</p>`;
            }
        }

        // 5. Save the raw response to history after it's fully rendered
        saveMessageToHistory(currentChatId, { type: 'ai', content: responseText });
    };

    // --- Public-facing function for text-only input ---
    const getAIResponse = async (userInput) => {
        const responsePromise = generateAIResponse(userInput);
        await _showAIResponse(responsePromise);
    };

    // --- New function to handle file processing with Tesseract.js ---
    const processFile = async (file, accompanyingText) => {
        // 1. Show a simple user message indicating the file was sent.
        appendUserMessage(`File: ${file.name}`);
        saveMessageToHistory(currentChatId, { type: 'user', content: `File: ${file.name}` });

        const category = getFileCategory(file);

        // 2. Create a promise that will resolve with the AI's final response text.
        const processingPromise = (async () => {
            let fileText = '';

            // Step A: Extract text from the file based on its category.
            if (category === 'image' || category === 'pdf') {
                try {
                    const { data: { text } } = await Tesseract.recognize(file, 'eng');
                    fileText = text;
                } catch (error) {
                    console.error("OCR Error:", error);
                    return getRandomResponse(aiResponses.ocrError);
                }
            } else if (category === 'text') {
                try {
                    fileText = await file.text();
                } catch (error) {
                    console.error("Text file read error:", error);
                    return "Sorry, I had an issue reading that text file.";
                }
            } else { // 'unsupported' or 'unknown'
                const extension = file.name.split('.').pop() || 'this type of';
                return getRandomResponse(aiResponses.fileTypeUnsupported).replace('{fileType}', extension);
            }

            // Step B: Pass the extracted text (or lack thereof) to the AI brain.
            if (fileText.trim() || accompanyingText.trim()) {
                const fullQuery = `${accompanyingText}\n\n--- Content from ${file.name} ---\n${fileText}`;
                return generateAIResponse(fullQuery);
            } else {
                // This case handles when OCR finds no text and there's no user message.
                if (category === 'image' || category === 'pdf') {
                    return getRandomResponse(aiResponses.imageRecognitionError);
                } else {
                    return "I analyzed the file, but it appears to be empty.";
                }
            }
        })();

        // 3. Pass this promise to the UI handler.
        await _showAIResponse(processingPromise);
    };

    // --- Function to handle user input from button or Enter key ---
    const handleUserInput = async () => {
        const message = msgInput.value.trim();
        const file = selectedFile;

        if (!message && !file) return;

        // --- History Management: Create a new chat session if needed ---
        if (isNewChat) {
            isNewChat = false;
            const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
            let newChat;
            let title = message || (file ? `File: ${file.name}` : "New Chat");

            const lowerMessage = message.toLowerCase();
            const containsBadWords = fuzzyContainsAny(lowerMessage, aiLogic.badWords.words);
            const containsFrustration = fuzzyContainsAny(lowerMessage, aiLogic.frustrationWords.words);

            if (containsBadWords) {
                title = "Inappropriate Language";
                newChat = { id: Date.now(), title: title, isPlaceholder: true, messages: [] };
            } else if (containsFrustration) {
                title = "User Frustration Request";
                newChat = { id: Date.now(), title: title, isPlaceholder: true, messages: [] };
            } else {
                newChat = { id: Date.now(), title: title, isPlaceholder: false, messages: [] };
            }

            currentChatId = newChat.id;
            history.unshift(newChat);
            localStorage.setItem('chatHistory', JSON.stringify(history));
            await renderHistory(true);
        } else { // --- Placeholder Update Logic ---
            const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
            const currentChat = history.find(c => c.id === currentChatId);
            if (currentChat && currentChat.isPlaceholder) {
                const lowerMessage = message.toLowerCase();
                const containsBadWords = fuzzyContainsAny(lowerMessage, aiLogic.badWords.words);
                const containsFrustration = fuzzyContainsAny(lowerMessage, aiLogic.frustrationWords.words);
                if (!containsBadWords && !containsFrustration) {
                    currentChat.title = message || (file ? `File: ${file.name}` : "New Chat");
                    currentChat.isPlaceholder = false;
                    localStorage.setItem('chatHistory', JSON.stringify(history));
                    await renderHistory(false);
                }
            }
        }

        // --- Clear inputs after grabbing values ---
        msgInput.value = '';
        if (file) {
            selectedFile = null;
            document.getElementById('file-preview')?.remove();
        }

        // --- Process and Send Message ---
        if (file) {
            await processFile(file, message);
        } else if (message) {
            appendUserMessage(message);
            saveMessageToHistory(currentChatId, { type: 'user', content: message });
            await getAIResponse(message);
        }
    };

    // --- Renders the chat history from localStorage ---
    const renderHistory = async (animateFirst = false) => {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        let historyList = historySection.querySelector('ul');
        if (!historyList) {
            historyList = document.createElement('ul');
            historySection.appendChild(historyList);
        }
        historyList.innerHTML = ''; // Clear the list before re-rendering

        const typeWriter = async (element, text) => {
            for (const char of text) {
                element.textContent += char;
                await sleep(20);
            }
        };

        for (let i = 0; i < history.length; i++) {
            const chat = history[i];
            const shortTitle = chat.title.length > 28 ? chat.title.substring(0, 28) + '...' : chat.title;
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.href = "#";
            link.dataset.id = chat.id;
            link.title = chat.title;

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-chat-btn';
            deleteBtn.innerHTML = '&times;'; // A simple 'x' icon
            deleteBtn.dataset.id = chat.id;
            listItem.appendChild(link);
            listItem.appendChild(deleteBtn);
            if (chat.id === currentChatId) {
                listItem.classList.add('active-chat');
            }
            historyList.appendChild(listItem);

            if (i === 0 && animateFirst) {
                // Animate the first item using typewriter
                await typeWriter(link, shortTitle);
            } else {
                // Just set the text for other items
                link.textContent = shortTitle;
            }
        }
    };

    // --- Function to load a chat from history ---
    const loadChat = (chatId) => {
        const history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const chatToLoad = history.find(chat => chat.id === chatId);
        if (!chatToLoad) return;

        currentChatId = chatId;
        isNewChat = false;
        resetConversationContext(); // Reset brain memory for the new context
        chatWindow.innerHTML = ''; // Clear the window

        if (chatToLoad.messages) {
            chatToLoad.messages.forEach(message => {
                if (message.type === 'user') {
                    appendUserMessage(message.content);
                } else if (message.type === 'ai') {
                    renderAIMessage(message.content); // Use the non-animated renderer
                }
            });
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
        renderHistory(); // Re-render to apply active class
    };

    // --- Deletes a chat from history ---
    const deleteChat = (id) => {
        let history = JSON.parse(localStorage.getItem('chatHistory')) || [];
        const chatIndex = history.findIndex(chat => chat.id === id); // Find index before filtering

        history = history.filter(chat => chat.id !== id);
        localStorage.setItem('chatHistory', JSON.stringify(history));
        renderHistory(); // Re-render the list

        // If the deleted chat was the most recent one, start a new chat
        if (chatIndex === 0) {
            startNewChat();
        }
    };

    // --- New Chat Button Logic ---
    const startNewChat = () => {
        chatWindow.innerHTML = '';
        isNewChat = true;
        currentChatId = null; // Reset current chat ID
        resetConversationContext(); // Reset the brain's memory
        msgInput.value = '';
        msgInput.focus();
        renderHistory(); // Re-render to remove active class
    };

    // --- Event Listeners ---
    sendBtn.addEventListener('click', handleUserInput);
    newChatBtn.addEventListener('click', startNewChat);

    // --- Event Listeners for file attachments ---
    attachmentBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            selectedFile = file;
            // Remove any existing preview
            document.getElementById('file-preview')?.remove();
            // Create and show a new preview
            const previewHTML = `
                <div class="file-preview" id="file-preview">
                    <span>${file.name}</span>
                    <button class="remove-file-btn" id="remove-file-btn">&times;</button>
                </div>
            `;
            inputArea.insertAdjacentHTML('beforeend', previewHTML);
        }
    });

    // Use event delegation for dynamically created elements
    historySection.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-chat-btn')) {
            const chatId = parseInt(e.target.dataset.id, 10);
            deleteChat(chatId);
        } else {
            const link = e.target.closest('a');
            if (link) {
                e.preventDefault();
                const chatId = parseInt(link.dataset.id, 10);
                if (chatId !== currentChatId) { // Don't reload if it's already active
                    loadChat(chatId);
                }
            }
        }
    });

    chatWindow.addEventListener('click', (e) => {
        if (e.target.classList.contains('copy-btn')) {
            const code = e.target.closest('.terminal-window').querySelector('code').textContent;
            navigator.clipboard.writeText(code).then(() => {
                e.target.textContent = 'Copied!';
                setTimeout(() => { e.target.textContent = 'Copy'; }, 2000);
            });
        }
    });

    // Use event delegation for the remove file button
    inputArea.addEventListener('click', (e) => {
        if (e.target.id === 'remove-file-btn') {
            selectedFile = null;
            fileInput.value = ''; // Reset the file input
            document.getElementById('file-preview').remove();
        }
    });

    msgInput.addEventListener('keydown', (e) => {
        // If Enter is pressed without Shift, send message
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Prevent new line
            handleUserInput();
        }
    });

    // Initial Load
    renderHistory();
});