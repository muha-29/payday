import { Income } from '../models/index.js';

export async function getIncomes(req, res) {
  const incomes = await Income.find({ userId: req.user.id }).sort({ date: -1 });
  res.json(incomes);
}

export async function addIncome(req, res) {
  const income = await Income.create({
    userId: req.user.id,
    amount: req.body.amount,
    note: req.body.note
  });
  res.status(201).json(income);
}

export async function deleteIncome(req, res) {
  await Income.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.status(201).json({message : 'Deleted'});
}
export async function updateIncome(req, res) {
  const updatedIncome = await Income.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    {
      amount: req.body.amount,
      note: req.body.note,
      date: req.body.date
    },
    { new: true }
  );
  res.json(updatedIncome);

  res.sendStatus(200);
}

export async function getTodayIncome(req, res) {
  const userId = req.user.id;

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const total = await Income.aggregate([
    { $match: { userId, date: { $gte: start } } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);

  res.json({
    total: total[0]?.total || 0
  });
}