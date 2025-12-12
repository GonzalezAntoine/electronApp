import electronLogo from './assets/electron.svg'
import KanjiApp from './KanjiApp'

function App(): React.JSX.Element {
  const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <>
      <KanjiApp />
    </>
  )
}

export default App
