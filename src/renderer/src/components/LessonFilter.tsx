type LessonFilterProps = {
  lessons: string[]
  selected: string
  setSelected: (value: string) => void
}

const LessonFilter: React.FC<LessonFilterProps> = ({ lessons, selected, setSelected }) => (
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

export default LessonFilter
