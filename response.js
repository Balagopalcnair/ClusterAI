//response.js file
//Core of AI response pattern

export const aiResponses = {
    greeting: [
        "Hello there! How can I assist you today?😀",
        "Hi! What can I help you with?",
        "Greetings! How may I be of service?☺️"
    ],
    codeHelp: [
        "I can provide some code snippets🧑‍💻. What programming language or concept are you interested in? For example, you could ask for a 'python hello world' script.",
        "Of course! I have a library of code examples. What are you looking for? You can try asking for 'javascript fetch api'.",
        "I'd be happy to help with some code. What do you need a script for?"
    ],
    codeSnippet: [
        "Certainly! Here is a code snippet for you in {language}:\n```{language}\n{code}\n```",
        "Here you go! A {language} script to help you get started:\n```{language}\n{code}\n```"
    ],
    apiQuote: [
        'Here is a quote for you:\n\n> "{quote}"\n> — {author}',
        'I found this inspirational quote:\n\n> "{quote}"\n> — {author}'
    ],
    farewell: [
        "Goodbye! Have a great day. 👋",
        "Farewell! Let me know if you need anything else.",
        "See you later! 😊"
    ],
    help: [
        "I can help with a variety of topics, including generating code snippets. What do you need support with? 🙋",
        "Certainly. I can assist with programming questions, general knowledge, and more. What's on your mind?",
        "I'm here to help. What can I do for you?"
    ],
    // New math categories
    mathResult: [
        "The result is {result}. 🧮",
        "I calculated it to be {result}.",
        "That comes out to {result}."
    ],
    mathError: [
        "I'm sorry, I encountered an error with that calculation: {error}"
    ],
    calculus: [
        "That looks like a calculus question! While I can handle basic arithmetic, advanced topics like differentiation and integration are still under development for me."
    ],
    positiveFeedback: [
        "You're welcome! I'm glad I could help. 😊",
        "Great! Let me know if you need anything else. 👍",
        "Awesome! Is there anything else I can assist with? ✨"
    ],
    // New categories for moderation and empathy
    badwordResponse: [
        "I am not programmed to respond to inappropriate language. Please keep our conversation respectful.",
        "I cannot engage with this type of content. Let's focus on a different topic. 🚫",
        "This line of questioning is not productive. How else can I help you?"
    ],
    frustrationWithoutContext: [
        "I understand this can be frustrating. Let's try to solve it together. Could you describe the issue in more detail?",
        "It sounds like you're having trouble. I'm here to help. What seems to be the problem?",
        "I'm sorry you're feeling frustrated. Let's take a step back. What were you trying to accomplish?"
    ],
    frustrationWithContext: [
        "I'm sorry the last response wasn't helpful. Could you tell me what was wrong so I can try again?",
        "I understand you're frustrated with my previous answer. How can I improve it for you?",
        "Apologies if that wasn't what you were looking for. What specifically was the issue with my last response?"
    ],
    frustrationSpam: [
        "It seems like you're still having trouble. Perhaps taking a short break would help clear your mind. I'll be here when you get back.",
        "I can sense your frustration. Sometimes stepping away for a moment is the best solution. Let's try again in a little while.",
        "I'm sorry I'm not being more helpful. Let's pause for a moment. I'll be ready to try again when you are."
    ],
    // New category for questionWords
    question: [
        "That sounds like a question. Let me think... 🤔",
        "You’re asking something interesting — here’s what I know...",
        "Hmm, a question! I’ll do my best to answer."
    ],
    friendlyQuestionResponse: [
        "Ah, an interesting question! Let me see... here's what I found: 💡",
        "Okay, let's dive into that. Here is what I know: 🧐",
        "Hmm, great question! I'll look that up for you. It seems that:"
    ],
    structuredIntro: [
        "Of course! Here’s a quick introduction to **{title}**.",
        "Certainly. Let's break down the topic of **{title}**."
    ],
    structuredConclusion: [
        "In conclusion, that's a brief overview of the topic. I hope this helps! 👍",
        "And that's the gist of it! Let me know if you want to dive deeper on any point. ✅"
    ],
    dbpediaIntro: [
        "From a structured data perspective, DBpedia adds this summary:",
        "To provide a more technical viewpoint, here's what DBpedia says: 🤓",
        "Additionally, the DBpedia knowledge base offers this abstract:"
    ],
    fillerAcknowledgement: [
        "Take your time.",
        "I'm here when you're ready.",
        "Just let me know what you're thinking."
    ],
    sadResponse: [
        "It seems like you're feeling down. I'm here to listen if you want to talk. 😟",
        "I'm sorry to hear that. I hope things get better for you soon. 😥",
        "Sending you some positive vibes. 😔"
    ],
    happyResponse: [
        "I'm glad to see you're in a good mood! 😄",
        "That's great to hear! Your positivity is contagious! 😊",
        "Awesome! Keep that great energy going! ✨"
    ],
    angryResponse: [
        "It sounds like you're upset. If there's anything I can do to help, please let me know. 😠",
        "I understand you're feeling angry. Sometimes taking a deep breath can help. 😤",
        "I'm sorry you're feeling this way. Let's try to work through it. 😡"
    ],
    opinionResponse: [
        "As an AI, I don't have personal opinions, beliefs, or feelings. My goal is to provide information based on the data I was trained on. 🤖",
        "That's a fascinating philosophical question! However, I'm a language model and don't possess consciousness or personal views. I can only process information.",
        "Questions like that are interesting to think about! My programming is focused on providing factual information, not forming personal opinions."
    ],
    identityResponse: [
        "I am Cluster-AI, a large language model designed to be a helpful and informative assistant.",
        "You're chatting with Cluster-AI. I'm a computer program created to help you with your questions. 💻",
        "I am an AI assistant. You can ask me questions, and I'll do my best to find the answers for you."
    ],
    planningResponse: [
        "I can provide you with information and options to help you make a decision, but I can't make personal plans or choices for you. What information would be helpful?",
        "That sounds like an important decision! While I can't make the choice for you, I can help you research or weigh the pros and cons. What are you trying to decide on? ⚖️",
        "As an AI, I can't create personal plans. However, if you tell me your goal, I can offer information that might help you build your own plan."
    ],
    default: [
        "I'm not sure how to respond to that yet. I am still learning. Could you rephrase your request?",
        "My apologies, I don't understand. Could you try asking in a different way? 😕",
        "I'm still in development and can't answer that. Please try another question."
    ],
    apiError: [
        "I'm sorry, I had trouble fetching that information from my external service. Please try again later. 📡"
    ],
    ocrError: [
        "I'm sorry, I had trouble reading that file. It might be corrupted or in a format I can't process.",
        "Apologies, an error occurred during text extraction. Please try a different file."
    ],
    imageRecognitionError: [
        "I can see the file you uploaded, but my pattern recognition for images is currently limited. I was unable to find any readable text in this one.",
        "Thanks for the image. My ability to understand the content of pictures is still developing, and I couldn't find any text to analyze here."
    ],
    codeIdentification: [
        "That looks like some {language} code! What would you like to do with it? I can try to explain it, or you can ask me for a different snippet. 🤓",
        "I see you've pasted some {language} code. Is there anything specific you'd like to know about it? 🤔",
        "Thanks for sharing that {language} snippet. Do you have a question about it, or would you like me to find a different example for you?"
    ],
    fileTypeUnsupported: [
        "I see you've uploaded a {fileType} file. Unfortunately, I can't process this type of file at the moment. I can handle images, PDFs, and plain text files. 📁",
        "Thanks for the file. However, my capabilities are currently limited to images, PDFs, and text files. I'm unable to analyze a {fileType} file. 😕"
    ],
    fileAnalysisNotPossible: [
        "I've processed your file '{fileName}'. However, my capabilities are currently focused on answering specific questions or looking up topics. I can't perform general commands like 'summarize' or 'explain' on custom text just yet. 🤖",
        "Thanks for the file '{fileName}'. While I can read it, I can't analyze or summarize its content directly. You could ask me a specific question about a topic mentioned in the file, and I can try to look that up for you!",
        "Got it. I have the content of '{fileName}'. My apologies, but my current programming doesn't allow for open-ended analysis of file content. I am designed to find answers to factual questions."
    ]
};
