import { useEffect, useState } from 'react';
import { fetchChatHistory } from '../../api/ai';

export default function ChatHistory() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChatHistory()
            .then(setItems)
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return <div className="p-4">Loading…</div>;
    }

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-lg font-semibold">
                Your Conversations
            </h2>

            {items.map((c) => (
                <div
                    key={c._id}
                    className="bg-white p-4 rounded-xl shadow"
                >
                    <p className="text-xs text-stone-400">
                        {new Date(c.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-2 font-medium">
                        🧑 {c.input?.text || c.question}
                    </p>

                    <p className="mt-2 text-orange-600">
                        🤖 {c.output?.text || c.answer}
                    </p>

                    {c.output?.audioUrl && (
                        <audio
                            className="mt-2 w-full"
                            controls
                            src={c.output.audioUrl}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}