const CardList = ({ data }) => (
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

export default CardList
