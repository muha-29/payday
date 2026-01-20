import Income from '../models/income.model.js';
import Saving from '../models/savings.model.js';

export async function computeDashboardStats(userId) {
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

    const [
        todayIncomeAgg,
        weeklyIncomeAgg,
        monthlyIncomeAgg,
        savings
    ] = await Promise.all([
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
        ]),
        Saving.find({ userId })
    ]);

    const totalSavings = savings.reduce(
        (sum, g) => sum + (g.savedAmount || 0),
        0
    );

    const pendingSavings = savings.reduce(
        (sum, g) =>
            sum + Math.max(0, g.targetAmount - g.savedAmount),
        0
    );

    return {
        todayIncome: todayIncomeAgg[0]?.total || 0,
        weeklyIncome: weeklyIncomeAgg[0]?.total || 0,
        monthlyIncome: monthlyIncomeAgg[0]?.total || 0,
        totalSavings,
        pendingSavings,
        goals: savings // needed by AI
    };
}