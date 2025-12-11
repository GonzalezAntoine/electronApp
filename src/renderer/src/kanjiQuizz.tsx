import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import kitsuneAnimation from './kitsune.json'
import './styles.css'

// Types des lignes du CSV
interface DataRow {
  leçon: string
  kanji?: string
  traduction: string
  furigana: string
}

declare global {
  interface Window {
    api: {
      getData: () => Promise<DataRow[]>
    }
  }
}

const useLoadData = () => {
  const [data, setData] = useState<DataRow[]>([])

  useEffect(() => {
    window.api.getData().then((rows: DataRow[]) => {
      setData(rows)
    })
  }, [])

  return data
}

const KanjiApp: React.FC = () => {
  const data: DataRow[] = useLoadData() // plus d'URL
  const [activeTab, setActiveTab] = useState<string>('vocabulaire')
  const [selectedLesson, setSelectedLesson] = useState<string>('Toutes')

  useEffect(() => {
    if (data.length > 0) {
      setSelectedLesson('Toutes')
    }
  }, [data])

  const lessons = ['Toutes', ...new Set(data.map((row) => row.leçon))]

  const filteredData =
    selectedLesson === 'Toutes' ? data : data.filter((row) => row.leçon === selectedLesson)

  const kanjiData = filteredData.filter((row) => row.kanji && row.kanji.trim() !== '')

  return (
    <div className="container">
      <h2>Apprentissage Japonais</h2>

      <div className="tabs">
        <button
          className={activeTab === 'vocabulaire' ? 'active' : ''}
          onClick={() => setActiveTab('vocabulaire')}
        >
          Vocabulaire ({data.length})
        </button>
        <button
          className={activeTab === 'kanji' ? 'active' : ''}
          onClick={() => setActiveTab('kanji')}
        >
          Kanji ({kanjiData.length})
        </button>
        <button
          className={activeTab === 'quiz' ? 'active' : ''}
          onClick={() => setActiveTab('quiz')}
        >
          Quiz
        </button>
      </div>

      {(activeTab === 'vocabulaire' || activeTab === 'kanji') && (
        <div className="filter">
          <label>Filtrer par leçon :</label>
          <select onChange={(e) => setSelectedLesson(e.target.value)} value={selectedLesson}>
            {lessons.map((lesson, index) => (
              <option key={index} value={lesson}>
                {lesson}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === 'vocabulaire' && <VocabularyList data={filteredData} />}
      {activeTab === 'kanji' && <KanjiList data={kanjiData} />}
      {activeTab === 'quiz' && (
        <KanjiQuiz
          data={filteredData}
          lessons={lessons}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
        />
      )}
    </div>
  )
}

interface ListProps {
  data: DataRow[]
}

const VocabularyList: React.FC<ListProps> = ({ data }) => (
  <ul className="kanji-list">
    {data.map((row, index) => (
      <li key={index} className="kanji-item">
        <span className="kanji">{row.kanji || '❌'}</span>
        <span className="translation">{row.traduction}</span>
        <span className="lesson">{row.furigana}</span>
      </li>
    ))}
  </ul>
)

const KanjiList: React.FC<ListProps> = ({ data }) => (
  <ul className="kanji-list">
    {data.map((row, index) => (
      <li key={index} className="kanji-item">
        <span className="kanji">{row.kanji}</span>
        <span className="translation">{row.traduction}</span>
        <span className="lesson">{row.furigana}</span>
      </li>
    ))}
  </ul>
)

interface QuizProps {
  data: DataRow[]
  lessons: string[]
  selectedLesson: string
  setSelectedLesson: (value: string) => void
}

const KanjiQuiz: React.FC<QuizProps> = ({ data, lessons, selectedLesson, setSelectedLesson }) => {
  const [currentQuestion, setCurrentQuestion] = useState<DataRow | null>(null)
  const [options, setOptions] = useState<DataRow[]>([])
  const [message, setMessage] = useState<string>('')
  const [messageMascotte, setMessageMascotte] = useState<string>('Prêt ? On commence ! 🦊')
  const [correctAnswers, setCorrectAnswers] = useState<number>(0)
  const [totalQuestions, setTotalQuestions] = useState<number>(0)
  const [currentNumberQuestion, setCurrentNumberQuestion] = useState<number>(0)
  const [remainingQuestions, setRemainingQuestions] = useState<DataRow[]>([...data])

  useEffect(() => {
    if (data.length > 0) {
      setTotalQuestions(data.length)
      setRemainingQuestions([...data])
      generateQuestion()
    }
  }, [data])

  const speakJapanese = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const japaneseVoice = voices.find((voice) => voice.lang === 'ja-JP')
    if (japaneseVoice) {
      utterance.voice = japaneseVoice
      speechSynthesis.speak(utterance)
    }
  }

  const generateQuestion = () => {
    if (remainingQuestions.length === 0) {
      setMessage('🎉 Quiz terminé !')
      return
    }

    const questionIndex = Math.floor(Math.random() * remainingQuestions.length)
    const question = remainingQuestions[questionIndex]

    const wrongAnswers = data
      .filter((item) => item.traduction !== question.traduction)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    const answers = [...wrongAnswers, question].sort(() => 0.5 - Math.random())

    setCurrentQuestion(question)
    setOptions(answers)
    setMessage('')

    speakJapanese(question.kanji || question.furigana)

    setRemainingQuestions((prev) => prev.filter((_, i) => i !== questionIndex))
  }

  const checkAnswer = (answer: string) => {
    if (!currentQuestion) return

    if (answer === currentQuestion.traduction) {
      setMessage('✅ Bonne réponse !')
      setMessageMascotte('Super ! Tu es trop fort ! 💪🦊')
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setMessage('❌ Mauvaise réponse. Réessaie !')
      setMessageMascotte('Courage ! Tu vas y arriver ! 💖🦊')
    }

    setCurrentNumberQuestion((prev) => prev + 1)

    setTimeout(() => generateQuestion(), 1500)
  }

  if (!currentQuestion) return <p>Chargement...</p>

  const calculatePercentage = () => {
    return totalQuestions > 0 ? Math.round((correctAnswers / currentNumberQuestion) * 100) : 0
  }

  const getProgressBarColor = () => {
    const percentage = calculatePercentage()
    if (percentage >= 80) return 'green'
    if (percentage >= 50) return 'orange'
    return 'red'
  }

  if (remainingQuestions.length === 0) {
    return (
      <div className="quiz-container">
        <h3>🎉 Quiz terminé !</h3>
        <p>
          Score final : {correctAnswers}/{totalQuestions}
        </p>
        <button
          onClick={() => {
            setRemainingQuestions([...data])
            setCorrectAnswers(0)
            setCurrentNumberQuestion(0)
            generateQuestion()
            setMessage('')
          }}
        >
          🔄 Recommencer le quiz
        </button>
      </div>
    )
  }

  return (
    <div className="quiz-container">
      <h3>Quiz Kanji</h3>

      <div className="filter">
        <label>Choisir une leçon :</label>
        <select onChange={(e) => setSelectedLesson(e.target.value)} value={selectedLesson}>
          {lessons.map((lesson, index) => (
            <option key={index} value={lesson}>
              {lesson}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
        <Lottie animationData={kitsuneAnimation} loop={true} style={{ width: 200 }} />
      </div>

      <div className="progress-container">
        <div
          className="progress-bar"
          style={{
            width: `${(correctAnswers / totalQuestions) * 100}%`,
            backgroundColor: getProgressBarColor()
          }}
        ></div>
      </div>

      <p className="score-text">
        Score : {correctAnswers}/{currentNumberQuestion}
      </p>

      <h3>
        Quelle est la traduction de : {currentQuestion.kanji || currentQuestion.furigana} ?
        <button
          onClick={() => speakJapanese(currentQuestion.kanji || currentQuestion.furigana)}
          className="sound-button"
          title="Écouter la prononciation"
        >
          🔊
        </button>
      </h3>

      <div className="quiz-options">
        {options.map((option, index) => (
          <button key={index} onClick={() => checkAnswer(option.traduction)}>
            {option.traduction}
          </button>
        ))}
      </div>

      <p className="quiz-message">{message}</p>
    </div>
  )
}

export default KanjiApp
