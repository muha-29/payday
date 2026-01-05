export function useVoice(
    language: string,
    onResult: (text: string) => void
) {
    const start = () => {
        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Speech recognition not supported');
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = language;
        recognition.continuous = false;
        recognition.interimResults = true; // 🔥 IMPORTANT
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('🎤 Mic listening...');
        };

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            console.log('🎙️ Voice captured:', text);
            onResult(text);
        };

        recognition.onerror = (err: any) => {
            if (err.error === 'no-speech') {
                console.warn('⚠️ No speech detected. Please speak louder or sooner.');
                return;
            }
            console.error('Voice error:', err);
        };

        recognition.start();
    };

    return { start };
}