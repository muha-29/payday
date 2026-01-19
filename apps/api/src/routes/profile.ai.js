import express from "express";
import UserAiQuota from "../models/userAiQuota.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const userId = req.headers["x-user-id"];
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const quota =
        (await UserAiQuota.findOne({ userId })) ||
        new UserAiQuota({ userId });

    const percent = quota.isUnlimited
        ? 0
        : Math.round((quota.usedSeconds / quota.totalSeconds) * 100);

    res.json({
        limits: {
            totalSeconds: quota.totalSeconds,
            sttSeconds: quota.totalSeconds, // informational
            ttsSeconds: quota.totalSeconds,
        },
        usage: {
            totalSecondsUsed: quota.usedSeconds,
            sttSecondsUsed: quota.sttUsedSeconds,
            ttsSecondsUsed: quota.ttsUsedSeconds,
        },
        percent: {
            total: percent,
            stt: Math.round(
                (quota.sttUsedSeconds / quota.totalSeconds) * 100
            ),
            tts: Math.round(
                (quota.ttsUsedSeconds / quota.totalSeconds) * 100
            ),
        },
        isUnlimited: quota.isUnlimited,
    });
});

export default router;