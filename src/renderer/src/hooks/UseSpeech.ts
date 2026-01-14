export const UseSpeech = () => {
  const speak = (text: string, lang = 'ja-JP') => {
    if (!text) return

    const utterance = new SpeechSynthesisUtterance(text)

    const play = () => {
      const voice = speechSynthesis.getVoices().find((v) => v.lang === lang)

      if (voice) utterance.voice = voice
      speechSynthesis.speak(utterance)
    }

    speechSynthesis.getVoices().length ? play() : (speechSynthesis.onvoiceschanged = play)
  }

  return { speak }
}
