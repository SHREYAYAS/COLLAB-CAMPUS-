import React from 'react'
import { Box, Typography, Button, Stack, Chip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront'

export default function RemindersCard() {
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h6" fontWeight={700}>Upcoming</Typography>
        <Button 
          size="small" 
          variant="outlined" 
          startIcon={<AddIcon />} 
          sx={{ 
            borderRadius: 3,
            borderColor: '#667eea',
            color: '#667eea',
            '&:hover': {
              borderColor: '#764ba2',
              bgcolor: 'rgba(102, 126, 234, 0.04)',
            }
          }}
        >
          New
        </Button>
      </Box>
      <Chip 
        label="Product Demo" 
        size="small" 
        sx={{ 
          alignSelf: 'flex-start', 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #667eea, #764ba2)',
          color: '#fff',
          fontWeight: 600,
        }} 
      />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>Client Presentation Q4</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <AccessTimeIcon fontSize="small" sx={{ color: 'text.secondary' }} />
          <Typography variant="body2" color="text.secondary" fontWeight={500}>02:00 PM – 04:00 PM</Typography>
        </Box>
      </Box>
      <Box sx={{ mt: 1 }}>
        <Button
          variant="contained"
          startIcon={<VideoCameraFrontIcon />}
          fullWidth
          sx={{
            borderRadius: 3,
            py: 1.25,
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)',
            fontWeight: 600,
            fontSize: 15,
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 28px rgba(16, 185, 129, 0.4)',
              transform: 'translateY(-2px)',
            }
          }}
        >
          Join Meeting
        </Button>
      </Box>
    </Stack>
  )
}
