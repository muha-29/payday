import Income from '../models/income.model.js';
import Saving from '../models/savings.model.js';
import { computeDashboardStats } from '../services/dashboard.service.js';
import { getDailyInsight } from '../services/ai.service.js';


export async function getDashboard(req, res) {
    const userId = req.user.id;
    const stats = await computeDashboardStats(userId);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth(),
        1
    );

    let aiInsight = null;
    try {
        aiInsight = await getDailyInsight({
            todayIncome: stats.todayIncome,
            goals: stats.goals
        });
    } catch (e) {
        // AI failure should NEVER break dashboard
        aiInsight = null;
    }

    const [todayIncome, weeklyIncome, monthlyIncome] = await Promise.all([
        Income.aggregate([
            { $match: { userId, date: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Income.aggregate([
            { $match: { userId, date: { $gte: startOfWeek } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        Income.aggregate([
            { $match: { userId, date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ])
    ]);

    const savings = await Saving.find({ userId });

    const totalSavings = savings.reduce(
        (sum, g) => sum + (g.savedAmount || 0),
        0
    );

    res.json({
        todayIncome: todayIncome[0]?.total || 0,
        weeklyIncome: weeklyIncome[0]?.total || 0,
        monthlyIncome: monthlyIncome[0]?.total || 0,
        aiInsight,
        totalSavings
    });
}
