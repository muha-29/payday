import { computeDashboardStats } from '../services/dashboard.service.js';
import { getDailyInsight } from '../services/ai.service.js';
import { getProfileById } from '../controllers/profile.controller.js';
import { translateFromEnglish } from "../services/sarvam.translate.fromEnglish.js";



export async function getDashboard(req, res) {
    const userId = req.user.id;

    try {
        const userLang = await getProfileById(userId);
        console.log('getDashboard', userLang);
        const stats = await computeDashboardStats(userId);

        let aiInsight = null;
        try {
            aiInsight = await getDailyInsight({
                todayIncome: stats.todayIncome,
                goals: stats.goals
            });
        } catch {
            aiInsight = null; // AI must never block dashboard
        }

        if (userLang != "en-IN") {
            aiInsight = await translateFromEnglish(
                aiInsight,
                userLang
            );
        }

        res.json({
            todayIncome: stats.todayIncome,
            weeklyIncome: stats.weeklyIncome,
            monthlyIncome: stats.monthlyIncome,
            totalSavings: stats.totalSavings,
            pendingSavings: stats.pendingSavings,
            aiInsight
        });

    } catch (err) {
        res.status(500).json({ error: 'Dashboard failed' });
    }
}