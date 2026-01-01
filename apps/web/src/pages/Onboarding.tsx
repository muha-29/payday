import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Onboarding() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [incomeRange, setIncomeRange] = useState<string | null>(null);

    async function handleSubmit() {
        if (!incomeRange) return;

        setLoading(true);

        const session = await supabase.auth.getSession();
        const token = session.data.session?.access_token;

        await fetch('http://localhost:4000/api/profile/onboarding', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                monthly_income_range: incomeRange,
                onboarding_completed: true
            })
        });

        // ✅ IMPORTANT: force navigation
        navigate('/', { replace: true });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
            <div className="w-full max-w-sm p-4">
                <h2 className="text-lg font-semibold mb-4">
                    How much do you earn?
                </h2>

                {[
                    'Below 10k',
                    '10k - 15k',
                    '15k - 20k',
                    '20k - 25k',
                    'Above 25k'
                ].map(option => (
                    <button
                        key={option}
                        onClick={() => setIncomeRange(option)}
                        className={`w-full py-2 rounded mb-2 border ${incomeRange === option
                                ? 'bg-orange-500 text-white'
                                : 'bg-white'
                            }`}
                    >
                        {option}
                    </button>
                ))}

                <button
                    onClick={handleSubmit}
                    disabled={loading || !incomeRange}
                    className="w-full mt-4 py-2 rounded bg-orange-500 text-white"
                >
                    {loading ? 'Saving…' : 'Continue'}
                </button>
            </div>
        </div>
    );
}
