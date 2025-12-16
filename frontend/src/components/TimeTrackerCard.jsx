import React, { useEffect, useRef, useState } from 'react'
import { Box, Stack, Typography, IconButton, Tooltip } from '@mui/material'
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded'
import PauseRoundedIcon from '@mui/icons-material/PauseRounded'
import StopRoundedIcon from '@mui/icons-material/StopRounded'
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded'

function format(seconds) {
  const h = Math.floor(seconds / 3600).toString().padStart(2, '0')
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0')
  const s = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${h}:${m}:${s}`
}

export default function TimeTrackerCard() {
  const [running, setRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    if (running) {
      ref.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    }
    return () => ref.current && clearInterval(ref.current)
  }, [running])

  const handleReset = () => {
    setRunning(false)
    setSeconds(0)
  }

  const handleStop = () => {
    setRunning(false)
  }

  return (
    <Box
      sx={{
  // Square that fits the tile height; width follows height via aspect-ratio
  height: '100%',
  aspectRatio: '1 / 1',
  mx: 'auto',
  // Keep it a rounded square (explicit px to avoid theme scaling to huge values)
  borderRadius: { xs: '14px', sm: '16px', md: '18px' },
    p: { xs: 1.25, sm: 1.75 },
  color: '#fff',
  // Center timer cleanly; other UI (title/buttons) are absolutely positioned
  display: 'grid',
  placeItems: 'center',
        background:
          'radial-gradient(120% 120% at 10% 10%, rgba(23, 180, 115, 0.20) 0%, rgba(23,180,115,0) 50%), linear-gradient(145deg, #166A4B 0%, #0E4030 55%, #082D22 100%)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 60px rgba(0,0,0,0.18)',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/textures/time-tracker-wave.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.7,
          mixBlendMode: 'soft-light',
          pointerEvents: 'none'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(1200px 400px at -10% 120%, rgba(255,255,255,0.10), transparent 60%), radial-gradient(700px 300px at 120% -20%, rgba(255,255,255,0.08), transparent 60%), repeating-conic-gradient(from 0deg at 120% 0%, rgba(255,255,255,0.06) 0deg, rgba(255,255,255,0.00) 10deg 20deg), linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0) 40%)'
          ,
          opacity: 0.45,
          pointerEvents: 'none'
        }
      }}
    >
      {/* Title pinned with safe insets so it doesn't touch rounded corners */}
      <Box sx={{ position: 'absolute', top: 10, left: 14, zIndex: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'rgba(255,255,255,0.92)', letterSpacing: 0.2 }}>
          Time Tracker
        </Typography>
      </Box>

      <Stack alignItems="center" spacing={0.5}>
        <Typography
          component="div"
          sx={{
            // Keep time readable but always fitting inside the box
            fontSize: {
              xs: 'clamp(26px, 6.5vw, 40px)',
              sm: 'clamp(28px, 5.5vw, 46px)',
              md: 'clamp(30px, 4.5vw, 48px)'
            },
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: 0.5,
            color: '#fff',
            textShadow: '0 6px 18px rgba(0,0,0,0.25)',
            whiteSpace: 'nowrap'
          }}
        >
          {format(seconds)}
        </Typography>
      </Stack>

  <Box sx={{ position: 'absolute', left: 10, bottom: 10, display: 'flex', gap: { xs: 0.75, sm: 1 }, alignItems: 'center', zIndex: 1 }}>
        {!running ? (
          <Tooltip title="Start">
            <IconButton
              aria-label="start"
              onClick={() => setRunning(true)}
              sx={{
                width: { xs: 34, sm: 40, md: 44 },
                height: { xs: 34, sm: 40, md: 44 },
                bgcolor: '#16A34A',
                color: '#fff',
                boxShadow: '0 10px 22px rgba(0,0,0,0.25), 0 0 0 6px rgba(22,163,74,0.18)',
                '&:hover': { bgcolor: '#15803D', boxShadow: '0 12px 26px rgba(0,0,0,0.30), 0 0 0 6px rgba(21,128,61,0.22)' }
              }}
            >
              <PlayArrowRoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Pause">
            <IconButton
              aria-label="pause"
              onClick={() => setRunning(false)}
              sx={{
                width: { xs: 34, sm: 40, md: 44 },
                height: { xs: 34, sm: 40, md: 44 },
                bgcolor: '#FFFFFF',
                color: '#14532D',
                boxShadow: '0 10px 22px rgba(0,0,0,0.20)',
                '&:hover': { bgcolor: '#F3F4F6' }
              }}
            >
              <PauseRoundedIcon sx={{ fontSize: 28 }} />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={running ? 'Stop' : 'Reset'}>
          <IconButton
            aria-label={running ? 'stop' : 'reset'}
            onClick={running ? handleStop : handleReset}
            sx={{
              width: { xs: 30, sm: 34, md: 38 },
              height: { xs: 30, sm: 34, md: 38 },
              bgcolor: running ? '#DC2626' : 'rgba(255,255,255,0.10)',
              color: '#fff',
              border: running ? 'none' : '1px solid rgba(255,255,255,0.35)',
              boxShadow: running ? '0 10px 22px rgba(0,0,0,0.25)' : 'none',
              '&:hover': { bgcolor: running ? '#B91C1C' : 'rgba(255,255,255,0.18)' }
            }}
          >
            {running ? <StopRoundedIcon sx={{ fontSize: 24 }} /> : <RestartAltRoundedIcon sx={{ fontSize: 24 }} />}
          </IconButton>
        </Tooltip>
  </Box>
    </Box>
  )
}
