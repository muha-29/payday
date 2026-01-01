import mongoose from 'mongoose';

const SavingsSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },

        name: { type: String, required: true },

        icon: {
            type: String,
            default: '🎯' // sensible default
        },

        targetAmount: { type: Number, required: true },
        savedAmount: { type: Number, default: 0 }
    },
    { timestamps: true }
);

export default mongoose.model('Savings', SavingsSchema);
