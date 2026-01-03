export function useVoice(
    language: string,
    onResult: (text: string) => void
) {
    const start = () => {
        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert('Voice not supported');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (e) => {
            onResult(e.results[0][0].transcript);
        };

        recognition.start();
    };

    return { start };
}