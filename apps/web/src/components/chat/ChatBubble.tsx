type ChatBubbleProps = {
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
};

export function ChatBubble({ role, text, timestamp }: ChatBubbleProps) {
    const isUser = role === 'user';

    const time = new Date(timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

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
                className={`px-4 py-2 rounded-2xl max-w-[80%] ${isUser
                        ? 'bg-orange-500 text-white rounded-br-sm'
                        : 'bg-stone-100 text-stone-900 rounded-bl-sm'
                    }`}
            >
                {text}
            </div>

            {/* Time */}
            <span className="text-[10px] text-stone-400 mt-1">
                {time}
            </span>
        </div>
    );
}