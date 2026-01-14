declare global {
  interface Window {
    windowControls: {
      minimize: () => void
      maximize: () => void
      close: () => void
    }
  }
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

export default TopBar
