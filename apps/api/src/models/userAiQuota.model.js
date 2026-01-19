import mongoose from "mongoose";

const UserAiQuotaSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        /* ---------- Limits ---------- */
        totalSeconds: {
            type: Number,
            default: 7200, // 2 hours
        },

        alertAtPercent: {
            type: Number,
            default: 80,
        },

        isUnlimited: {
            type: Boolean,
            default: false,
        },

        /* ---------- Usage ---------- */
        usedSeconds: {
            type: Number,
            default: 0,
        },

        /* ---------- Breakdown (optional analytics) ---------- */
        sttUsedSeconds: {
            type: Number,
            default: 0,
        },
        ttsUsedSeconds: {
            type: Number,
            default: 0,
        },

        /* ---------- Flags ---------- */
        alertSent: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export default mongoose.model("UserAiQuota", UserAiQuotaSchema);