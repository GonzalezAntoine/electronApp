import { useState } from 'react'
import { UseSpeech } from './UseSpeech'

const useQuizLogic = (data) => {
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [message, setMessage] = useState('')
  const [correct, setCorrect] = useState(0)
  const [remaining, setRemaining] = useState([])
  const [finished, setFinished] = useState(false)
  const { speak } = UseSpeech()

  const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

  const generateQuestion = (list = remaining) => {
    if (list.length === 0) {
      setFinished(true)
      setCurrent(null)
      setMessage('🎉 Quiz terminé !')
      return
    }

    const question = pickRandom(list)
    const wrong = data
      .filter((i) => i.Traduction !== question.Traduction)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    setRemaining(list.filter((q) => q !== question))
    setCurrent(question)
    setOptions([...wrong, question].sort(() => 0.5 - Math.random()))
    setMessage('')
    speak(question.kanji || question.furigana)
  }

  const check = (answer) => {
    if (!current) return
    const good = answer === current.Traduction
    setMessage(good ? '✅ Correct !' : '❌ Mauvaise réponse.')
    if (good) setCorrect((c) => c + 1)
    setTimeout(() => generateQuestion(), 1000)
  }

  const start = () => {
    setCorrect(0)
    setFinished(false)
    setRemaining([...data])
    generateQuestion([...data])
  }

  return { current, options, message, finished, correct, start, check }
}

export default useQuizLogic
