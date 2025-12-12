import Lottie from 'lottie-react'
import LessonFilter from './LessionFilter'
import useQuizLogic from '../hooks/useQuizLogic'
import kitsuneAnimation from '../kitsune.json'
import { useEffect } from 'react'

const KanjiQuiz = ({ data, lessons, selectedLesson, setSelectedLesson }) => {
  const { current, options, message, correct, start, check } = useQuizLogic(data)

  useEffect(() => {
    if (data.length > 0) start()
  }, [data])

  if (!current) return <p>Chargement...</p>

  return (
    <div className="quiz-container">
      <h2>Quiz Kanji 🦊</h2>

      <LessonFilter lessons={lessons} selected={selectedLesson} setSelected={setSelectedLesson} />

      <Lottie animationData={kitsuneAnimation} loop style={{ width: 150 }} />

      <div className="quiz-card">
        <p>
          Quelle est la traduction de : <strong>{current.kanji || current.furigana}</strong> ?
          <button
            className="sound-btn"
            onClick={() => {
              const utter = new SpeechSynthesisUtterance(current.kanji || current.furigana)
              const voice = speechSynthesis.getVoices().find((v) => v.lang === 'ja-JP')
              if (voice) utter.voice = voice
              speechSynthesis.speak(utter)
            }}
          >
            🔊
          </button>
        </p>

        <div className="quiz-options">
          {options.map((o, idx) => (
            <button key={idx} onClick={() => check(o.Traduction)}>
              {o.Traduction}
            </button>
          ))}
        </div>
      </div>

      <p className="quiz-message">{message}</p>
      <p>
        Score : {correct}/{data.length}
      </p>
    </div>
  )
}

export default KanjiQuiz
