import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Service Worker wird automatisch von vite-plugin-pwa registriert
// Importiere die registerSW Funktion für manuelle Registrierung (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // vite-plugin-pwa registriert automatisch, aber wir können hier
    // zusätzliche Logik hinzufügen falls nötig
  });
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
