/**
 * Build user financial context for AI
 * This is the ONLY place where AI context is assembled (DRY)
 */

import Income from '../models/income.model.js';
import Savings from '../models/savings.model.js';

/**
 * Helpers
 */
function getTodayRange() {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
}

async function sumIncome(match) {
    const result = await Income.aggregate([
        { $match: match },
        { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    return result[0]?.total || 0;
}

/**
 * Build AI context based on intent
 */
export async function buildContext(userId, intent = 'general') {
    const context = {
        date: new Date().toISOString().slice(0, 10)
    };

    const tasks = [];
    const results = {};

    // Earnings-related context
    if (intent === 'earnings' || intent === 'dashboard') {
        const { start, end } = getTodayRange();

        tasks.push(
            sumIncome({
                userId,
                date: { $gte: start, $lte: end }
            }).then((v) => (results.todayIncome = v)),

            sumIncome({ userId }).then(
                (v) => (results.totalIncome = v)
            )
        );
    }

    // Savings-related context
    if (intent === 'savings' || intent === 'dashboard') {
        tasks.push(
            Savings.find({ userId }).lean().then((goals) => {
                results.goals = goals;
                results.totalSavings = goals.reduce(
                    (sum, g) => sum + (g.savedAmount || 0),
                    0
                );
            })
        );
    }

    // Execute all required queries in parallel
    await Promise.all(tasks);

    // Normalize output (stable shape)
    if (results.todayIncome !== undefined) {
        context.todayIncome = results.todayIncome;
    }

    if (results.totalIncome !== undefined) {
        context.totalIncome = results.totalIncome;
    }

    if (results.goals) {
        context.totalSavings = results.totalSavings;
        context.goals = results.goals.map((g) => ({
            name: g.name,
            target: g.targetAmount,
            saved: g.savedAmount
        }));
    }

    if (intent === 'general') {
        context.message =
            'User asked a general finance-related question.';
    }

    return context;
}