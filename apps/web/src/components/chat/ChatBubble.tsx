import { useRef, useState } from "react";
import { apiFetch } from "../../api/api";
import { StarRating } from "./rating";
const API_URL = import.meta.env.VITE_API_BASE_URL;

type ChatBubbleProps = {
    role: "user" | "ai";
    text: string;           // Native language
    english?: string;       // English translation
    timestamp: number;
    language?: string;
    audioUrl?: string;
    rating?: number | null;
    id?: string;
};

export function ChatBubble({
    role,
    text,
    english,
    timestamp,
    language,
    audioUrl,
    rating,
    id
}: ChatBubbleProps) {
    const isUser = role === "user";
    const [showEnglish, setShowEnglish] = useState(false);
    const [localRating, setLocalRating] = useState<number | null>(rating || null);
    const isSpeakingRef = useRef(false);

    const time = new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    /* ---------- Rating handler ---------- */
    const handleRate = async (value: number) => {
        if (!id || localRating != null) return;

        setLocalRating(value); // ⭐ optimistic UI

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
            setLocalRating(null); // rollback if needed
        }
    };


    console.log('ChatBubble render:', { id, role, rating, audioUrl });
    return (
        <div
            className={`flex flex-col ${isUser ? "items-end" : "items-start"
                }`}
        >
            {/* Name */}
            <span className="text-xs text-stone-500 mb-1">
                {isUser ? "You" : "AI Assistant"}
            </span>

            {/* Bubble */}
            <div
                className={`relative px-4 py-2 rounded-2xl max-w-[80%] ${isUser
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-stone-100 text-stone-900 rounded-bl-sm"
                    }`}
            >
                {text}

                {/* 🔊 Speaker (AI only) */}
                {/* 🔊 TTS */}
                {audioUrl && (
                    <button
                        onClick={() => new Audio(audioUrl).play()}
                        // onClick={()=>{speak(text, language || "en-IN");}}
                        title="Listen"
                    >
                        <audio
                            src={`${API_URL}${audioUrl}`}
                            controls
                            preload="none"
                            className="mt-1"
                        />                    </button>

                )}
                {role === "ai" && id && (
                    console.log('Rating value:', id, rating),
                    <StarRating
                        value={localRating}
                        readonly={localRating != null}
                        onRate={handleRate}
                    />
                )}


                {/* ℹ️ English toggle (AI only, if exists) */}
                {!isUser && english && (
                    <button
                        onClick={() => setShowEnglish(v => !v)}
                        className="
              absolute -left-8 top-1/2 -translate-y-1/2
              text-stone-500 hover:text-blue-500
            "
                        title="View English"
                        aria-label="View English translation"
                    >
                        ℹ️
                    </button>
                )}
            </div>

            {/* 🔽 English translation panel */}
            {showEnglish && english && (
                <div
                    className="
            mt-1 px-3 py-2
            max-w-[80%]
            text-xs text-stone-600
            bg-stone-50
            border border-stone-200
            rounded-lg
          "
                >
                    <span className="font-semibold">English:</span> {english}
                </div>
            )}

            {/* Time */}
            <span className="text-[10px] text-stone-400 mt-1">
                {time}
            </span>
        </div>
    );
}