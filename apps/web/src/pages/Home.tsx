import { useEffect, useState } from 'react';
import { getDashboard as fetchDashboard } from '../api/dashboard';
import { useI18n } from '../hooks/useI18n';
import { useNavigate } from 'react-router-dom';

type DashboardData = {
    todayIncome: number;
    weeklyIncome: number;
    monthlyIncome: number;
    totalSavings: number;
    pendingSavings: number;
    aiInsight: string | null;
};

export default function Home() {
    const { t } = useI18n();
    const [data, setData] = useState<DashboardData | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboard()
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                {t('loadingProfile')}...
            </div>
        );
    }

    return (
        <div className="space-y-6 px-4 pb-28">

            {/* ===== TODAY EARNINGS ===== */}
            <section className="bg-white rounded-2xl p-4 shadow space-y-3">
                <p className="text-sm text-gray-500">
                    {t('todayEarnings')}
                </p>

                <h1 className="text-4xl font-bold">
                    ₹{data.todayIncome}
                </h1>

                <div className="flex justify-between text-sm pt-2 border-t">
                    <span className="text-green-600">
                        {t('saved')} ₹{data.totalSavings}
                    </span>
                    {/* <span className="text-orange-600">
                        {t('pending')} ₹{data.pendingSavings}
                    </span> */}
                </div>

                <button
                    className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"
                    onClick={() => navigate('/app/add-income')}
                >
                    + {t('addEarning')}
                </button>
            </section>

            {/* ===== AI INSIGHT ===== */}
            {data.aiInsight && (
                <section className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-lg text-sm space-y-3">
                    <p className="font-semibold">{t('aiInsight')}</p>

                    <p className="text-gray-700">
                        {data.aiInsight}
                    </p>

                    <button
                        className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold"
                        onClick={() => navigate('/app/add-goal')}
                    >
                        + {t('addSavings')}
                    </button>
                </section>
            )}

            {/* ===== QUICK STATS ===== */}
            <section>
                <p className="text-sm font-semibold mb-2 text-gray-700">
                    {t('QuickStats')}
                </p>

                <div className="grid grid-cols-2 gap-3">
                    <Stat
                        label={t('weekly')}
                        value={data.weeklyIncome}
                    />
                    <Stat
                        label={t('monthly')}
                        value={data.monthlyIncome}
                    />
                    {/* <Stat
                        label={t('pending')}
                        value={data.pendingSavings}
                    /> */}
                </div>
            </section>

        </div>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="bg-white rounded-xl p-3 shadow text-center">
            <p className="text-[11px] text-gray-500">
                {label}
            </p>
            <p className="text-lg font-bold text-gray-900">
                ₹{value}
            </p>
        </div>
    );
}