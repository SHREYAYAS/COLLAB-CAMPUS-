import React, { useContext, useState, useMemo } from 'react'
import {
  Container,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Divider,
  Box,
  Switch,
  TextField,
  Button,
  Grid
} from '@mui/material'
import { AppThemeContext } from '../main'

export default function SettingsPage() {
  const { mode, primary, setThemeSettings } = useContext(AppThemeContext)
  const [localMode, setLocalMode] = useState(mode)
  const [localPrimary, setLocalPrimary] = useState(primary)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)
  const [weeklyReport, setWeeklyReport] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [timezone, setTimezone] = useState('UTC')
  const [language, setLanguage] = useState('en')

  const primaries = useMemo(() => ([
    { key: 'indigo', label: 'Indigo', color: '#6b76ff' },
    { key: 'emerald', label: 'Emerald', color: '#10B981' },
    { key: 'blue', label: 'Blue', color: '#3B82F6' },
    { key: 'purple', label: 'Purple', color: '#8B5CF6' },
    { key: 'rose', label: 'Rose', color: '#F43F5E' },
  ]), [])

  const timezones = useMemo(() => ([
    { key: 'UTC', label: 'UTC' },
    { key: 'PST', label: 'Pacific (PST)' },
    { key: 'EST', label: 'Eastern (EST)' },
    { key: 'CET', label: 'Central Europe (CET)' },
    { key: 'IST', label: 'India (IST)' },
  ]), [])

  const languages = useMemo(() => ([
    { key: 'en', label: 'English' },
    { key: 'es', label: 'Spanish' },
    { key: 'fr', label: 'French' },
    { key: 'de', label: 'German' },
  ]), [])

  const applyTheme = () => {
    setThemeSettings({ mode: localMode, primary: localPrimary })
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>Settings</Typography>

      {/* Theme & Appearance */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Theme & Appearance
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            <Grid xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Mode</InputLabel>
                <Select value={localMode} label="Mode" onChange={(e) => setLocalMode(e.target.value)}>
                  <MenuItem value="light">Light</MenuItem>
                  <MenuItem value="dark">Dark</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Primary Color</InputLabel>
                <Select value={localPrimary} label="Primary Color" onChange={(e) => setLocalPrimary(e.target.value)}>
                  {primaries.map(p => (
                    <MenuItem key={p.key} value={p.key}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <span style={{ width: 14, height: 14, borderRadius: 999, backgroundColor: p.color, display: 'inline-block' }} />
                        {p.label}
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={4}>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ height: '100%', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Chip label={`Mode: ${localMode}`} />
                <Chip label={`Primary: ${localPrimary}`} />
                <Button variant="contained" onClick={applyTheme} sx={{ bgcolor: '#6b76ff', '&:hover': { bgcolor: '#5f69e6' } }}>
                  Apply
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Notifications */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
          Notifications
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>Email notifications</Typography>
                <Typography variant="body2" color="text.secondary">Updates, reminders, and reports</Typography>
              </Box>
              <Switch checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>Push notifications</Typography>
                <Typography variant="body2" color="text.secondary">Alerts on tasks and deadlines</Typography>
              </Box>
              <Switch checked={pushNotif} onChange={(e) => setPushNotif(e.target.checked)} />
            </Stack>
            <Divider />
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>Weekly summary</Typography>
                <Typography variant="body2" color="text.secondary">Email digest every Monday</Typography>
              </Box>
              <Switch checked={weeklyReport} onChange={(e) => setWeeklyReport(e.target.checked)} />
            </Stack>
          </Stack>
        </Paper>
      </Box>

      {/* Preferences */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#85e88a', borderRadius: 999 }} />
          Preferences
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Grid container spacing={2.5}>
            <Grid xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Timezone</InputLabel>
                <Select value={timezone} label="Timezone" onChange={(e) => setTimezone(e.target.value)}>
                  {timezones.map(tz => (
                    <MenuItem key={tz.key} value={tz.key}>{tz.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12} md={6}>
              <FormControl fullWidth size="small">
                <InputLabel>Language</InputLabel>
                <Select value={language} label="Language" onChange={(e) => setLanguage(e.target.value)}>
                  {languages.map(l => (
                    <MenuItem key={l.key} value={l.key}>{l.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={12}>
              <TextField
                fullWidth
                label="Signature"
                placeholder="Add a default signature for communications"
                size="small"
                multiline
                minRows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: '#f7f8fb',
                  },
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Security */}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Security
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>Two-factor authentication</Typography>
                <Typography variant="body2" color="text.secondary">Protect your account with 2FA</Typography>
              </Box>
              <Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} />
            </Stack>
            <Divider />
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>Active session</Typography>
                <Typography variant="body2" color="text.secondary">Last login: just now · Device: Web</Typography>
              </Box>
              <Button variant="outlined" size="small" sx={{ borderColor: '#a66bff', color: '#a66bff', '&:hover': { borderColor: '#9557d8', color: '#9557d8' } }}>
                Sign out other devices
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Box>
    </Container>
  )
}
