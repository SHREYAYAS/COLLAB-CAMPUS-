import React from 'react'
import { Box, Typography } from '@mui/material'

const days = ['S','M','T','W','T','F','S']

export default function CalendarWidget({
  monthLabel = 'December 2025',
  activeDays = [5, 12, 16, 20, 25],
}) {
  const today = new Date()
  const first = new Date(today.getFullYear(), today.getMonth(), 1)
  const startIdx = first.getDay()
  const daysInMonth = new Date(today.getFullYear(), today.getMonth()+1, 0).getDate()
  const currentDay = today.getDate()
  const grid = []
  for (let i = 0; i < startIdx; i++) grid.push(null)
  for (let d = 1; d <= daysInMonth; d++) grid.push(d)

  return (
    <Box className="soft-card" sx={{ 
      p: 3, 
      height: 280, 
      borderRadius: 3, 
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        borderColor: 'primary.light',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 18 }}>{monthLabel}</Typography>
        <Box sx={{ 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 2, 
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          fontSize: 12,
          fontWeight: 600,
        }}>
          {activeDays.length} events
        </Box>
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1, mb: 1.5 }}>
        {days.map((d) => (
          <Typography key={d} variant="caption" sx={{ color: 'text.secondary', textAlign: 'center', fontWeight: 700, fontSize: 11 }}>{d}</Typography>
        ))}
      </Box>
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 1 }}>
        {grid.map((d, idx) => {
          const isToday = d === currentDay
          const isActive = d && activeDays.includes(d)
          return (
            <Box key={idx} sx={{
              height: 32,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: isToday ? 'linear-gradient(135deg, #667eea, #764ba2)' : (isActive ? '#f1f3ff' : 'transparent'),
              background: isToday ? 'linear-gradient(135deg, #667eea, #764ba2)' : (isActive ? '#f1f3ff' : 'transparent'),
              border: isActive && !isToday ? '2px solid #667eea' : (d ? '1px solid #e3e8ef' : 'none'),
              cursor: d ? 'pointer' : 'default',
              transition: 'all 0.2s ease',
              '&:hover': d ? {
                transform: 'scale(1.1)',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
              } : {},
            }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontWeight: isToday || isActive ? 700 : 500, 
                  color: isToday ? '#fff' : (isActive ? '#667eea' : 'text.primary'),
                  fontSize: 13,
                }}
              >
                {d || ''}
              </Typography>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
