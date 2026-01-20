import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getIncomes,
  deleteIncome,
  getEarningsChart,
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
import toast from 'react-hot-toast';
import { Trash2 } from 'lucide-react';


type ViewMode = 'daily' | 'weekly' | 'monthly';

type ChartPoint = {
  label: string;
  value: number;
};

export default function EarningsHome() {
  const { t } = useI18n();
  const navigate = useNavigate();

  const [items, setItems] = useState<Income[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [mode, setMode] = useState<ViewMode>('weekly');
  const [loading, setLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);

  /* =======================
     LOAD EARNINGS LIST
  ======================= */
  async function loadIncomes() {
    setLoading(true);
    try {
      const data = await getIncomes();
      setItems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  /* =======================
     LOAD CHART DATA (SERVER)
  ======================= */
  async function loadChart(range: ViewMode) {
    setChartLoading(true);
    try {
      const data = await getEarningsChart(range);
      setChartData(data);
    } catch (e) {
      console.error(e);
    } finally {
      setChartLoading(false);
    }
  }

  /* =======================
     DELETE INCOME
  ======================= */
  async function handleDelete(id: string) {
    await deleteIncome(id);
    toast(t('earningsDeleted'));
    loadIncomes();
    loadChart(mode);
  }

  /* =======================
     EFFECTS
  ======================= */
  useEffect(() => {
    loadIncomes();
    loadChart(mode);
  }, []);

  useEffect(() => {
    loadChart(mode);
  }, [mode]);

  /* =======================
     SUMMARY
  ======================= */
  const total = chartData.reduce(
    (sum, d) => sum + d.value,
    0
  );

  const maxValue = Math.max(
    ...chartData.map(d => d.value),
    1
  );

  return (
    <div className="relative px-4 pb-32 space-y-5">

      {/* ===== TITLE ===== */}
      <h1 className="text-xl font-bold mt-4">
        {t('myEarnings')} 💵
      </h1>

      {/* ===== SUMMARY CARD ===== */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
        <p className="text-xs opacity-90">
          {mode === 'daily'
            ? t('Today')
            : mode === 'weekly'
              ? t('ThisWeek')
              : t('ThisMonth')}
        </p>
        <p className="text-2xl font-bold">
          ₹{total}
        </p>
      </section>

      {/* ===== RANGE TOGGLE ===== */}
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

        {chartLoading ? (
          <div className="h-full flex items-center justify-center text-stone-400">
            {t('loading')}…
          </div>
        ) : (
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
                      fill={`rgba(251,146,60,${0.25 + intensity * 0.75})`}
                    />
                  );
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>

      {/* ===== EARNINGS LIST ===== */}
      {loading ? (
        <div className="text-stone-400">
          {t('loading')}…
        </div>
      ) : (
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
                className="p-2 rounded-full hover:bg-red-50 transition"
                aria-label={t('delete') ?? 'Delete'}
              >
                <Trash2 size={20} className="text-red-500" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* ===== FLOATING ADD BUTTON (UNCHANGED) ===== */}
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
        aria-label="Add earning"
      >
        +
      </button>

    </div>
  );
}