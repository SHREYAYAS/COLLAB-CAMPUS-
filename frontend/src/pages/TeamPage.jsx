import React, { useState } from 'react'
import { Container, Box, Typography, Button, Avatar, Stack, Paper, Chip, TextField, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import PersonAddIcon from '@mui/icons-material/PersonAdd'

export default function TeamPage() {
  const [members] = useState([
    { id: 1, name: 'John Doe', role: 'Project Lead', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', role: 'Developer', email: 'jane@example.com' },
    { id: 3, name: 'Bob Wilson', role: 'Designer', email: 'bob@example.com' },
  ])
  const [email, setEmail] = useState('')

  const handleInvite = () => {
    if (!email.trim()) return
    // In a real app, this would send an invite
    alert(`Invite sent to ${email}`)
    setEmail('')
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 3, mb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Team</Typography>
        <Typography variant="body2" color="text.secondary">Manage team members and collaborate seamlessly.</Typography>
      </Box>

      {/* ============ SECTION: INVITE MEMBERS ============ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Invite Team Members
        </Typography>
        <Paper className="soft-card" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems="stretch">
            <TextField
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              size="small"
              sx={{ flex: 1 }}
            />
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleInvite}
              sx={{ borderRadius: 2, minWidth: 140 }}
            >
              Invite
            </Button>
          </Stack>
        </Paper>
      </Box>

      {/* ============ SECTION: ACTIVE MEMBERS ============ */}
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
            Active Members ({members.length})
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {members.map((member) => (
            <Grid xs={12} sm={6} md={4} key={member.id}>
              <Paper className="soft-card" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none', textAlign: 'center' }}>
                <Avatar
                  sx={{
                    width: 56,
                    height: 56,
                    margin: '0 auto 1rem',
                    background: 'linear-gradient(135deg, #6b76ff, #a66bff)',
                  }}
                >
                  {member.name.charAt(0)}
                </Avatar>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 0.5 }}>
                  {member.name}
                </Typography>
                <Chip size="small" label={member.role} sx={{ mb: 1 }} />
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                  {member.email}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  )
}
