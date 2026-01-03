import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavings,
  deleteSavings,
  addSavingsAmount,
  SavingsGoal
} from '../api/savings';

export default function Savings() {
  const [items, setItems] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    const data = await getSavings();
    setItems(data);
    setLoading(false);
  }

  async function handleAddAmount(id: string) {
    const value = prompt('Enter amount to add');
    if (!value) return;
    await addSavingsAmount(id, Number(value));
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this goal?')) return;
    await deleteSavings(id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="relative px-4 pb-32">
      <h1 className="text-xl font-bold my-4">
        Savings Goals 🎯
      </h1>

      {loading && (
        <div className="text-stone-400">Loading…</div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-stone-400">
          No goals yet. Create your first one.
        </div>
      )}

      <ul className="space-y-4">
        {items.map((g) => {
          const percent = Math.min(
            100,
            Math.round(
              (g.savedAmount / g.targetAmount) * 100
            )
          );

          return (
            <li
              key={g._id}
              className="bg-white rounded-2xl p-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    {g.title}
                  </div>
                  <div className="text-xs text-stone-500">
                    ₹{g.savedAmount} / ₹{g.targetAmount}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(g._id)}
                  className="text-red-500 text-sm"
                >
                  Delete
                </button>
              </div>

              {/* Progress */}
              <div className="mt-3">
                <div className="h-2 rounded bg-stone-200 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="text-xs text-stone-500 mt-1">
                  {percent}% completed
                </div>
              </div>

              <button
                onClick={() => handleAddAmount(g._id)}
                className="
                  mt-3 w-full py-2 rounded-xl
                  text-orange-600 font-medium
                  border border-orange-200
                "
              >
                + Add Money
              </button>
            </li>
          );
        })}
      </ul>

      {/* Floating Add Goal Button */}
      <button
        onClick={() => navigate('/add-goal')}
        className="
          fixed bottom-20 right-5
          w-14 h-14 rounded-full
          text-white text-3xl font-bold
          flex items-center justify-center
          shadow-lg
          bg-gradient-to-r from-orange-500 to-amber-500
        "
      >
        +
      </button>
    </div>
  );
}
