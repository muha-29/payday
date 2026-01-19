import UserAiQuota from "../models/userAiQuota.model.js";

/**
 * @param userId string
 * @param seconds number
 * @param type "stt" | "tts"
 */
export async function trackAiUsage(userId, seconds, type = "stt") {
    if (!userId || !seconds) return;

    const inc = {
        usedSeconds: seconds,
    };

    if (type === "stt") inc.sttUsedSeconds = seconds;
    if (type === "tts") inc.ttsUsedSeconds = seconds;

    const quota = await UserAiQuota.findOneAndUpdate(
        { userId },
        { $inc: inc },
        { new: true, upsert: true }
    );

    if (quota.isUnlimited) return quota;

    const percent = Math.round(
        (quota.usedSeconds / quota.totalSeconds) * 100
    );

    /* ---------- 80% alert (once) ---------- */
    if (percent >= quota.alertAtPercent && !quota.alertSent) {
        quota.alertSent = true;
        await quota.save();

        console.warn(
            `⚠️ User ${userId} reached ${percent}% AI quota`
        );
        // later → bell notification / email
    }

    return quota;
}