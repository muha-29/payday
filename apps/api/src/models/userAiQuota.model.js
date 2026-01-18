import mongoose from "mongoose";

const UserAiQuotaSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },

    // Configurable limits
    totalSeconds: { type: Number, default: 7200 }, // 🔥 2 hours default
    alertAtPercent: { type: Number, default: 80 },

    // Usage
    usedSeconds: { type: Number, default: 0 },

    // Flags
    alertSent: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model("UserAiQuota", UserAiQuotaSchema);