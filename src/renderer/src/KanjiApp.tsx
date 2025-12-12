import useLoadData from './hooks/useLoadData'
import TopBar from './components/TopBar'
import NavigationTabs from './components/NavigationTabs'
import LessonFilter from './components/LessionFilter'
import CardList from './components/CardList'
import KanjiQuiz from './components/kanjiQuizz'
import './assets/main.css'
import { useState } from 'react'

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
