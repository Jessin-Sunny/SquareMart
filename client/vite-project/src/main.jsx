import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setInitialTheme } from './utils/theme'

// APPLY THEME BEFORE REACT LOADS
setInitialTheme()


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
