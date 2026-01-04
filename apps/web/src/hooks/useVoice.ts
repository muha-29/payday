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
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
            const text = event.results[0][0].transcript;
            console.log('🎙️ Voice captured:', text); // 🔴 MUST SEE THIS
            onResult(text); // 🔥 THIS WAS MISSING OR NOT FIRING
        };

        recognition.onerror = (err: any) => {
            console.error('Voice error:', err);
        };

        recognition.start();
    };

    return { start };
}