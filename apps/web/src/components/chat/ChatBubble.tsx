import { speak } from '../../utils/speak';
import { useRef } from 'react';

type ChatBubbleProps = {
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
    language?: string;
};

export function ChatBubble({
    role,
    text,
    timestamp,
    language
}: ChatBubbleProps) {
    const isUser = role === 'user';
    const isSpeakingRef = useRef(false);

    const time = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const handleSpeak = () => {
        if (isSpeakingRef.current) return;

        isSpeakingRef.current = true;
        speak(text, language || 'en-IN');

        // release lock after speech (basic guard)
        setTimeout(() => {
            isSpeakingRef.current = false;
        }, Math.max(2000, text.length * 60));
    };

    return (
        <div
            className={`flex flex-col ${isUser ? 'items-end' : 'items-start'
                }`}
        >
            {/* Name */}
            <span className="text-xs text-stone-500 mb-1">
                {isUser ? 'You' : 'AI Assistant'}
            </span>

            {/* Bubble */}
            <div
                className={`relative px-4 py-2 rounded-2xl max-w-[80%] ${isUser
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-stone-100 text-stone-900 rounded-bl-sm'
                    }`}
            >
                {text}

                {/* 🔊 Speaker icon (AI only) */}
                {!isUser && (
                    <button
                        onClick={handleSpeak}
                        className="
                            absolute -right-8 top-1/2 -translate-y-1/2
                            text-stone-500 hover:text-orange-500
                        "
                        aria-label="Speak response"
                        title="Listen"
                    >
                        🔊
                    </button>
                )}
            </div>

            {/* Time */}
            <span className="text-[10px] text-stone-400 mt-1">
                {time}
            </span>
        </div>
    );
}