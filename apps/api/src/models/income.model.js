import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true, index: true },
        amount: { type: Number, required: true },
        note: { type: String },
        date: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

export default mongoose.model('Income', IncomeSchema);
