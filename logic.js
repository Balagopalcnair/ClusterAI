//logic.js file
//core dictionary

export const aiLogic = {
    questionWords: {
        words: ['what', 'who', 'where', 'is', 'can', 'which', 'there', 'will','i need to know about'],
        meaning: 'Indicates the user is asking a question. Respond with informative answers.'
    },
    greetings: {
        words: ['hello', 'hi', 'hey', 'greetings', 'yo'],
        meaning: 'Greeting detected — respond politely.'
    },
    codeRequestWords: {
        words: ['python', 'script', 'code', 'program', 'javascript', 'java'],
        meaning: 'Request for code or programming help.'
    },
    apiQuoteWords: {
        words: ['quote', 'inspire', 'saying', 'motivation', 'inspirational'],
        meaning: 'User wants an inspirational quote.'
    },
    farewells: {
        words: ['bye', 'goodbye', 'see you', 'later'],
        meaning: 'User is ending the conversation.'
    },
    helpWords: {
        words: ['help', 'assist', 'support','can you please help'],
        meaning: 'User is asking for assistance.'
    },
    followUpQueryWords: {
        words: ['more', 'elaborate', 'continue', 'go on', 'expand on that','thats great i want to know more about the topic'],
        meaning: 'User wants more information on the previous topic.'
    },
    positiveFeedbackWords: {
        words: ['great', 'fine', 'wow', 'nice', 'awesome', 'excellent', 'fantastic', 'wonderful', 'amazing', 'cool', 'thanks', 'thank you','oh thats great'],
        meaning: 'User is expressing satisfaction.'
    },
    badWords: {
        words: ['tits','boobs', 'sex', 'motherfucker', 'fuck me', 'can you sex', 'please fuck', 'dick', 'vagina', 'pussy', 'asshole', 'bitch', 'porn'],
        meaning: 'User is using inappropriate or explicit language.'
    },
    frustrationWords: {
        words: ['fuck this','fuck you','fuck', 'oh shit', 'damn', 'crap', 'this is not working', 'useless', 'stupid', 'error', 'broken','are you an idiot','please do it right'],
        meaning: 'User is expressing frustration with the application or a result.'
    },
    opinionWords: {
        words: ['opinion', 'think', 'believe', 'feel', 'take over the world', 'consciousness'],
        meaning: 'User is asking for an opinion or a philosophical take.'
    },
    identityWords: {
        words: ['who are you', 'what are you', 'your name', 'are you an ai', 'are you human'],
        meaning: 'User is asking about the AI\'s identity.'
    },
    planningWords: {
        words: ['make a plan', 'decide', 'should i', 'help me choose', 'what should i do'],
        meaning: 'User is asking for a decision or plan to be made for them.'
    },
    fillers: {
        words: ["yeah", "ohh", "oh", "hmm", "ah", "okay", "ok", "alright", "right", "mm"],
        meaning :'user understand something or reacting emotionally'

    },
    sademojis: {
        words: ['🥲','😔','😟','☹️','🥺','🥹','😥','😢','😭','😖','😞','😓'],
        meaning: 'user showing sad emotion with emojis '
    },
    fileAnalysisWords: {
        words: ['summarize', 'explain', 'analyze', 'tldr', 'tl;dr', 'what does this mean', 'what is this about', 'rewrite', 'do these'],
        meaning: 'User is asking for a generative analysis of a file, which is not supported.'
    },
    happyemojis: {
        words : ['😀','😃','😄','😁','😆','😂','😊','☺️','😸','🙌','🙋','🙋‍♂️'],
        meaning : 'user showing happy emotion with emojis'
    },
    angryemojis : {
        words : ['😒','😤','😡','😠','🤬','👿'],
        meaning : 'user showing angry emotion with emojis'
    }

};
