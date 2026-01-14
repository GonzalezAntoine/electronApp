import { useState } from 'react'
import { UseSpeech } from './UseSpeech'
import { DataRow } from '@renderer/types/db'

const useQuizLogic = (data: DataRow[]) => {
  const [current, setCurrent] = useState<DataRow | null>(null)
  const [options, setOptions] = useState<DataRow[]>([])
  const [remaining, setRemaining] = useState<DataRow[]>([])
  const [message, setMessage] = useState('')
  const [correct, setCorrect] = useState(0)
  const [finished, setFinished] = useState(false)
  const { speak } = UseSpeech()

  const pickRandom = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

  const generateQuestion = (list: DataRow[] = remaining): void => {
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

  const check = (answer: string): void => {
    if (!current) return
    const good = answer === current.Traduction
    setMessage(good ? '✅ Correct !' : '❌ Mauvaise réponse.')
    if (good) setCorrect((c) => c + 1)
    setTimeout(() => generateQuestion(), 1000)
  }

  const start = (): void => {
    setCorrect(0)
    setFinished(false)
    setRemaining([...data])
    generateQuestion([...data])
  }

  return { current, options, message, finished, correct, start, check }
}

export default useQuizLogic
