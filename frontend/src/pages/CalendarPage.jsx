import React, { useMemo, useState } from 'react'
import { Container, Typography, Box, Paper, Chip, Button, TextField, LinearProgress, IconButton, Stack, Divider, Grid } from '@mui/material'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import AddCircleIcon from '@mui/icons-material/AddCircle'

export default function CalendarPage() {
  const today = new Date()
  const [currentDate, setCurrentDate] = useState(today)
  const [selectedDate, setSelectedDate] = useState(today)
  const [events, setEvents] = useState([
    { id: 1, title: 'Sprint Review', date: '2025-12-12', color: '#6b76ff', type: 'meeting' },
    { id: 2, title: 'Design Handoff', date: '2025-12-14', color: '#a66bff', type: 'handoff' },
    { id: 3, title: 'QA Regression', date: '2025-12-15', color: '#85e88a', type: 'testing' },
  ])
  const [challenges, setChallenges] = useState([
    { id: 1, title: 'Complete 3 Tasks', description: 'Finish 3 project tasks today', progress: 66, color: '#6b76ff', status: 'in-progress' },
    { id: 2, title: 'Team Meeting', description: 'Attend weekly sync at 2 PM', progress: 0, color: '#a66bff', status: 'pending' },
    { id: 3, title: 'Code Review', description: 'Review pull requests from team', progress: 100, color: '#85e88a', status: 'completed' },
  ])

  const [newChallenge, setNewChallenge] = useState('')
  const [newEventTitle, setNewEventTitle] = useState('')

  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, {
        id: challenges.length + 1,
        title: newChallenge,
        description: 'New challenge',
        progress: 0,
        color: '#6b76ff',
        status: 'pending'
      }])
      setNewChallenge('')
    }
  }

  const completeChallenge = (id) => {
    setChallenges(challenges.map(c => c.id === id ? { ...c, progress: 100, status: 'completed' } : c))
  }

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  }, [currentDate])

  const daysInMonth = useMemo(() => {
    const start = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const end = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startDay = start.getDay()
    const totalDays = end.getDate()
    const cells = []
    for (let i = 0; i < startDay; i += 1) cells.push(null)
    for (let d = 1; d <= totalDays; d += 1) {
      cells.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), d))
    }
    return cells
  }, [currentDate])

  const goPrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const formatDateKey = (date) => {
    return date.toISOString().slice(0, 10)
  }

  const addEvent = () => {
    if (!newEventTitle.trim()) return
    const key = formatDateKey(selectedDate)
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: newEventTitle.trim(),
        date: key,
        color: '#6b76ff',
        type: 'custom',
      },
    ])
    setNewEventTitle('')
  }

  const eventsForSelected = useMemo(() => {
    const key = formatDateKey(selectedDate)
    return events.filter(e => e.date === key)
  }, [events, selectedDate])

  return (
    <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
      {/* Calendar Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Calendar
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <CalendarTodayIcon sx={{ color: '#6b76ff' }} />
              <Typography variant="h6" fontWeight={700}>{monthLabel}</Typography>
            </Stack>
            <Box>
              <IconButton onClick={goPrevMonth} size="small">
                <ArrowBackIosNewIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={goNextMonth} size="small">
                <ArrowForwardIosIcon fontSize="small" />
              </IconButton>
            </Box>
          </Stack>

          <Grid container spacing={3}>
            <Grid xs={12} md={7}>
              <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 1,
              }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <Box key={day} sx={{ textAlign: 'center', fontWeight: 700, color: '#718096', pb: 1 }}>
                    {day}
                  </Box>
                ))}
                {daysInMonth.map((date, idx) => {
                  const isToday = date && formatDateKey(date) === formatDateKey(today)
                  const isSelected = date && formatDateKey(date) === formatDateKey(selectedDate)
                  const hasEvent = date && events.some(e => e.date === formatDateKey(date))
                  return (
                    <Paper
                      key={idx}
                      className="soft-card"
                      sx={{
                        p: 1.5,
                        minHeight: 70,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'flex-start',
                        cursor: date ? 'pointer' : 'default',
                        border: isSelected ? '1px solid #6b76ff' : '1px solid transparent',
                        backgroundColor: isSelected ? '#f1f3ff' : '#fff',
                        opacity: date ? 1 : 0,
                      }}
                      onClick={() => date && setSelectedDate(date)}
                    >
                      {date && (
                        <Box sx={{ width: '100%' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography fontWeight={700} color={isToday ? '#6b76ff' : 'text.primary'}>
                              {date.getDate()}
                            </Typography>
                            {isToday && (
                              <Chip label="Today" size="small" sx={{ bgcolor: '#e8ecf7', color: '#6b76ff', height: 22 }} />
                            )}
                          </Box>
                          {hasEvent && (
                            <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {events.filter(e => e.date === formatDateKey(date)).slice(0, 2).map(e => (
                                <Chip key={e.id} label={e.title} size="small" sx={{ bgcolor: '#f1f3ff', color: '#3c4697' }} />
                              ))}
                            </Box>
                          )}
                        </Box>
                      )}
                    </Paper>
                  )
                })}
              </Box>
            </Grid>

            <Grid xs={12} md={5}>
              <Paper className="soft-card" sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Events on {selectedDate.toLocaleDateString()}
                </Typography>
                <Stack spacing={1.5} sx={{ mb: 2 }}>
                  {eventsForSelected.length === 0 && (
                    <Typography variant="body2" color="text.secondary">No events for this day.</Typography>
                  )}
                  {eventsForSelected.map((event) => (
                    <Paper key={event.id} className="soft-card" sx={{ p: 1.5, borderLeft: `4px solid ${event.color}` }}>
                      <Typography fontWeight={700}>{event.title}</Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                        {event.type}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>

                <Divider sx={{ my: 2 }} />

                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Add Event</Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Event title"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addEvent()}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: '#f7f8fb',
                      },
                    }}
                  />
                  <Button
                    startIcon={<AddCircleIcon />}
                    variant="contained"
                    onClick={addEvent}
                    sx={{ bgcolor: '#6b76ff', '&:hover': { bgcolor: '#5f69e6' } }}
                  >
                    Save
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Challenge Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
          Daily Challenges
        </Typography>

        {/* Add New Challenge */}
        <Paper className="soft-card" sx={{ p: 3, mb: 3 }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Add a new challenge..."
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addChallenge()}
              variant="outlined"
              size="small"
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: '#f7f8fb',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={addChallenge}
              sx={{
                bgcolor: '#a66bff',
                '&:hover': { bgcolor: '#9557d8' },
              }}
            >
              Add
            </Button>
          </Box>
        </Paper>

        {/* Challenges List */}
        <Grid container spacing={2}>
          {challenges.map((challenge) => (
            <Grid xs={12} md={6} key={challenge.id}>
              <Paper className="soft-card" sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.5 }}>
                      {challenge.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {challenge.description}
                    </Typography>
                  </Box>
                  {challenge.status === 'completed' ? (
                    <CheckCircleIcon sx={{ color: '#85e88a', fontSize: 24 }} />
                  ) : (
                    <EmojiEventsIcon sx={{ color: challenge.color, fontSize: 24 }} />
                  )}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={challenge.progress}
                    sx={{
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e8ecf7',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 3,
                        backgroundColor: challenge.color,
                      },
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                  <Chip
                    label={challenge.status}
                    size="small"
                    sx={{
                      textTransform: 'capitalize',
                      backgroundColor:
                        challenge.status === 'completed'
                          ? '#e8f5e9'
                          : challenge.status === 'in-progress'
                            ? '#e3f2fd'
                            : '#f3e5f5',
                      color:
                        challenge.status === 'completed'
                          ? '#2e7d32'
                          : challenge.status === 'in-progress'
                            ? '#1565c0'
                            : '#6a1b9a',
                    }}
                  />
                  {challenge.status !== 'completed' && (
                    <Button
                      size="small"
                      onClick={() => completeChallenge(challenge.id)}
                      sx={{ color: '#6b76ff' }}
                    >
                      Mark Done
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
