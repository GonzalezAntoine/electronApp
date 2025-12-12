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

export default NavigationTabs
