import React from 'react'
import { Box, Typography } from '@mui/material'

function ActionPill({ icon, label }) {
  return (
    <Box 
      className="pill" 
      sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: 1.5, 
        px: 2.5, 
        py: 1.25,
        borderRadius: 3,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        border: '1px solid',
        borderColor: 'rgba(102, 126, 234, 0.2)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.12) 0%, rgba(118, 75, 162, 0.12) 100%)',
          borderColor: 'rgba(102, 126, 234, 0.4)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 20px rgba(102, 126, 234, 0.15)',
        },
        '&:active': {
          transform: 'translateY(0)',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.1)',
        }
      }}
    >
      <Box sx={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: 32, 
        height: 32, 
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
      }}>
        {React.cloneElement(icon, { sx: { fontSize: 18, color: '#fff' } })}
      </Box>
      <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>{label}</Typography>
    </Box>
  )
}

export default function QuickActionsRow({ items = [] }) {
  return (
    <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
      {items.map((it, i) => (
        <ActionPill key={i} icon={it.icon} label={it.label} />
      ))}
    </Box>
  )
}
