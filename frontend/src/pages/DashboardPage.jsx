import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { getSampleProjects } from '../data/sampleData'
import { Typography, Container, Paper, Button, Box, Chip, ToggleButtonGroup, ToggleButton, Divider, ButtonGroup, Grid } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import GridViewIcon from '@mui/icons-material/GridView'
import TaskIcon from '@mui/icons-material/AssignmentTurnedIn'
import DoneAllIcon from '@mui/icons-material/DoneAll'
import GroupIcon from '@mui/icons-material/Group'
import AnalyticsChart from '../components/AnalyticsChart'
import ProfileHero from '../components/ProfileHero'
import QuickActionsRow from '../components/QuickActionsRow'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import BrushIcon from '@mui/icons-material/Brush'
import SchoolIcon from '@mui/icons-material/School'
import ProjectProgressDonut from '../components/ProjectProgressDonut'
import RemindersCard from '../components/RemindersCard'
import TeamCollaboration from '../components/TeamCollaboration'
import ProjectListMini from '../components/ProjectListMini'
import TimeTrackerCard from '../components/TimeTrackerCard'
import StatCard from '../components/StatCard'
import TotalProjectsCard from '../components/TotalProjectsCard'
import CalendarWidget from '../components/CalendarWidget'
import ScheduleWidget from '../components/ScheduleWidget'

