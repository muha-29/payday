import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getIncomes,
  deleteIncome,
  Income
} from '../../api/income';
import { useI18n } from '../../hooks/useI18n';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

type ViewMode = 'daily' | 'weekly' | 'monthly';

function aggregateEarnings(
  items: Income[],
  mode: 'daily' | 'weekly' | 'monthly'
) {
  const map: Record<string, number> = {};

  items.forEach((i) => {
    const date = new Date(i.date);
    let key = '';

    if (mode === 'daily') {
      key = date.toLocaleDateString('en-IN', { weekday: 'short' });
    }

    if (mode === 'weekly') {
      const week = Math.ceil(date.getDate() / 7);
      key = `Week ${week}`;
    }

    if (mode === 'monthly') {
      key = date.toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric'
      });
    }

    map[key] = (map[key] || 0) + i.amount;
  });

  return Object.entries(map).map(([label, value]) => ({
    label,
    value
  }));
}


export default function Earnings() {
  const { t } = useI18n();
  const [items, setItems] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<ViewMode>('weekly');
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    const data = await getIncomes();
    setItems(data);
    setLoading(false);
  }

  async function handleDelete(id: string) {
    await deleteIncome(id);
    load();
  }

  useEffect(() => {
    load();
  }, []);

  /* ===== SUMMARY ===== */
  const totalWeek = useMemo(
    () => items.reduce((s, i) => s + i.amount, 0),
    [items]
  );

  /* ===== GRAPH DATA ===== */
  const chartData = useMemo(
    () => aggregateEarnings(items, mode),
    [items, mode]
  );

  const maxValue = Math.max(
    ...chartData.map(d => d.value),
    1
  );

  return (
    <div className="relative px-4 pb-32 space-y-5">

      <h1 className="text-xl font-bold mt-4">
        {t('myEarnings')} 💵
      </h1>

      {/* ===== SUMMARY ===== */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
        <p className="text-xs opacity-90">
          {t('ThisWeek') ?? 'This Week'}
        </p>
        <p className="text-2xl font-bold">
          ₹{totalWeek}
        </p>
      </section>

      {/* ===== TOGGLE ===== */}
      <div className="flex bg-stone-100 rounded-xl p-1">
        {(['daily', 'weekly', 'monthly'] as ViewMode[]).map(v => (
          <button
            key={v}
            onClick={() => setMode(v)}
            className={`flex-1 py-1 rounded-lg text-sm ${mode === v
              ? 'bg-white shadow font-semibold'
              : 'text-stone-500'
              }`}
          >
            {t(v) ?? v}
          </button>
        ))}
      </div>

      {/* ===== BAR CHART ===== */}
      <section className="bg-white rounded-2xl p-4 shadow h-64">
        <p className="text-xs font-semibold mb-3 text-stone-500">
          {t('IncomeOverview') ?? 'Income Overview'}
        </p>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10 }}
            />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => {
                const intensity = entry.value / maxValue;
                return (
                  <Cell
                    key={index}
                    fill={`rgba(251,146,60,${0.3 + intensity * 0.7})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ===== EARNINGS LIST ===== */}
      <ul className="space-y-3">
        {items.map((i) => (
          <li
            key={i._id}
            className="flex items-center justify-between p-4 rounded-2xl bg-white shadow-sm"
          >
            <div>
              <div className="text-lg font-semibold">
                ₹{i.amount}
              </div>
              <div className="text-xs text-stone-500">
                {new Date(i.date).toDateString()}
              </div>
            </div>

            <button
              onClick={() => handleDelete(i._id)}
              className="text-red-500 text-sm"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* ===== FLOATING ADD (UNCHANGED) ===== */}
      <button
        onClick={() => navigate('/app/add-income')}
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