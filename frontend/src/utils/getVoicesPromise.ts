export default function getVoices(): Promise<SpeechSynthesisVoice[]> {
    return new Promise(
        function (resolve, reject) {
            let synth = window.speechSynthesis;
            let id: NodeJS.Timer;

            id = setInterval(() => {
                if (synth.getVoices().length !== 0) {
                    resolve(synth.getVoices());
                    clearInterval(id);
                }
            }, 10);
        }
    );
};