export default function DashboardPage() {
  const [projects, setProjects] = useState([])
  const [chartRange, setChartRange] = useState('7d')
  const [viewMode, setViewMode] = useState('rich') // 'rich' | 'minimal'
  const navigate = useNavigate()
  const [userName, setUserName] = useState('User')
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const loadProjects = async () => {
      try {
        // In development, use sample data as primary source
        if (import.meta.env.DEV) {
          const sampleProjects = getSampleProjects()
          if (sampleProjects && sampleProjects.length > 0) {
            setProjects(sampleProjects)
            return
          }
        }
        
        const { data } = await client.get('/projects')
        const list = Array.isArray(data) ? data : (data?.projects || [])
        setProjects(list.length > 0 ? list : getSampleProjects())
      } catch {
        // Use sample data as fallback
        setProjects(getSampleProjects())
      }
    }
    loadProjects()
    // Load current user lightweight
    ;(async () => {
      try {
        const { data } = await client.get('/me')
        const u = Array.isArray(data) ? data[0] : (data?.user || data)
        setUserName(u?.name || u?.username || 'User')
        setUserEmail(u?.email || '')
      } catch {
        // Ignore error - will use default username
      }
    })()
  }, [])

  // Derive task breakdown across all projects for live progress
  const taskBreakdown = useMemo(() => {
    let completed = 0, inProgress = 0, pending = 0
    for (const p of projects) {
      const tasks = Array.isArray(p.tasks) ? p.tasks : []
      for (const t of tasks) {
        const s = (t.status || '').toLowerCase()
        if (['done', 'completed', 'complete'].includes(s)) completed++
        else if (['in progress', 'progress', 'running', 'active'].includes(s)) inProgress++
        else pending++
      }
    }
    return { completed, inProgress, pending }
  }, [projects])

  const richView = (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      {/* Profile Hero */}
      <Box sx={{ mb: 4 }}>
        <ProfileHero
          name={`Welcome back, ${userName}!`}
          subtitle="Let's make progress today"
          email={userEmail}
          primaryLabel="View All Projects"
          onPrimary={() => navigate('/projects')}
        />
      </Box>

      {/* Quick Actions + Controls */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight={700}>Quick Actions</Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <ButtonGroup size="small" variant="outlined" sx={{ mr: 1, borderRadius: 2, '& .MuiButton-root': { borderRadius: 2 } }}>
              <Button disabled={viewMode === 'rich'} onClick={() => setViewMode('rich')}>Rich</Button>
              <Button disabled={viewMode === 'minimal'} onClick={() => setViewMode('minimal')}>Minimal</Button>
            </ButtonGroup>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              sx={{ 
                borderRadius: 3, 
                px: 3, 
                py: 1.25, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 28px rgba(102, 126, 234, 0.4)',
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => navigate('/projects')}
            >
              Add Project
            </Button>
          </Box>
        </Box>
        <QuickActionsRow items={[
          { icon: <BookmarkIcon sx={{ fontSize: 16, color: '#4b52c8' }} />, label: 'E-Commerce Platform' },
          { icon: <BrushIcon sx={{ fontSize: 16, color: '#a66bff' }} />, label: 'Mobile App Design' },
          { icon: <SchoolIcon sx={{ fontSize: 16, color: '#6b76ff' }} />, label: 'Learning Management' },
        ]}/>
      </Box>

      {/* ============ SECTION: PROJECT OVERVIEW ============ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 5, height: 28, background: 'linear-gradient(to bottom, #6b76ff, #764ba2)', borderRadius: 999 }} />
          Project Overview
        </Typography>
        <Grid container spacing={2.5}>
          <Grid xs={12} sm={6} md={3}><TotalProjectsCard count={projects?.length ?? 0} onOpen={() => navigate('/projects')} /></Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Completed Projects" value={8} icon={<TaskIcon fontSize="small" color="action" />} subtitle="+3 this month" trend="up" subtitleAsBadge className="soft-card" sx={{ borderRadius: 3, boxShadow: 'none', bgcolor: '#fff' }} showCornerArrow onCornerClick={() => navigate('/projects')} cornerTooltip="View completed projects" />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Active Projects" value={5} icon={<DoneAllIcon fontSize="small" color="action" />} subtitle="+2 this week" trend="up" subtitleAsBadge className="soft-card" sx={{ borderRadius: 3, boxShadow: 'none', bgcolor: '#fff' }} showCornerArrow onCornerClick={() => navigate('/projects')} cornerTooltip="View active projects" />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="In Planning" value={3} icon={<GroupIcon fontSize="small" color="action" />} subtitle="Under review" trend="none" subtitleAsBadge className="soft-card" sx={{ borderRadius: 3, boxShadow: 'none', bgcolor: '#fff' }} showCornerArrow onCornerClick={() => navigate('/projects')} cornerTooltip="View planning projects" />
          </Grid>
        </Grid>
      </Box>

      {/* ============ SECTION: ANALYTICS & INSIGHTS ============ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 5, height: 28, background: 'linear-gradient(to bottom, #a66bff, #667eea)', borderRadius: 999 }} />
          Analytics & Insights
        </Typography>
        <Grid container spacing={2.5}>
          <Grid xs={12} lg={6}>
            <Paper className="soft-card" sx={{ p: 2.5, height: 280, borderRadius: 3, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1.5 }}>
                <Typography variant="subtitle1" fontWeight={700}>Project Analytics</Typography>
                <ToggleButtonGroup size="small" value={chartRange} exclusive onChange={(e, val) => { if (val) setChartRange(val) }} sx={{ '& .MuiToggleButton-root': { textTransform: 'none', borderRadius: 999, px: 1.25, py: 0.25 } }}>
                  <ToggleButton value="7d">7d</ToggleButton>
                  <ToggleButton value="30d">30d</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              <AnalyticsChart range={chartRange} />
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} lg={3}><CalendarWidget /></Grid>
          <Grid xs={12} sm={6} lg={3}><ScheduleWidget /></Grid>
        </Grid>
      </Box>

      {/* ============ SECTION: TEAM & PROGRESS ============ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{ width: 5, height: 28, background: 'linear-gradient(to bottom, #85e88a, #10b981)', borderRadius: 999 }} />
          Team & Progress
        </Typography>
        <Grid container spacing={2.5}>
          <Grid xs={12} md={6} lg={6}><Paper className="soft-card" sx={{ p: 2.5, height: 320, display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 'none', overflowX: 'hidden', overflowY: 'auto' }}><TeamCollaboration /></Paper></Grid>
          <Grid xs={12} md={4} lg={4}>
            <Paper className="soft-card" sx={{ p: 2.5, height: 320, display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 'none', overflow: 'hidden' }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Project Progress</Typography>
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ProjectProgressDonut breakdown={taskBreakdown} value={taskBreakdown.completed + taskBreakdown.inProgress + taskBreakdown.pending === 0 ? 0 : undefined} size={220} thickness={28} showLegend semiGauge animateCount labelScale={1.25} subtitleScale={0.9} centerSubtitle="Project Ended" patternPending={false} gapPx={0} padDegrees={8} startAngleDeg={-205} roundedEnds colors={{ completed: '#0C5C3C', inProgress: '#0A6F39', pending: '#BFE8D3' }} />
            </Box>
          </Paper>
        </Grid>
          <Grid xs={12} md={2} lg={2}><Paper className="soft-card" sx={{ p: 2.5, height: 320, borderRadius: 3, boxShadow: 'none', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}><TimeTrackerCard /></Paper></Grid>
        </Grid>
      </Box>
    </Container>
  )

  const minimalView = (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Dashboard</Typography>
          <Typography variant="caption" color="text.secondary">Compact overview</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <ButtonGroup size="small" variant="outlined">
            <Button disabled={viewMode === 'rich'} onClick={() => setViewMode('rich')}>Rich</Button>
            <Button disabled={viewMode === 'minimal'} onClick={() => setViewMode('minimal')}>Minimal</Button>
          </ButtonGroup>
          <Button size="small" variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/projects')}>Add</Button>
        </Box>
      </Box>
      <Divider sx={{ mb: 3 }} />

      {/* Stats summary row */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Quick Stats
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Projects</Typography>
            <Typography variant="h6">{projects.length}</Typography>
          </Box>
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Tasks Done</Typography>
            <Typography variant="h6">{taskBreakdown.completed}</Typography>
          </Box>
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>In Progress</Typography>
            <Typography variant="h6">{taskBreakdown.inProgress}</Typography>
          </Box>
          <Box sx={{ minWidth: 140 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>Pending</Typography>
            <Typography variant="h6">{taskBreakdown.pending}</Typography>
          </Box>
        </Box>
      </Box>
      {/* Analytics simplified */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 20, bgcolor: '#a66bff', borderRadius: 999 }} />
          Analytics ({chartRange})
        </Typography>
        <Box sx={{ mb: 0, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
          <ToggleButtonGroup size="small" value={chartRange} exclusive onChange={(e,val)=>{ if(val) setChartRange(val) }} sx={{mb: 1.5}}>
            <ToggleButton value="7d">7d</ToggleButton>
            <ToggleButton value="30d">30d</ToggleButton>
          </ToggleButtonGroup>
          <AnalyticsChart range={chartRange} />
        </Box>
      </Box>
      {/* Progress donut simplified */}
      <Box sx={{ mb: 4, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Progress</Typography>
        <ProjectProgressDonut breakdown={taskBreakdown} size={180} thickness={24} semiGauge animateCount colors={{ completed: '#0C5C3C', inProgress: '#0A6F39', pending: '#BFE8D3' }} />
      </Box>
      {/* Mini project list & time tracker condensed */}
      <Grid container spacing={2} sx={{mb: 3}}>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Projects</Typography>
            <ProjectListMini />
          </Box>
        </Grid>
        <Grid xs={12} md={6}>
          <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Time Tracker</Typography>
            <TimeTrackerCard />
          </Box>
        </Grid>
      </Grid>
      <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>Team Collaboration</Typography>
        <TeamCollaboration />
      </Box>
    </Container>
  )

  return viewMode === 'minimal' ? minimalView : richView
}
