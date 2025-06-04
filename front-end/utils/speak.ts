export const speak = (text: string, muted: boolean) => {
    if (muted) return
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "pt-PT";
    speechSynthesis.speak(utterance);
}