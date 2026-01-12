import { useEffect, useState } from 'react';
import { fetchChatHistory } from '../../api/ai';
import { speak } from "../../utils/speak";

const domain = 'https://payday-api.onrender.com';
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
    const handleSpeak = (c: any) => {
        if (c.audioUrl) {
            console.log("Playing audio from URL:", c.audioUrl);
            new Audio(c.audioUrl).play();
        } else {
            speak(c.output?.text || c.answer, c.output?.language || "en-IN"); // fallback only
        }
    };

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

                    <button
                        // onClick={() => new Audio(audioUrl).play()}
                        // onClick={() => { speak(c.output?.text || c.answer, c.output?.language || "en-IN"); }}
                        // onClick={() => { handleSpeak(c) }}
                        title="Listen"
                    >
                        {c.audioUrl && (
                            <audio
                                src={domain+c.audioUrl}
                                controls
                                preload="none"
                                className="mt-1"
                            />
                        )}

                    </button>

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