import { useState } from 'react';
import { addIncome } from '../../api/income';
import { useNavigate } from 'react-router-dom';
import { speak } from '../../utils/speak';
import { useProfile } from '../../hooks/useProfile';

export default function AddIncome() {
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();
    const profile = useProfile().profile;
    async function handleAdd() {
        if (!amount) return;

        await addIncome({
            amount: Number(amount),
            note: 'manual'
        });
        console.log('profile', profile)
        console.log('profile.language:', profile.language);
        speak(
            `₹${amount} added to your earnings`,
            profile.language
        );

        navigate('/earnings');
    }

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold mb-6">Add Earning 💰</h1>

            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className="w-full text-3xl font-bold text-center border rounded-xl p-4 mb-6"
            />

            <button
                onClick={handleAdd}
                className="w-full py-3 rounded-xl text-white font-semibold
                   bg-gradient-to-r from-orange-500 to-amber-500"
            >
                Save Earning
            </button>
        </div>
    );
}
