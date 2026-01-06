import { useEffect, useRef, useState } from 'react';
import { askAI } from '../../api/ai';
import { useVoice } from '../../hooks/useVoice';
import { ChatBubble } from './ChatBubble';
import { useProfile } from '../../hooks/useProfile';


type Message = {
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
    language?: string; // 🔥 only for AI
};

export function ChatModal({
    onClose,
    language = 'en-IN'
}: {
    onClose: () => void;
    language?: string;
}) {
    const { profile } = useProfile();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const bodyRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    // Auto-focus input when modal opens
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Auto-scroll on new messages
    useEffect(() => {
        bodyRef.current?.scrollTo({
            top: bodyRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }, [messages, loading]);

    const send = async (text: string) => {
        if (!text.trim() || loading) return;
        const now = Date.now();

        setMessages(prev => [...prev, { role: 'user', text, timestamp: now, language  }]);
        setInput('');
        setLoading(true);

        try {
            const res = await askAI({ question: text, language: profile?.language || 'en' });

            setMessages(prev => [
                ...prev,
                { role: 'ai', text: res.answer, timestamp: Date.now(), language: 'en-IN' }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'ai',
                    text: 'Sorry, I could not help right now.',
                    timestamp: Date.now(),
                    language: 'en-IN'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const { start } = useVoice(language, send);

    return (
        <div
            className="
                fixed inset-0 z-[10000]
                bg-black/40
                flex items-end justify-center
            "
            onClick={onClose}
        >
            <div
                className="
                    w-full max-w-md h-[70%]
                    bg-white rounded-t-2xl
                    shadow-xl
                    flex flex-col
                "
                onClick={e => e.stopPropagation()} // prevent close on inner click
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <span className="font-semibold">AI Assistant</span>
                    <button
                        onClick={onClose}
                        className="text-lg leading-none"
                        aria-label="Close chat"
                    >
                        ✕
                    </button>
                </div>

                {/* Messages */}
                <div
                    ref={bodyRef}
                    className="flex-1 p-4 overflow-y-auto space-y-2"
                >
                    {messages.map((m, i) => (
                        <ChatBubble key={i} role={m.role} text={m.text} timestamp={m.timestamp} />
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
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type in your language…"
                        className="flex-1 border rounded-lg px-3 py-2"
                        onKeyDown={e => {
                            if (e.key === 'Enter') send(input);
                        }}
                        disabled={loading}
                    />

                    <button
                        onClick={() => send(input)}
                        disabled={loading}
                        className="
                            px-4 py-2 rounded-lg
                            bg-orange-500 text-white
                            disabled:opacity-50
                        "
                    >
                        Send
                    </button>

                    <button
                        onClick={start}
                        disabled={loading}
                        className="
                            px-3 py-2 rounded-lg
                            bg-stone-100
                            disabled:opacity-50
                        "
                        aria-label="Speak"
                    >
                        🎙️
                    </button>
                </div>
            </div>
        </div>
    );
}