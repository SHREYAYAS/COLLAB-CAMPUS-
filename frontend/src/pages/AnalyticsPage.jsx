import React from 'react'
import { Container, Typography, Box, Paper, Chip, LinearProgress, Stack, Divider, Button, Grid } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

export default function AnalyticsPage() {
  const kpis = [
    { label: 'Active Users', value: '1,248', delta: '+12%', positive: true },
    { label: 'Sessions', value: '3,562', delta: '+6%', positive: true },
    { label: 'Avg. Session', value: '5m 12s', delta: '-3%', positive: false },
    { label: 'Bounce Rate', value: '28%', delta: '+1%', positive: false },
  ]

  const traffic = [
    { source: 'Organic', percent: 48, color: '#6b76ff' },
    { source: 'Direct', percent: 22, color: '#a66bff' },
    { source: 'Referral', percent: 18, color: '#85e88a' },
    { source: 'Paid', percent: 12, color: '#f6b87e' },
  ]

  const engagement = [
    { label: 'Productivity Suite', percent: 62 },
    { label: 'Collaboration', percent: 54 },
    { label: 'Files & Docs', percent: 47 },
    { label: 'Calendar', percent: 39 },
  ]

  return (
    <Container maxWidth="lg" sx={{ mt: 3, pb: 4 }}>
      {/* Overview */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Analytics Overview
        </Typography>
        <Grid container spacing={2.5}>
          {kpis.map((kpi) => (
            <Grid xs={12} sm={6} md={3} key={kpi.label}>
              <Paper className="soft-card" sx={{ p: 2.5 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {kpi.label}
                </Typography>
                <Typography variant="h5" fontWeight={700}>{kpi.value}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
                  {kpi.positive ? (
                    <ArrowUpwardIcon sx={{ fontSize: 16, color: '#2e7d32' }} />
                  ) : (
                    <ArrowDownwardIcon sx={{ fontSize: 16, color: '#c62828' }} />
                  )}
                  <Typography variant="caption" color={kpi.positive ? '#2e7d32' : '#c62828'}>
                    {kpi.delta} vs last week
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Performance Trends */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
          Performance Trends
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Box sx={{
                height: 240,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f7f8fb 0%, #eef0ff 100%)',
                display: 'flex',
                alignItems: 'flex-end',
                gap: 1,
                p: 2,
                border: '1px solid #e6e8f0',
              }}>
                {[52, 68, 61, 75, 82, 77, 90].map((v, idx) => (
                  <Box key={idx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 0.5 }}>
                    <Box sx={{ height: `${v}%`, backgroundColor: '#6b76ff', borderRadius: 999, transition: 'height 0.2s ease' }} />
                    <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>W{idx + 1}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>
            <Grid xs={12} md={4}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#f1f3ff', display: 'grid', placeItems: 'center' }}>
                    <TrendingUpIcon sx={{ color: '#6b76ff' }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>+18% QoQ</Typography>
                    <Typography variant="body2" color="text.secondary">Engagement uplift</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#f6efff', display: 'grid', placeItems: 'center' }}>
                    <ShowChartIcon sx={{ color: '#a66bff' }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>74% Feature Adoption</Typography>
                    <Typography variant="body2" color="text.secondary">New releases traction</Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Box sx={{ width: 44, height: 44, borderRadius: 2, backgroundColor: '#e9f8f0', display: 'grid', placeItems: 'center' }}>
                    <PeopleAltIcon sx={{ color: '#2e7d32' }} />
                  </Box>
                  <Box>
                    <Typography fontWeight={700}>82% Retention</Typography>
                    <Typography variant="body2" color="text.secondary">Returning users 30d</Typography>
                  </Box>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Traffic Sources */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#85e88a', borderRadius: 999 }} />
          Traffic Sources
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6}>
              <Stack spacing={1.5}>
                {traffic.map((item) => (
                  <Box key={item.source}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }} />
                        <Typography fontWeight={600}>{item.source}</Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary">{item.percent}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={item.percent}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: '#e8ecf7',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 3,
                          backgroundColor: item.color,
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid xs={12} md={6}>
              <Paper className="soft-card" sx={{ p: 2.5, height: '100%', background: 'linear-gradient(160deg, #f7f8fb 0%, #ecf3ff 100%)' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Channel Insights</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Organic search and referrals are driving the strongest growth this week.
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArrowUpwardIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                    <Typography variant="body2">Organic CTR up 9%</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArrowUpwardIcon sx={{ fontSize: 18, color: '#2e7d32' }} />
                    <Typography variant="body2">Referral conversions +5%</Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <ArrowDownwardIcon sx={{ fontSize: 18, color: '#c62828' }} />
                    <Typography variant="body2">Paid CPA +3% (optimize)</Typography>
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>

      {/* Engagement */}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Engagement Breakdown
        </Typography>
        <Paper className="soft-card" sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid xs={12} md={7}>
              <Stack spacing={1.5}>
                {engagement.map((item) => (
                  <Box key={item.label}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 18, color: '#6b76ff' }} />
                      <Typography fontWeight={600}>{item.label}</Typography>
                      <Chip label={`${item.percent}%`} size="small" sx={{ bgcolor: '#f1f3ff', color: '#3c4697' }} />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={item.percent}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e8ecf7',
                        '& .MuiLinearProgress-bar': {
                          borderRadius: 4,
                          backgroundColor: '#6b76ff',
                        },
                      }}
                    />
                  </Box>
                ))}
              </Stack>
            </Grid>
            <Grid xs={12} md={5}>
              <Paper className="soft-card" sx={{ p: 2.5, height: '100%' }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>Recommendations</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Focus on collaboration and files to lift weekly active usage.
                </Typography>
                <Stack spacing={1.5}>
                  <Button variant="contained" fullWidth sx={{ bgcolor: '#6b76ff', '&:hover': { bgcolor: '#5f69e6' } }}>
                    Boost Collaboration
                  </Button>
                  <Button variant="outlined" fullWidth sx={{ borderColor: '#a66bff', color: '#a66bff', '&:hover': { borderColor: '#9557d8', color: '#9557d8' } }}>
                    Improve Onboarding
                  </Button>
                  <Divider />
                  <Typography variant="caption" color="text.secondary">
                    Tips: surface shortcuts, highlight new releases, and reduce friction in task handoffs.
                  </Typography>
                </Stack>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  )
}
