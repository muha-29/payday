import Savings from '../models/savings.model.js';

/**
 * GET /api/savings
 * List all savings goals for the logged-in user
 */
export async function listSavings(req, res) {
  const userId = req.user.id;

  const goals = await Savings.find({ userId }).sort({
    createdAt: -1
  });

  res.json(goals);
}

/**
 * POST /api/savings
 * Create a new savings goal
 */
export async function createSavings(req, res) {
  const { title, targetAmount } = req.body;

  if (!title || !targetAmount) {
    return res.status(400).json({ error: 'title and targetAmount required' });
  }

  const goal = await Savings.create({
    userId: req.user.id,
    name: title,
    targetAmount,
    icon: '🎯' // server-owned default
  });

  res.status(201).json(goal);
}

/**
 * PATCH /api/savings/:id
 * Update savings goal details (name, target, status, etc.)
 */
export async function updateSavings(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const goal = await Savings.findOneAndUpdate(
    { _id: id, userId },
    req.body,
    { new: true }
  );

  if (!goal) {
    return res.status(404).json({ message: 'Savings goal not found' });
  }

  res.json(goal);
}

/**
 * DELETE /api/savings/:id
 * Delete a savings goal
 */
export async function deleteSavings(req, res) {
  const userId = req.user.id;
  const { id } = req.params;

  const result = await Savings.deleteOne({
    _id: id,
    userId
  });

  if (result.deletedCount === 0) {
    return res.status(404).json({ message: 'Savings goal not found' });
  }

  res.status(204).end();
}

/**
 * POST /api/savings/:id/add
 * Add money to a savings goal
 */
export async function addSavingsAmount(req, res) {
  const userId = req.user.id;
  const { id } = req.params;
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  const goal = await Savings.findOneAndUpdate(
    { _id: id, userId },
    { $inc: { savedAmount: amount } },
    { new: true }
  );

  if (!goal) {
    return res.status(404).json({ message: 'Savings goal not found' });
  }

  // Auto-complete if target reached
  if (goal.savedAmount >= goal.targetAmount) {
    goal.status = 'completed';
    await goal.save();
  }

  res.json(goal);
}
