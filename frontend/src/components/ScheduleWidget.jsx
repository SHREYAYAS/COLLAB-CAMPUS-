import React from 'react'
import { Box, Typography } from '@mui/material'

export default function ScheduleWidget({
  dateLabel = 'Today',
  items = [
    { time: '9:00 AM', label: 'Team Standup Meeting', color: '#667eea' },
    { time: '11:30 AM', label: 'Project Design Review', color: '#764ba2' },
    { time: '2:00 PM', label: 'Client Presentation', color: '#10b981' },
  ],
}) {
  return (
    <Box className="soft-card" sx={{ 
      p: 3, 
      height: 280, 
      borderRadius: 3, 
      boxShadow: 'none',
      border: '1px solid',
      borderColor: 'divider',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s ease',
      '&:hover': {
        boxShadow: '0 8px 24px rgba(0,0,0,0.06)',
        borderColor: 'primary.light',
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="subtitle1" fontWeight={700} sx={{ fontSize: 18 }}>{dateLabel}</Typography>
        <Box sx={{ 
          px: 1.5, 
          py: 0.5, 
          borderRadius: 2, 
          bgcolor: '#f1f3ff',
          color: '#667eea',
          fontSize: 12,
          fontWeight: 600,
        }}>
          {items.length} tasks
        </Box>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, flex: 1, overflowY: 'auto' }}>
        {items.map((it, i) => (
          <Box 
            key={i} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2, 
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 3, 
              p: 1.5, 
              bgcolor: '#fafbff',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f5f7ff',
                borderColor: it.color,
                transform: 'translateX(4px)',
                boxShadow: `0 4px 12px ${it.color}33`,
              }
            }}
          >
            <Box sx={{ 
              minWidth: 12, 
              height: 12, 
              borderRadius: '50%', 
              bgcolor: it.color,
              boxShadow: `0 0 0 3px ${it.color}22`,
            }} />
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.25, color: 'text.primary' }}>{it.label}</Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>{it.time}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
