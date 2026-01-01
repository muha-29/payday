import { connectDB as db } from '../db.js';

/**
 * Add earning
 */
export async function addEarning(req, res) {
    const { amount, source, notes } = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const doc = {
        user_id: req.user.id,
        amount,
        source: source || 'other',
        notes: notes || '',
        date: new Date()
    };

    await db.collection('earnings').insertOne(doc);
    res.status(201).json(doc);
}

/**
 * List earnings
 */
export async function listEarnings(req, res) {
    const earnings = await db
        .collection('earnings')
        .find({ user_id: req.user.id })
        .sort({ date: -1 })
        .limit(100)
        .toArray();

    res.json(earnings);
}

/**
 * Today summary
 */
export async function todayEarnings(req, res) {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const result = await db
        .collection('earnings')
        .aggregate([
            {
                $match: {
                    user_id: req.user.id,
                    date: { $gte: start }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ])
        .toArray();

    res.json({ total: result[0]?.total || 0 });
}

/**
 * Weekly / Monthly stats
 */
export async function earningsStats(req, res) {
    const now = new Date();

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);

    const monthStart = new Date(now);
    monthStart.setDate(1);

    const [weekly, monthly] = await Promise.all([
        db
            .collection('earnings')
            .aggregate([
                { $match: { user_id: req.user.id, date: { $gte: weekStart } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            .toArray(),
        db
            .collection('earnings')
            .aggregate([
                { $match: { user_id: req.user.id, date: { $gte: monthStart } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ])
            .toArray()
    ]);

    res.json({
        weekly: weekly[0]?.total || 0,
        monthly: monthly[0]?.total || 0
    });
}
