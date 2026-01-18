import UserAiQuota from "../models/userAiQuota.model.js";

export async function trackAiUsage(userId, seconds) {
    const quota = await UserAiQuota.findOneAndUpdate(
        { userId },
        { $inc: { usedSeconds: seconds } },
        { new: true, upsert: true }
    );
    console.log('quota', quota);
    const percent = Math.round(
        (quota.usedSeconds / quota.totalSeconds) * 100
    );
    console.log('percent', percent);
    // 🔔 80% alert (once)
    if (
        percent >= quota.alertAtPercent &&
        !quota.alertSent
    ) {
        quota.alertSent = true;
        await quota.save();

        // trigger notification (bell / email / UI)
        console.log(`⚠️ User ${userId} reached ${percent}% AI quota`);
    }

    return quota;
}