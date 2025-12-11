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
    api: { getData: () => Promise<DataRow[]> }
    windowControls: { minimize: () => void; maximize: () => void; close: () => void }
  }
}

const useLoadData = () => {
  const [data, setData] = useState<DataRow[]>([])
  useEffect(() => {
    window.api.getData().then(setData)
  }, [])
  return data
}

const TopBar = () => (
  <div className="top-bar">
    <span className="title">🦊 Minna no nihongo quizz</span>
    <div className="window-controls">
      <button onClick={() => window.windowControls.minimize()}>_</button>
      <button onClick={() => window.windowControls.maximize()}>□</button>
      <button onClick={() => window.windowControls.close()}>×</button>
    </div>
  </div>
)

const NavigationTabs = ({ active, setActive, dataLength, kanjiLength }) => (
  <nav>
    {[
      { id: 'vocabulaire', label: `Vocabulaire (${dataLength})` },
      { id: 'kanji', label: `Kanji (${kanjiLength})` },
      { id: 'quiz', label: 'Quiz' }
    ].map((tab) => (
      <button
        key={tab.id}
        className={active === tab.id ? 'active' : ''}
        onClick={() => setActive(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </nav>
)

const LessonFilter = ({ lessons, selected, setSelected }) => (
  <div className="filter">
    <label>Leçon :</label>
    <select
      className="styled-select"
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
    >
      {lessons.map((l, idx) => (
        <option key={idx} value={l}>
          {l}
        </option>
      ))}
    </select>
  </div>
)

const CardList = ({ data }: { data: DataRow[] }) => (
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

const useQuizLogic = (data: DataRow[]) => {
  const [current, setCurrent] = useState<DataRow | null>(null)
  const [options, setOptions] = useState<DataRow[]>([])
  const [message, setMessage] = useState('')
  const [correct, setCorrect] = useState(0)
  const [remaining, setRemaining] = useState<DataRow[]>([])
  const [finished, setFinished] = useState(false)

  // Fonction utilitaire DRY : tirer au hasard
  const pickRandom = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

  // Voix japonaise DRY
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    const play = () => {
      const voice = speechSynthesis.getVoices().find((v) => v.lang === 'ja-JP')
      if (voice) utterance.voice = voice
      speechSynthesis.speak(utterance)
    }
    speechSynthesis.getVoices().length ? play() : (speechSynthesis.onvoiceschanged = play)
  }

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

  const check = (answer: string) => {
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

const KanjiQuiz = ({ data, lessons, selectedLesson, setSelectedLesson }) => {
  const { current, options, message, correct, finished, start, check } = useQuizLogic(data)

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

const KanjiApp = () => {
  const data = useLoadData()
  const [activeTab, setActiveTab] = useState('vocabulaire')
  const [selectedLesson, setSelectedLesson] = useState('Toutes')

  const lessons = ['Toutes', ...new Set(data.map((d) => d.leçon))]
  const filtered =
    selectedLesson === 'Toutes' ? data : data.filter((d) => d.leçon === selectedLesson)
  const kanjiOnly = filtered.filter((d) => d.kanji?.trim())

  return (
    <div className="app-container">
      <TopBar />

      <header>
        <h1>🦊 Apprentissage Japonais</h1>

        <NavigationTabs
          active={activeTab}
          setActive={setActiveTab}
          dataLength={data.length}
          kanjiLength={kanjiOnly.length}
        />
      </header>

      {(activeTab === 'vocabulaire' || activeTab === 'kanji') && (
        <LessonFilter lessons={lessons} selected={selectedLesson} setSelected={setSelectedLesson} />
      )}

      {activeTab === 'vocabulaire' && <CardList data={filtered} />}
      {activeTab === 'kanji' && <CardList data={kanjiOnly} />}
      {activeTab === 'quiz' && (
        <KanjiQuiz
          data={filtered}
          lessons={lessons}
          selectedLesson={selectedLesson}
          setSelectedLesson={setSelectedLesson}
        />
      )}
    </div>
  )
}

export default KanjiApp
