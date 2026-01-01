import { useState } from 'react';
import { createGoal } from '../api/savings';
import { useNavigate } from 'react-router-dom';

export default function CreateGoal() {
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const navigate = useNavigate();

    async function submit() {
        await createGoal({
            title: name,
            targetAmount: Number(amount)
        });
        navigate('/savings');
    }

    return (
        <div>
            <div className="sticky top-0 bg-white z-20 border-b px-4 py-3">
                <h1 className="text-xl font-bold">New Goal 🎯</h1>
            </div>

            <div className="px-4 pt-4 space-y-4">
                <input
                    className="w-full border p-3 rounded-xl"
                    placeholder="Goal name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />

                <input
                    className="w-full border p-3 rounded-xl"
                    placeholder="Target amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                />

                <button
                    onClick={submit}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                >
                    Create Goal
                </button>
            </div>
        </div>
    );
}
