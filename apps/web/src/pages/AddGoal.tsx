import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGoal } from '../api/savings';
import { useI18n } from '../hooks/useI18n';

export default function AddGoal() {
    const { t } = useI18n();
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    async function handleSave() {
        if (!title || !amount) return;
        await createGoal({
            title,
            targetAmount: Number(amount)
        });
        navigate('/savings');
    }

    return (
        <div className="px-4 pt-4">
            <h1 className="text-xl font-bold mb-4">
                {t('addEarning')}
            </h1>

            <input
                className="w-full mb-3 p-3 rounded-xl border"
                placeholder={t('goalName')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                type="number"
                className="w-full mb-6 p-3 rounded-xl border"
                placeholder={t('targetAmount')}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
            />

            <button
                onClick={handleSave}
                className="
          w-full py-3 rounded-xl text-white font-semibold
          bg-gradient-to-r from-orange-500 to-amber-500
        "
            >
                {t('addEarning')}
            </button>
        </div>
    );
}
