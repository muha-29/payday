import { useEffect, useRef, useState } from "react";
import { askAI } from "../../api/ai";
import { useVoice } from "../../hooks/useVoice";
import { ChatBubble } from "./ChatBubble";
import { useProfile } from "../../hooks/useProfile";
import { useI18n } from '../../hooks/useI18n';
import { fetchChatHistory } from '../../api/ai';
/* ---------- Types ---------- */

type Message = {
    id?: string;
    role: "user" | "ai";
    text: string;
    english?: string;
    audioUrl?: string;
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
    const { t } = useI18n();
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

    useEffect(() => {
        // loadLatestHistory();
    }, []);

    /* ---------- Unified Send ---------- */
    const loadLatestHistory = async () => {
        setLoadingHistory(true);

        const res = await fetch("/api/ai/history?limit=20", {
            credentials: "include",
        });
        const data = await res.json();

        const mapped = data.items.map(mapServerMessage);

        setMessages(mapped.reverse()); // 👈 oldest → newest for UI
        setCursor(data.nextCursor ? new Date(data.nextCursor).getTime() : null);
        setHasMore(!!data.nextCursor);
        setLoadingHistory(false);
    };

    const handleScroll = async () => {
        if (!bodyRef.current || loadingHistory || !hasMore) return;

        if (bodyRef.current.scrollTop < 80) {
            await loadOlderMessages();
        }
    };

    const loadOlderMessages = async () => {
        if (!cursor) return;

        setLoadingHistory(true);

        const res = await fetch(
            `/api/chat/history?cursor=${cursor}&limit=20`,
            { credentials: "include" }
        );

        const data = await res.json();
        const older = data.items.map(mapServerMessage);

        setMessages(prev => [...older.reverse(), ...prev]);
        setCursor(data.nextCursor ? new Date(data.nextCursor).getTime() : null);
        setHasMore(!!data.nextCursor);
        setLoadingHistory(false);
    };

    function mapServerMessage(m: any): Message {
        return {
            id: m._id,
            role: m.role,
            text: m.text,
            english: m.english,
            audioUrl: m.audioUrl,
            language: m.language,
            timestamp: new Date(m.createdAt).getTime(),
        };
    }


    const sendToAI = async (
        nativeText: string,
        englishText: string,
        lang: string
    ) => {
        if (!englishText.trim() || loading) return;

        const now = Date.now();

        setMessages(prev => [
            ...prev,
            {
                role: "user",
                text: nativeText,
                english: englishText,
                language: lang,
                timestamp: now,
            },
        ]);

        setLoading(true);
        setInput("");

        try {
            const res = await askAI({
                native: nativeText,
                question: englishText,
                language: lang,
            });

            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    text: res.text,
                    english: res.english,
                    audioUrl: res.audioUrl,
                    language: lang,
                    timestamp: Date.now(),
                },
            ]);
        } catch (err) {
            console.error("[AI ERROR]", err);
            setMessages(prev => [
                ...prev,
                {
                    role: "ai",
                    text: "Sorry, I could not help right now.",
                    timestamp: Date.now(),
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    /* ---------- Voice Hook ---------- */

    const {
        recording,
        ready,
        processing,
        startRecording,
        stopRecording,
        sendRecording,
        cancelRecording,
    } = useVoice(({ transcript, english, language }) => {
        sendToAI(transcript, english, language);
    });

    /* ---------- Typed Input ---------- */

    const sendTyped = () => {
        if (!input.trim()) return;
        sendToAI(input, input, language);
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
                {loadingHistory && (
                    <div className="text-center text-xs text-stone-400">
                        {t('LEM')}
                    </div>
                )}
                {!messages.length && !loading && (
                    <div className="text-center text-stone-400 mt-10">
                        {t('AMA')}
                    </div>
                )}

                <div
                    ref={bodyRef}
                    onScroll={handleScroll}
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

                {/* Input + Voice Controls */}
                <div className="p-3 border-t flex items-center gap-3">

                    <input
                        ref={inputRef}
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder={
                            recording
                                ? "Recording voice…"
                                : processing
                                    ? "Sending voice…"
                                    : "Type in your language…"
                        }
                        disabled={loading || recording || processing}
                        className="flex-1 border rounded-lg px-3 py-2"
                        onKeyDown={e => e.key === "Enter" && sendTyped()}
                    />

                    {/* Idle */}
                    {!recording && !ready && !processing && (
                        <>
                            <button
                                onClick={sendTyped}
                                disabled={loading}
                                className="bg-orange-500 text-white px-4 py-2 rounded-lg"
                            >
                                Send
                            </button>

                            <button
                                onClick={startRecording}
                                className="bg-stone-100 px-3 py-2 rounded-lg"
                                title="Record voice"
                            >
                                🎙️
                            </button>
                        </>
                    )}

                    {/* Recording */}
                    {recording && (
                        <>
                            <span className="text-red-500 text-sm animate-pulse">
                                ● Recording
                            </span>
                            <button onClick={stopRecording}>⏹</button>
                            <button onClick={cancelRecording}>❌</button>
                        </>
                    )}

                    {/* Ready */}
                    {ready && !processing && (
                        <>
                            <button
                                onClick={sendRecording}
                                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                            >
                                Send Voice
                            </button>
                            <button onClick={cancelRecording}>❌</button>
                        </>
                    )}

                    {/* Processing */}
                    {processing && (
                        <span className="text-xs text-stone-500">
                            Uploading…
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}