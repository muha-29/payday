export function speak(text: string, language: string) {
    console.log("Speaking:", { text, language });
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.95;
    utterance.pitch = 1;

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
}
