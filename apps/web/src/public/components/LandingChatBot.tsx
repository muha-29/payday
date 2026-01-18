import { useEffect, useRef, useState } from "react";

const API_URL = import.meta.env.VITE_API_BASE_URL;
import {
    loadLandingChat,
    saveLandingChat,
    clearLandingChat,
    LandingMsg
} from "../utils/landingChatStorage";

type Msg = {
    role: "user" | "bot";
    text: string;
    ts: Date;
};

export default function LandingChatBox() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<LandingMsg[]>([]);
    const [input, setInput] = useState("");
    const [typing, setTyping] = useState(false);

    const bodyRef = useRef<HTMLDivElement>(null);

    /* ---------- Load history once ---------- */
    useEffect(() => {
        const saved = loadLandingChat();
        if (saved.length) {
            setMessages(saved);
        } else {
            setMessages([
                {
                    role: "bot",
                    text:
                        "Hi 👋 I’m PayDay Assistant. Ask me about savings, safety, or government schemes.",
                    ts: Date.now()
                }
            ]);
        }
    }, []);

    /* ---------- Persist on change ---------- */
    useEffect(() => {
        if (messages.length) {
            saveLandingChat(messages);
        }
    }, [messages]);

    const send = async () => {
        if (!input.trim()) return;

        const userMsg: LandingMsg = {
            role: "user",
            text: input,
            ts: Date.now()
        };

        setInput("");
        setMessages(prev => [...prev, userMsg]);
        setTyping(true);

        try {
            const res = await fetch(`${API_URL}/api/public-bot/ask`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: userMsg.text })
            });

            const data = await res.json();

            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: data.answer || "I don’t have information on that yet.",
                    ts: Date.now()
                }
            ]);
        } catch {
            setMessages(prev => [
                ...prev,
                {
                    role: "bot",
                    text: "Something went wrong. Please try again.",
                    ts: Date.now()
                }
            ]);
        } finally {
            setTyping(false);
        }
    };

    /* ---------- Auto scroll ---------- */
    useEffect(() => {
        bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [messages, typing]);

    useEffect(() => {
        bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: "smooth"
        });
    }, [open]);
    return (
        <>
            {/* Floating button */}
            {!open && (
                <button
                    onClick={() => setOpen(true)}
                    className="
            fixed bottom-6 right-6 z-50
            bg-orange-500 text-white
            w-14 h-14 rounded-full
            shadow-lg text-2xl
            animate-bounce
          "
                    aria-label="Open chat"
                >
                    💬
                </button>
            )}

            {/* Chat panel */}
            {open && (
                <div
                    className="
            fixed bottom-4 right-4 z-50
            w-[320px] h-[420px]
            bg-white rounded-2xl shadow-xl
            flex flex-col overflow-hidden
          "
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 bg-orange-500 text-white">
                        <span className="font-semibold">PayDay Assistant</span>
                        <button
                            onClick={() => {
                                clearLandingChat();
                                setMessages([
                                    {
                                        role: "bot",
                                        text: "Chat cleared. How can I help you?",
                                        ts: Date.now()
                                    }
                                ]);
                            }}
                            className="text-xs opacity-80"
                        >
                            Clear
                        </button>

                        <button onClick={() => setOpen(false)}>✕</button>
                    </div>

                    {/* Messages */}
                    <div
                        ref={bodyRef}
                        className="flex-1 p-3 space-y-2 overflow-y-auto text-sm"
                    >
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`max-w-[85%] px-3 py-2 rounded-xl ${m.role === "user"
                                    ? "ml-auto bg-orange-500 text-white"
                                    : "bg-stone-100 text-stone-800"
                                    }`}
                            >
                                {m.text}
                            </div>
                        ))}

                        {/* Typing animation */}
                        {typing && (
                            <div className="bg-stone-100 px-3 py-2 rounded-xl w-fit">
                                <span className="animate-pulse">•••</span>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-2 border-t flex gap-2">
                        <input
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Ask a question…"
                            className="flex-1 border rounded-lg px-2 py-1 text-sm"
                            onKeyDown={e => e.key === "Enter" && send()}
                        />
                        <button
                            onClick={send}
                            className="bg-orange-500 text-white px-3 rounded-lg text-sm"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
