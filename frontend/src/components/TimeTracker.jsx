import React, { useEffect, useRef, useState } from 'react'
import { Paper, Typography, Box, IconButton, Tooltip } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'

function format(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function TimeTracker() {
  // Keep existing timer logic
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => timerRef.current && clearInterval(timerRef.current)
  }, [running])

  const handleReset = () => {
    setRunning(false)
    setSeconds(0)
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: 240,
        borderRadius: 3,
        color: '#fff',
        background: 'linear-gradient(145deg, #166A4B 0%, #0E4030 55%, #082D22 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Title at top */}
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.92)' }}>
        Time Tracker
      </Typography>

      {/* Time in the center */}
      <Typography
        variant="h3"
        sx={{
          alignSelf: 'center',
          fontWeight: 800,
          letterSpacing: 1,
          color: '#fff',
          textShadow: '0 6px 18px rgba(0,0,0,0.25)',
          lineHeight: 1
        }}
      >
        {format(seconds)}
      </Typography>

      {/* Controls grouped and centered at the bottom */}
      <Box sx={{ alignSelf: 'center', display: 'flex', gap: 1 }}>
        {!running ? (
          <Tooltip title="Start">
            <IconButton
              aria-label="start"
              onClick={() => setRunning(true)}
              sx={{
                width: 44,
                height: 44,
                bgcolor: '#16A34A',
                color: '#fff',
                '&:hover': { bgcolor: '#15803D' }
              }}
            >
              <PlayArrowRoundedIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Pause">
            <IconButton
              aria-label="pause"
              onClick={() => setRunning(false)}
              sx={{ width: 44, height: 44, bgcolor: '#FFFFFF', color: '#14532D', '&:hover': { bgcolor: '#F3F4F6' } }}
            >
              <PauseRoundedIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Reset">
          <IconButton
            aria-label="reset"
            onClick={handleReset}
            sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.10)', color: '#fff', border: '1px solid rgba(255,255,255,0.35)' }}
          >
            <RestartAltRoundedIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Paper>
  )
}
