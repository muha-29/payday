import mongoose from 'mongoose';

const VoiceConversationSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },

        question: {
            type: String,
            required: true,
            trim: true
        },

        answer: {
            type: String,
            required: true,
            trim: true
        },

        language: {
            type: String,
            default: 'en-IN'
        },

        intent: {
            type: String,
            enum: [
                'dashboard',
                'income',
                'savings',
                'goal',
                'general',
                'unknown'
            ],
            default: 'general'
        },

        source: {
            type: String,
            enum: ['voice', 'text'],
            default: 'voice'
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model(
    'VoiceConversation',
    VoiceConversationSchema
);
