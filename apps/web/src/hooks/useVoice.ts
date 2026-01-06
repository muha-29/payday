export function useVoice(
    language: string,
    onFinalResult: (text: string) => void
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
        recognition.continuous = true;        // 🔥 keep listening
        recognition.interimResults = true;    // 🔥 capture partials
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('🎤 Mic listening...');
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                if (result.isFinal) {
                    finalTranscript += result[0].transcript;
                }
            }

            if (finalTranscript.trim()) {
                console.log('🎙️ Final voice captured:', finalTranscript);
                recognition.stop(); // 🔥 stop manually
                onFinalResult(finalTranscript.trim());
            }
        };

        recognition.onerror = (err: any) => {
            if (err.error === 'no-speech') {
                console.warn('⚠️ No speech detected');
                return;
            }
            console.error('Voice error:', err);
        };

        recognition.onend = () => {
            console.log('🛑 Mic stopped');
        };

        recognition.start();
    };

    return { start };
}