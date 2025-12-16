import { createTheme } from '@mui/material/styles'

// Brand aligned with the reference (emerald/teal, soft light background)
const emeraldGradient = 'linear-gradient(135deg, #032514 0%, #064A27 28%, #0A6F39 52%, #0F8F48 72%, #10B981 100%)'
const emeraldShadow = '0 12px 28px -4px rgba(16,185,129,0.35), 0 4px 12px -2px rgba(6,74,39,0.4)'

export function createAppTheme({ mode = 'light', primary = 'emerald' } = {}) {
  const primaryMap = {
    emerald: '#10B981',
    blue: '#3B82F6',
    purple: '#8B5CF6',
    rose: '#F43F5E',
  }
  const primaryMain = primaryMap[primary] || primaryMap.emerald
  const isDark = mode === 'dark'

  return createTheme({
  palette: {
    mode,
    primary: { main: primaryMain },
    secondary: { main: '#0EA5E9' }, // sky-500
    info: { main: '#0EA5E9' },
    success: { main: '#10B981' },
    warning: { main: '#F59E0B' },
    error: { main: '#EF4444' },
    background: {
      // Dark: match dashboard with slate tones (Tailwind slate-900/800)
      default: isDark ? '#0F172A' : '#F6F8FB',
      paper: isDark ? '#111827' : '#FFFFFF',
    },
    divider: isDark ? 'rgba(148,163,184,0.16)' : 'rgba(15, 23, 42, 0.08)',
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      'ui-sans-serif',
      'system-ui',
      '-apple-system',
      'Segoe UI',
      'Arial',
      'sans-serif',
      'Apple Color Emoji',
      'Segoe UI Emoji',
    ].join(','),
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999 }, // pill buttons
        outlined: { borderColor: isDark ? 'rgba(148,163,184,0.24)' : 'rgba(15,23,42,0.12)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: isDark ? '1px solid rgba(148,163,184,0.14)' : '1px solid rgba(15,23,42,0.08)',
          boxShadow: isDark ? '0 6px 18px rgba(2,6,23,0.6)' : '0 8px 28px rgba(0,0,0,0.06)',
        },
      },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 14, border: isDark ? '1px solid rgba(148,163,184,0.14)' : '1px solid rgba(15,23,42,0.08)' } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
  },
  // custom extension for shared design tokens
  custom: {
    gradients: {
      emerald: emeraldGradient,
    },
    shadows: {
      emerald: emeraldShadow,
    },
  },
})
}

// Backwards-compatible default export using light/emerald
const defaultTheme = createAppTheme({ mode: 'light', primary: 'emerald' })
export default defaultTheme
