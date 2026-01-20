import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSavings,
  deleteSavings,
  addSavingsAmount,
  SavingsGoal
} from '../../api/savings';

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

  async function handleQuickAdd(id: string, amount: number) {
    await addSavingsAmount(id, amount);
    load();
  }

  async function handleCustomAdd(id: string) {
    const value = prompt('Enter amount');
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

  const totalSavings = items.reduce(
    (sum, g) => sum + g.savedAmount,
    0
  );

  return (
    <div className="relative px-4 pb-32 space-y-5">

      {/* ===== TOTAL SAVINGS HEADER ===== */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white shadow">
        <p className="text-xs opacity-90">Total Savings</p>
        <h1 className="text-3xl font-bold">₹{totalSavings}</h1>
        <p className="text-xs opacity-90">
          {items.length} active goals
        </p>
      </section>

      <h1 className="text-lg font-semibold">
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

      {/* ===== GOALS ===== */}
      <ul className="space-y-4">
        {items.map((g) => {
          const percent = Math.min(
            100,
            Math.round(
              (g.savedAmount / g.targetAmount) * 100
            )
          );

          const remaining =
            g.targetAmount - g.savedAmount;

          return (
            <li
              key={g._id}
              className="bg-white rounded-2xl p-4 shadow space-y-3"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">
                    {g.name}
                  </p>
                  <p className="text-xs text-stone-500">
                    ₹{g.savedAmount} / ₹{g.targetAmount}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(g._id)}
                  className="text-red-500 text-xs"
                >
                  Delete
                </button>
              </div>

              {/* Progress */}
              <div>
                <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1 text-stone-500">
                  <span>{percent}% completed</span>
                  <span>
                    ₹{remaining} more to go
                  </span>
                </div>
              </div>

              {/* Quick Add */}
              <div className="flex gap-2">
                {[50, 100, 200].map((amt) => (
                  <button
                    key={amt}
                    onClick={() =>
                      handleQuickAdd(g._id, amt)
                    }
                    className="
                      px-3 py-1 text-xs rounded-lg
                      border border-orange-200
                      text-orange-600
                    "
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              {/* Add Money */}
              <button
                onClick={() => handleCustomAdd(g._id)}
                className="
                  w-full py-2 rounded-xl
                  bg-orange-500 text-white
                  font-semibold
                "
              >
                + Add Money
              </button>
            </li>
          );
        })}
      </ul>

      {/* ===== FLOATING ADD GOAL ===== */}
      <button
        onClick={() => navigate('/app/add-goal')}
        className="
          fixed bottom-20 right-5
          w-14 h-14 rounded-full
          text-white text-3xl
          flex items-center justify-center
          shadow-lg
          bg-gradient-to-r from-orange-500 to-amber-500
        "
        aria-label="Create goal"
      >
        +
      </button>

    </div>
  );
}