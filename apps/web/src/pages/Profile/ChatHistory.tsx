import { useEffect, useState } from "react";
import { fetchChatHistory } from "../../api/ai";
import { apiFetch } from "../../api/api";
import { StarRating } from "../../components/chat/rating";

const API_URL = import.meta.env.VITE_API_BASE_URL;

export default function ChatHistory() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchChatHistory()
            .then(setItems)
            .finally(() => setLoading(false));
    }, []);

    const handleRate = async (id: string, value: number) => {
        // optimistic update
        setItems(prev =>
            prev.map(item =>
                item._id === id ? { ...item, rating: value } : item
            )
        );

        try {
            await apiFetch("/ai/chat/rate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({
                    messageId: id,
                    rating: value
                })
            });
        } catch (err) {
            console.error("Rating failed", err);
        }
    };

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
                    className="bg-white p-4 rounded-xl shadow space-y-2"
                >
                    {/* Timestamp */}
                    <p className="text-xs text-stone-400">
                        {new Date(c.createdAt).toLocaleString()}
                    </p>

                    {/* User message */}
                    <p className="font-medium">
                        🧑 {c.question}
                    </p>

                    {/* AI message */}
                    <p className="text-orange-600">
                        🤖 {c.answer}
                    </p>

                    {/* Audio */}
                    {c.audioUrl && (
                        <audio
                            className="w-full mt-1"
                            controls
                            preload="none"
                            src={`${API_URL}${c.audioUrl}`}
                        />
                    )}

                    {/* ⭐ Rating */}
                    <StarRating
                        value={c.rating ?? null}
                        readonly={c.rating != null}
                        onRate={(v) => handleRate(c._id, v)}
                    />
                </div>
            ))}
        </div>
    );
}