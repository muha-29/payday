import { useEffect, useState } from 'react';
import { getDashboard as fetchDashboard } from '../api/dashboard';
// import { useSession } from '@supabase/auth-helpers-react';

export default function Home() {
    // const session = useSession();
    const [data, setData] = useState<any>(null);

    // useEffect(() => {
    //     if (!session) return;

    //     fetchDashboard(session.access_token)
    //         .then(setData)
    //         .catch(console.error);
    // }, [session]);
    useEffect(() => {
        fetchDashboard()
            .then(setData)
            .catch(console.error);
    }, []);

    if (!data) {
        return (
            <div className="flex items-center justify-center h-full text-gray-400">
                Loading PayDay...
            </div>
        );
    }

    return (
        <div className="space-y-5 px-4 pb-24">
            {/* Earnings Card */}
            <div className="bg-white rounded-xl p-4 shadow">
                <p className="text-gray-500 text-sm">Today’s Earnings</p>
                <h1 className="text-3xl font-bold">₹{data.today}</h1>

                <div className="flex justify-between mt-2 text-sm">
                    <span className="text-green-600">Saved ₹{data.savings}</span>
                    <span className="text-red-500">Spent ₹0</span>
                </div>
            </div>

            {/* AI Insight */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded">
                {data.aiInsight}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
                <Stat label="Weekly" value={data.weekly} />
                <Stat label="Monthly" value={data.monthly} />
                <Stat label="Pending" value={data.pending} />
            </div>
        </div>
    );
}

function Stat({ label, value }: any) {
    return (
        <div className="bg-white p-3 rounded-lg shadow text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="font-semibold">₹{value}</p>
        </div>
    );
}
