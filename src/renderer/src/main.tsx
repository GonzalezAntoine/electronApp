import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import KanjiApp from './KanjiApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KanjiApp />
  </StrictMode>
)
