const synth = window.speechSynthesis;

export const speak = (message: string) => {
  if (synth.speaking) {
    setTimeout(() => speak(message), 1000);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  synth.speak(utterance);
};
