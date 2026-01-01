import Income from '../models/income.model.js';
import Savings from '../models/savings.model.js';

/**
 * Compute dashboard stats for a user
 */
export async function computeDashboardStats(userId) {
    // --- Date helpers ---
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
        startOfToday.getFullYear(),
        startOfToday.getMonth(),
        1
    );

    // --- Queries in parallel ---
    const [
        todayIncomeAgg,
        monthlyIncomeAgg,
        savingsGoals
    ] = await Promise.all([
        Income.aggregate([
            { $match: { userId, date: { $gte: startOfToday } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),

        Income.aggregate([
            { $match: { userId, date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),

        Savings.find({ userId, status: 'active' })
    ]);

    const todayIncome = todayIncomeAgg[0]?.total || 0;
    const monthlyIncome = monthlyIncomeAgg[0]?.total || 0;

    const totalSaved = savingsGoals.reduce(
        (sum, g) => sum + (g.savedAmount || 0),
        0
    );

    return {
        todayIncome,
        monthlyIncome,
        totalSaved,
        goals: savingsGoals.map((g) => ({
            id: g._id,
            name: g.name,
            targetAmount: g.targetAmount,
            savedAmount: g.savedAmount
        }))
    };
}
