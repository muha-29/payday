import { useState } from 'react';
import { useVoice } from '../../hooks/useVoice';
import { speak } from '../../utils/speak';
import { askAI } from '../../api/ai';
import { useProfile } from '../../hooks/useProfile';

export function VoiceAssistant() {
    const { profile, loading } = useProfile();

    const [listening, setListening] = useState(false);
    const [lastReply, setLastReply] = useState<string | null>(null);
    const [thinking, setThinking] = useState(false);

    const language = profile?.language || 'te-IN';

    /**
     * Callback executed AFTER speech → text
     */
    const handleSpeechResult = async (text: string) => {
        setListening(false);
        setThinking(true);

        try {
            const res = await askAI({
                question: text,
                language
            });

            setLastReply(res.answer);          // ✅ UI state
            speak(res.answer, language);       // ✅ Voice output
        } catch (err) {
            const fallback =
                'Sorry, I could not help right now. Please try again.';

            setLastReply(fallback);
            speak(fallback, language);
        } finally {
            setThinking(false);
        }
    };

    const { start } = useVoice(language, handleSpeechResult);

    if (loading) return null;

    return (
        <div className="relative flex flex-col items-center gap-2">
            {/* Voice Button */}
            <button
                onClick={() => {
                    setListening(true);
                    start();
                }}
                aria-label="Talk to PayDay"
                className="w-14 h-14 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl shadow-xl active:scale-95flex items-center justify-center"
            >
                🎤
            </button>

            {/* Listening animation */}
            {listening && (
                <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-orange-300 rounded-full animate-bounce delay-200" />
                </div>
            )}

            {/* Thinking indicator */}
            {thinking && (
                <p className="text-xs text-stone-400">PayDay is thinking…</p>
            )}

            {/* AI Reply Bubble */}
            {lastReply && !listening && (
                <div
                    className="
            max-w-xs
            bg-orange-50
            border-l-4 border-orange-400
            rounded-xl
            p-3
            text-sm
            text-stone-700
            shadow
          "
                >
                    {lastReply}
                </div>
            )}
        </div>
    );
}