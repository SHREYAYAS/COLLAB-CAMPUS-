import React, { useMemo, useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { createAppTheme } from './theme.js'
import './styles.css'

export const AppThemeContext = React.createContext({
  mode: 'light',
  primary: 'emerald',
  setThemeSettings: () => {},
})

// Use centralized theme with custom emerald gradient/shadow tokens

function Root() {
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem('app_theme')
      if (raw) return JSON.parse(raw)
    } catch {
      // Ignore localStorage errors
    }
    return { mode: 'light', primary: 'emerald' }
  })

  useEffect(() => {
    try {
      localStorage.setItem('app_theme', JSON.stringify(settings))
    } catch {
      // Ignore localStorage errors
    }
  }, [settings])

  const muiTheme = useMemo(() => createAppTheme(settings), [settings])

  const ctx = useMemo(() => ({
    mode: settings.mode,
    primary: settings.primary,
    setThemeSettings: setSettings,
  }), [settings])

  return (
    <React.StrictMode>
      <AppThemeContext.Provider value={ctx}>
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <BrowserRouter>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </BrowserRouter>
        </ThemeProvider>
      </AppThemeContext.Provider>
    </React.StrictMode>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)