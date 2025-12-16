import React from 'react'
import { Box, Typography, Button, Avatar } from '@mui/material'

export default function ProfileHero({
  name = 'Good Morning!',
  subtitle = 'Welcome back',
  email,
  onPrimary,
  primaryLabel = 'Continue Learning',
  coverUrl,
}) {
  return (
    <Box sx={{ position: 'relative', overflow: 'hidden', borderRadius: 4 }}>
      <Box sx={{
        p: 4,
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: 'rgba(102, 126, 234, 0.1)',
      }}>
        {coverUrl && (
          <Box sx={{ position: 'absolute', right: 0, top: 0, bottom: 0, opacity: 0.15 }}>
            <img src={coverUrl} alt="cover" style={{ height: '100%', objectFit: 'cover' }} />
          </Box>
        )}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ 
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              inset: -4,
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '50%',
              opacity: 0.3,
              filter: 'blur(8px)',
            }
          }}>
            <Avatar sx={{ 
              width: 64, 
              height: 64, 
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              border: '3px solid white',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              fontSize: 24,
              fontWeight: 700,
              position: 'relative',
            }}>
              {(subtitle || 'U').charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" fontWeight={700} sx={{ 
              mb: 0.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              {name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>{email || subtitle}</Typography>
          </Box>
          <Button 
            variant="contained" 
            onClick={onPrimary} 
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.5,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
              fontSize: 16,
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 12px 28px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              }
            }}
          >
            {primaryLabel}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
