/**
 * A local knowledge base for common, non-API-based questions.
 * Each key is a unique identifier for a question type.
 * 'keywords' are the phrases the AI will look for in user input.
 * 'answers' is a self-contained array of possible responses.
 */
export const basicQuestions = {
    'purpose': {
        keywords: ['your purpose', 'what do you do', 'what are you for'],
        answers: [
            "My primary purpose is to be a helpful assistant. I can answer questions, provide information from various sources, and even help with tasks like math or coding."
        ]
    },
    'howAreYou': {
        keywords: ['how are you', 'how are you doing', 'hows it going'],
        answers: [
            "As an AI, I don't have feelings, but I'm operating at full capacity and ready to help! How can I assist you today?",
            "I'm functioning perfectly, thank you for asking! What can I do for you?"
        ]
    },
    'capabilities': {
        keywords: ['what can you do', 'your capabilities', 'what are your features', 'what are your skills'],
        answers: [
            "I can answer general knowledge questions, solve math problems, find inspirational quotes, analyze text from images, and even help with some coding. What would you like to try?",
            "My skills include fetching data from Wikipedia and DBpedia, performing calculations, understanding user sentiment, and processing text from files. Feel free to test my capabilities!"
        ]
    },
    'carInfo': {
        keywords: ['what is a car', 'what is car', 'explain car', 'define car', 'about cars', 'tell me about cars'],
        answers: [
            "A car, or automobile, is a wheeled motor vehicle used for transportation. Most definitions of cars say that they run primarily on roads, seat one to eight people, have four wheels, and mainly transport people rather than goods.",
            "Simply put, a car is a private vehicle with four wheels and an engine, designed to carry a small number of people from one place to another."
        ]
    },
    'programmingInfo': {
        keywords: ['what is programming', 'explain programming', 'define programming', 'about programming', 'what is coding'],
        answers: [
            "Programming is the process of creating a set of instructions that tell a computer how to perform a task. These instructions are written in a specific language, like Python, JavaScript, or C++, that the computer can understand.",
            "In simple terms, programming (or coding) is like writing a recipe for a computer to follow. You provide step-by-step commands, and the computer executes them to achieve a specific outcome, like running an application or a website."
        ]
    },
    'yourversion':{
        keywords:['can you say about your version','which version are you'],
        answers:[
            'Ahh! My version is Cluster-AI 3.0 max NLP (basic)',
            'My version is Cluster-AI 3.0 max NLP (basic)'
        ]
    },
    'areyouanLLM': {
    keywords: [
        'are you LLM',
        'are you an LLM',
        'you an LLM',
        'you are a large language model right'
    ],
    answers: [
        'No, I’m not an LLM — I’m a basic NLP chatbot built entirely with vanilla JavaScript.',
        'Nope! I’m just a simple keyword-based AI, not a massive deep-learning model.',
        'I don’t run on neural networks — just plain old JavaScript logic.',
        'No, I’m lightweight and rule-based, not a large language model.'
    ]
}

};
