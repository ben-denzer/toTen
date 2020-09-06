const synth = window.speechSynthesis;

export const speak = async (message: string) => {
  if (synth.speaking) {
    setTimeout(() => speak(message), 1000);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(message);
  await synth.speak(utterance);
  return true;
};
