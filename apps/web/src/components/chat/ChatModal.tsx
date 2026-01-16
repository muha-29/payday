import { useEffect, useRef, useState } from "react";
import { askAI } from "../../api/ai";
import { useVoice } from "../../hooks/useVoice";
import { ChatBubble } from "./ChatBubble";
import { useProfile } from "../../hooks/useProfile";

import { hasConsent, grantConsent } from "../../utils/consent";
import { PrivacyConsentModal } from "../PrivacyConsentModal";

/* ---------- Types ---------- */

type Message = {
    role: "user" | "ai";
    text: string;          // Native language (displayed)
    english?: string;      // English translation
    audioUrl?: string;    // 🔊 TTS
    timestamp: number;
    language?: string;
};

export function ChatModal({
    onClose,
    language = "en-IN",
}: {
    onClose: () => void;
    language?: string;
}) {
    const { profile } = useProfile();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bodyRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const [cursor, setCursor] = useState<number | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [oldCHats, setOldChats] = useState<any[]>([]);
    const [showVoiceConsent, setShowVoiceConsent] = useState(false);



    /* ---------- Auto focus & scroll ---------- */

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [messages, loading]);

    /* ---------- Unified Send ---------- */

    const sendToAI = async (
        nativeText: string,
        englishText: string,
        lang: string
    ) => {
        if (!englishText.trim() || loading) return;

        const now = Date.now();

        /* 1️⃣ USER bubble (native) */
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                text: nativeText,
                english: englishText,
                language: lang,
                timestamp: now,
                id: 'temp-' + now,
            },
        ]);

        setLoading(true);
        setInput("");

        try {
            /* 2️⃣ AI — ENGLISH ONLY */
            const res = await askAI({
                native: nativeText,
                question: englishText, // ✅ ONLY THIS
                language: profile?.language,
            });

            /* 3️⃣ AI bubble */
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: res.text,        // native
                    english: res.english,  // English
                    audioUrl: res.audioUrl,
                    language: lang,
                    timestamp: Date.now(),
                },
            ]);
        } catch (err) {
            console.error("[AI ERROR]", err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "ai",
                    text: "Sorry, I could not help right now.",
                    timestamp: Date.now(),
                    id: '1',
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const sendVoice = async (
        nativeText: string,
        englishText: string,
        lang: string
    ) => {
        if (loading) return;

        const now = Date.now();

        // 1️⃣ Show USER message (native)
        setMessages(prev => [
            ...prev,
            {
                role: "user",
                text: nativeText,
                english: englishText,
                language: lang,
                timestamp: now,
            }
        ]);

        setLoading(true);

        try {
            // 2️⃣ Send ONLY English to AI
            const res = await askAI({
                native: nativeText,
                question: englishText,
                language: lang,
            });

            // 3️⃣ Show AI response
            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    text: res.text,        // native AI
                    english: res.english,  // English AI
                    language: lang,
                    timestamp: Date.now(),
                    audioUrl: res.audioUrl,
                }
            ]);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Voice ---------- */

    const { start } = useVoice(({ transcript, english, language }) => {
        // sendToAI(transcript, english, language);
        sendVoice(transcript, english, language);
    });

    /* ---------- Typed Input ---------- */

    const sendTyped = () => {
        if (!input.trim()) return;
        sendToAI(input, input, language); // typed text = English
    };

    /* ---------- UI ---------- */

    return (
        <div
            className="fixed inset-0 z-[10000] bg-black/40 flex items-end justify-center"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md h-[70%] bg-white rounded-t-2xl shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-semibold">AI Assistant</span>
                    <button onClick={onClose} aria-label="Close">
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div
                    ref={bodyRef}
                    className="flex-1 p-4 overflow-y-auto space-y-3"
                >
                    {messages.map((m, i) => (
                        <ChatBubble
                            key={i}
                            role={m.role}
                            text={m.text}
                            english={m.english}
                            audioUrl={m.audioUrl}
                            timestamp={m.timestamp}
                            language={m.language}
                        />
                    ))}

                    {loading && (
                        <ChatBubble
                            role="ai"
                            text="Thinking…"
                            timestamp={Date.now()}
                        />
                    )}
                </div>

                {/* Input */}
                <div className="p-3 border-t flex gap-2">
                    <input
                        ref={inputRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type in your language…"
                        className="flex-1 border rounded-lg px-3 py-2"
                        onKeyDown={(e) => e.key === "Enter" && sendTyped()}
                        disabled={loading}
                    />

                    <button
                        onClick={sendTyped}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white"
                    >
                        Send
                    </button>

                    <button
                        onClick={start}
                        disabled={loading}
                        className="px-3 py-2 rounded-lg bg-stone-100"
                        aria-label="Speak"
                    >
                        🎙️
                    </button>
                </div>
            </div>
        </div>
    );
}