import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import kitsuneAnimation from './kitsune.json'
import './styles.css'

interface DataRow {
  leçon: string
  kanji?: string
  Traduction: string
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
    window.api.getData().then((rows: DataRow[]) => setData(rows))
  }, [])
  return data
}

const KanjiApp: React.FC = () => {
  const data: DataRow[] = useLoadData()
  const [activeTab, setActiveTab] = useState('vocabulaire')
  const [selectedLesson, setSelectedLesson] = useState('Toutes')

  useEffect(() => {
    if (data.length > 0) setSelectedLesson('Toutes')
  }, [data])

  const lessons = ['Toutes', ...new Set(data.map((row) => row.leçon))]
  const filteredData =
    selectedLesson === 'Toutes' ? data : data.filter((row) => row.leçon === selectedLesson)
  const kanjiData = filteredData.filter((row) => row.kanji && row.kanji.trim() !== '')

  return (
    <div className="app-container">
      <header>
        <h1>🦊 Apprentissage Japonais</h1>
        <nav>
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
        </nav>
      </header>

      {(activeTab === 'vocabulaire' || activeTab === 'kanji') && (
        <div className="filter">
          <label>Filtrer par leçon :</label>
          <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
            {lessons.map((lesson, idx) => (
              <option key={idx} value={lesson}>
                {lesson}
              </option>
            ))}
          </select>
        </div>
      )}

      {activeTab === 'vocabulaire' && <CardList data={filteredData} />}
      {activeTab === 'kanji' && <CardList data={kanjiData} />}
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

interface CardListProps {
  data: DataRow[]
}

const CardList: React.FC<CardListProps> = ({ data }) => (
  <div className="cards-container">
    {data.map((row, idx) => (
      <div key={idx} className="card">
        <div className="kanji">{row.kanji || '❌'}</div>
        <div className="furigana">{row.furigana}</div>
        <div className="traduction">{row.Traduction}</div>
      </div>
    ))}
  </div>
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
  const [message, setMessage] = useState('')
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [remainingQuestions, setRemainingQuestions] = useState<DataRow[]>([])
  const [quizFinished, setQuizFinished] = useState(false)

  const startQuiz = () => {
    setRemainingQuestions([...data])
    setCorrectAnswers(0)
    setQuizFinished(false)
    generateQuestion([...data])
  }

  useEffect(() => {
    if (data.length > 0) {
      setTotalQuestions(data.length)
      setRemainingQuestions([...data])
      const firstQuestionIndex = Math.floor(Math.random() * data.length)
      const firstQuestion = data[firstQuestionIndex]
      setCurrentQuestion(firstQuestion)
      setOptions(
        [
          ...data
            .filter((i) => i.Traduction !== firstQuestion.Traduction)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3),
          firstQuestion
        ].sort(() => 0.5 - Math.random())
      )
    }
  }, [data])

  const speakJapanese = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const voices = window.speechSynthesis.getVoices()
    const japaneseVoice = voices.find((v) => v.lang === 'ja-JP')
    if (japaneseVoice) utterance.voice = japaneseVoice
    speechSynthesis.speak(utterance)
  }

  const generateQuestion = (questions = remainingQuestions) => {
    if (questions.length === 0) {
      setQuizFinished(true)
      setCurrentQuestion(null)
      setMessage('🎉 Quiz terminé !')
      return
    }

    const idx = Math.floor(Math.random() * questions.length)
    const question = questions[idx]
    const wrong = data
      .filter((i) => i.Traduction !== question.Traduction)
      .sort(() => 0.5 - Math.random())
      .slice(0, 3)

    setCurrentQuestion(question)
    setOptions([...wrong, question].sort(() => 0.5 - Math.random()))
    setRemainingQuestions((prev) => prev.filter((_, i) => i !== idx))

    // Réinitialiser le message pour la nouvelle question
    setMessage('')

    speakJapanese(question.kanji || question.furigana)
  }

  const checkAnswer = (answer: string) => {
    if (!currentQuestion) return

    if (answer === currentQuestion.Traduction) {
      setMessage('✅ Correct !')
      setCorrectAnswers((prev) => prev + 1)
    } else {
      setMessage('❌ Mauvaise réponse.')
    }

    // Passer à la question suivante après un délai
    setTimeout(() => generateQuestion(), 1000)
  }

  if (!currentQuestion) return <p>Chargement...</p>

  return (
    <div className="quiz-container">
      <h2>Quiz Kanji 🦊</h2>
      <div className="filter">
        <label>Leçon :</label>
        <select value={selectedLesson} onChange={(e) => setSelectedLesson(e.target.value)}>
          {lessons.map((l, idx) => (
            <option key={idx} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <Lottie animationData={kitsuneAnimation} loop style={{ width: 150 }} />
      <div className="quiz-card">
        <p>
          Quelle est la traduction de :{' '}
          <strong>{currentQuestion.kanji || currentQuestion.furigana}</strong> ?
        </p>
        <div className="quiz-options">
          {options.map((o, idx) => (
            <button key={idx} onClick={() => checkAnswer(o.Traduction)}>
              {o.Traduction}
            </button>
          ))}
        </div>
      </div>
      <p className="quiz-message">{message}</p>
      <p>
        Score : {correctAnswers}/{totalQuestions}
      </p>
    </div>
  )
}

export default KanjiApp
