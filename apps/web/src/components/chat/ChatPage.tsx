import { useState } from 'react';
import { useVoice } from '../../hooks/useVoice';
import { askAI } from '../../api/ai';
import { useProfile } from '../../hooks/useProfile';

export function ChatPage() {
    const { profile } = useProfile();
    const language = profile?.language || 'en-IN';

    const [messages, setMessages] = useState<
        { role: 'user' | 'ai'; text: string }[]
    >([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const sendVoice = async (
        nativeText: string,
        englishText: string,
        lang: string
    ) => {
        if (!nativeText.trim() || loading) return;

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
                english: englishText,
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
            console.error("[VOICE → AI FAILED]", err);
        } finally {
            setLoading(false);
        }
    };


    const sendMessage = async (text: string) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { role: 'user', text }]);
        setLoading(true);

        try {
            const res = await askAI({ question: text, language });

            setMessages(prev => [
                ...prev,
                { role: 'ai', text: res.answer }
            ]);
        } catch (err) {
            setMessages(prev => [
                ...prev,
                { role: 'ai', text: 'Sorry, I could not help right now.' }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const { start } = useVoice(({ transcript, english, language }) => {
        sendVoice(transcript, english, language);
    });

    return (
        <div className="chat-page">
            <div className="messages">
                {messages.map((m, i) => (
                    <div key={i} className={`msg ${m.role}`}>
                        {m.text}
                    </div>
                ))}
                {loading && <div className="msg ai">Thinking…</div>}
            </div>

            <div className="chat-input">
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Type in your language…"
                    onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
                />

                <button onClick={() => sendMessage(input)}>Send</button>
                <button onClick={start}>🎙️</button>
            </div>
        </div>
    );
}