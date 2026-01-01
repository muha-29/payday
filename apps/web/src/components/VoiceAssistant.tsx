import { useState } from 'react';
import { useVoice } from '../hooks/useVoice';
import { speak } from '../utils/speak';
import { askAI } from '../api/ai';
import { useProfile } from '../hooks/useProfile';

export function VoiceAssistant() {
    const { profile, loading } = useProfile();
    const [listening, setListening] = useState(false);

    const language = profile?.language || 'te-IN';

    const { start } = useVoice(language, async (text) => {
        setListening(false);

        try {
            const res = await askAI({
                question: text,
                language
            });

            speak(res.answer, language);
        } catch (err) {
            speak(
                'Sorry, I could not help right now.',
                language
            );
        }
    });

    if (loading) return null;

    return (
        <button
            onClick={() => {
                setListening(true);
                start();
            }}
            className="
        w-14 h-14 rounded-full
        bg-gradient-to-r from-orange-500 to-amber-500
        text-white text-xl
        shadow-xl
        active:scale-95
      "
            aria-label="Talk to PayDay"
        >
            {listening ? '🎙️' : '🎤'}
        </button>
    );
}
