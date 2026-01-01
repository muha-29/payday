import mongoose from 'mongoose';

const VoiceConversationSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },

        intent: {
            type: String,
            enum: ['savings', 'earnings', 'dashboard', 'general'],
            default: 'general'
        },

        input: {
            text: { type: String, required: true },
            language: { type: String }
        },

        output: {
            text: { type: String, required: true },
            language: { type: String },
            audioUrl: { type: String } // 🔊 stored TTS output
        }
    },
    { timestamps: true }
);

export default mongoose.model('VoiceConversation', VoiceConversationSchema);