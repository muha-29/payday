import mongoose from 'mongoose';

const VoiceConversationSchema = new mongoose.Schema({
    userId: String,

    // USER
    question: String,            // native user text
    englishQuestion: String,     // English sent to LLM

    // AI
    answer: String,              // native AI text
    englishAnswer: String,       // English from LLM

    language: String,            // user language (ta-IN, te-IN)
    intent: String,
    source: String,

    // 🔊 AUDIO
    audioUrl: String,            // <-- THIS WAS MISSING
    ttsLanguage: String,         // optional but useful

}, { timestamps: true });


export default mongoose.model(
    'VoiceConversation',
    VoiceConversationSchema
);
