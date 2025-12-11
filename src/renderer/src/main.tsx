import './assets/main.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import KanjiQuizz from './kanjiQuizz'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <KanjiQuizz />
  </StrictMode>
)
