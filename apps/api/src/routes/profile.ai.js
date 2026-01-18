import userAiQuotaModel from "../models/userAiQuota.model";
import express from 'express';
const router = express.Router();


router.get("/ai-usage", async (req, res) => {
    const userId = req.user.id;

    const quota = await UserAiQuota.findOne({ userId });

    if (!quota) {
        return res.json({
            totalSeconds: 7200,
            usedSeconds: 0,
            percent: 0
        });
    }

    res.json({
        totalSeconds: quota.totalSeconds,
        usedSeconds: quota.usedSeconds,
        percent: Math.round(
            (quota.usedSeconds / quota.totalSeconds) * 100
        )
    });
});

export default router;
