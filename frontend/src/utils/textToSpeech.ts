export default function textToSpeech(text: string, voice: SpeechSynthesisVoice | null) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    if (utterance && voice) {
        utterance.voice = voice;

        synth.speak(utterance);
    }
};
