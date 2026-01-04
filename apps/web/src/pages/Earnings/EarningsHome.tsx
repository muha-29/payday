import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getIncomes,
  deleteIncome,
  Income
} from '../../api/income';
import { useI18n } from '../../hooks/useI18n';


export default function Earnings() {
  const { t } = useI18n();
  const [items, setItems] = useState<Income[]>([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="relative px-4 pb-32">
      {/* Header */}
      <h1 className="text-xl font-bold my-4"> {t('myEarnings')} 💵</h1>

      {/* Content */}
      {loading && (
        <div className="text-stone-400">{t('loading')}…</div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-stone-400">
          {t('noEarningsYet')} {t('addYourFirstOne')}
        </div>
      )}

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

      {/* Floating Add Button */}
      <button
        onClick={() => navigate('/add-income')}
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
