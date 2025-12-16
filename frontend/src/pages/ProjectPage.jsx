import React, { useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useParams, Link } from 'react-router-dom'
import client, { fetchCurrentUser } from '../api/client'
import KanbanBoard from '../components/KanbanBoard'
import GanttChart from '../components/GanttChart'
import ProjectHeader from '../components/ProjectHeader'
import StatCard from '../components/StatCard'
import ProjectStatusChart from '../components/ProjectStatusChart'
import ProjectProgressDonut from '../components/ProjectProgressDonut'
import RemindersCard from '../components/RemindersCard'
import TimeTrackerCard from '../components/TimeTrackerCard'
import Chat from '../components/ChatNew'
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function ProjectPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [invites, setInvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [user, setUser] = useState(null)

  // Project link (GitHub URL) state
  const [githubURL, setGithubURL] = useState('')
  const [linkSaving, setLinkSaving] = useState(false)
  const [linkError, setLinkError] = useState('')
  const [linkSuccess, setLinkSuccess] = useState('')

  // Invite member state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteLoading, setInviteLoading] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')

  // Add Task state
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDescription, setTaskDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [taskLoading, setTaskLoading] = useState(false)
  const [taskError, setTaskError] = useState('')
  const [dueDate, setDueDate] = useState(null)

  // Derive basic task stats for header tiles and charts
  const taskStats = useMemo(() => {
    const list = project?.tasks || []
    let completed = 0, running = 0, pending = 0
    for (const t of list) {
      const s = (t.status || '').toLowerCase()
      if (s === 'done' || s === 'completed' || s === 'complete') completed++
      else if (s === 'in progress' || s === 'progress' || s === 'running') running++
      else pending++
    }
    return { total: list.length, completed, running, pending }
  }, [project])

  const loadProject = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get(`/projects/${encodeURIComponent(projectId)}`)
      // Backend now returns { project, invites }
      const nextProject = data?.project ?? data
      const nextInvites = Array.isArray(data?.invites) ? data.invites : (data?.invites?.invites || [])
      setProject(nextProject)
      setInvites(nextInvites)
      // initialize githubURL field for form
      setGithubURL(nextProject?.githubURL || '')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setError(msg || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProject()
    // also load current user for chat sender name
    fetchCurrentUser().then((u) => setUser(u))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // Update GitHub URL handler
  const handleUpdateGithub = async (e) => {
    e.preventDefault()
    setLinkError('')
    setLinkSuccess('')
    setLinkSaving(true)
    try {
      const payload = { githubURL: (githubURL || '').trim() }
      const { data } = await client.put(`/projects/${encodeURIComponent(projectId)}/github`, payload)
      const updated = data?.project || data
      // merge into local project state
      setProject((prev) => ({ ...(prev || {}), githubURL: updated?.githubURL ?? payload.githubURL }))
      setLinkSuccess('GitHub URL saved')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setLinkError(msg || 'Failed to save GitHub URL')
    } finally {
      setLinkSaving(false)
    }
  }

  // Invite member handler
  const handleInvite = async (e) => {
    e.preventDefault()
    setInviteError('')
    setInviteSuccess('')
    if (!inviteEmail.trim()) return
    setInviteLoading(true)
    try {
      // POST to invite endpoint
      const { data } = await client.post(`/projects/${encodeURIComponent(projectId)}/invite`, {
        email: inviteEmail.trim(),
      })
      // Try to merge updated members if provided, otherwise refresh project
      const updated = data?.project ?? data
      if (updated?.members) {
        setProject((prev) => ({ ...(prev || {}), members: updated.members }))
      } else if (data?.member || data?.user) {
        const newMember = data.member || data.user
        setProject((prev) => ({ ...(prev || {}), members: [...(prev?.members || []), newMember] }))
      } else {
        await loadProject()
      }
      setInviteSuccess('Invitation sent')
      setInviteEmail('')
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setInviteError(msg || 'Failed to invite member')
    } finally {
      setInviteLoading(false)
    }
  }

  // Add Task handler (title, description, assignedTo)
  const handleAddTask = async (e) => {
    e.preventDefault()
    setTaskError('')
    if (!taskTitle.trim()) {
      setTaskError('Task title is required')
      return
    }
    setTaskLoading(true)
    try {
      const payload = {
        title: taskTitle.trim(),
        description: taskDescription.trim(),
      }
      if (dueDate instanceof Date && !isNaN(dueDate)) {
        payload.dueDate = dueDate.toISOString()
      }
  if (assignedTo) payload.assignedTo = assignedTo
      const { data } = await client.post(`/projects/${encodeURIComponent(projectId)}/tasks`, payload)
      // Update local project tasks list and refresh board
      const created = data?.task || data
      setProject((prev) => ({
        ...(prev || {}),
        tasks: [created, ...((prev && prev.tasks) || [])],
      }))
      // clear form
      setTaskTitle('')
      setTaskDescription('')
  setAssignedTo('')
  setDueDate(null)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setTaskError(msg || 'Failed to create task')
    } finally {
      setTaskLoading(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 4 }}>
      <Button component={Link} to="/dashboard" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>
        Back to Dashboard
      </Button>

      {/* Project header with quick actions */}
      {project && <ProjectHeader project={project} />}

      {/* Stats row */}
      {project && (
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Total Tasks" value={taskStats.total} trend="up" subtitleAsBadge subtitle="Increased from last week" showCornerArrow={false} />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Completed" value={taskStats.completed} trend="up" subtitleAsBadge subtitle="Done" />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Running" value={taskStats.running} trend="none" subtitleAsBadge subtitle="In progress" />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <StatCard title="Pending" value={taskStats.pending} trend="down" subtitleAsBadge subtitle="Queued" />
          </Grid>
        </Grid>
      )}

      {/* Analytics + Side widgets */}
      {project && (
        <Grid container spacing={3} sx={{ mb: 2 }}>
          <Grid xs={12} md={8}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>Project Analytics</Typography>
              <Box sx={{ minHeight: 220 }}>
                <ProjectStatusChart tasks={project.tasks || []} />
              </Box>
            </Paper>
          </Grid>
          <Grid xs={12} md={4}>
            <Stack spacing={2}>
              <Paper sx={{ p: 2 }}>
                <RemindersCard />
              </Paper>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" sx={{ mb: 1 }}>Project Progress</Typography>
                <Box sx={{ height: 220 }}>
                  <ProjectProgressDonut value={Math.round((taskStats.completed / Math.max(1, taskStats.total)) * 100)} />
                </Box>
              </Paper>
              <Paper sx={{ p: 2 }}>
                <TimeTrackerCard />
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      )}

      {loading && <Typography>Loading project...</Typography>}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && project && (
        <>
          <Typography variant="h4" gutterBottom>
            {project.title || project.name || 'Untitled Project'}
          </Typography>
          {project.description && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {project.description}
            </Typography>
          )}

          <Grid container spacing={3}>
            {/* Project Link / Settings */}
            <Grid xs={12} md={6}>
              <Paper sx={{ p: 2 }} id="project-link-section">
                <Typography variant="h6" gutterBottom>Project Link</Typography>
                <form onSubmit={handleUpdateGithub}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <TextField
                      label="GitHub Repository URL"
                      placeholder="https://github.com/owner/repo"
                      value={githubURL}
                      onChange={(e) => setGithubURL(e.target.value)}
                      fullWidth
                    />
                    <Button type="submit" variant="contained" disabled={linkSaving} sx={{ flexShrink: 0 }}>
                      {linkSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </Stack>
                </form>
                {linkError && <Typography color="error" sx={{ mt: 1 }}>{linkError}</Typography>}
                {linkSuccess && <Typography color="success.main" sx={{ mt: 1 }}>{linkSuccess}</Typography>}
              </Paper>
            </Grid>
            {/* Invite Member */}
            <Grid xs={12} md={6}>
              <Paper sx={{ p: 2 }} id="invite-section">
                <Typography variant="h6" gutterBottom>Invite Member</Typography>
                <form onSubmit={handleInvite}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
                    <TextField
                      type="email"
                      placeholder="member@example.com"
                      label="Member email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      required
                      fullWidth
                    />
                    <Button type="submit" variant="contained" disabled={inviteLoading} sx={{ flexShrink: 0 }}>
                      {inviteLoading ? 'Inviting...' : 'Invite'}
                    </Button>
                  </Stack>
                </form>
                {inviteError && <Typography color="error" sx={{ mt: 1 }}>{inviteError}</Typography>}
                {inviteSuccess && <Typography color="success.main" sx={{ mt: 1 }}>{inviteSuccess}</Typography>}
              </Paper>
            </Grid>

            {/* Members and pending invites */}
            <Grid xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Members</Typography>
                <Typography variant="subtitle2" sx={{ mt: 1 }}>Accepted</Typography>
                <ul style={{ marginTop: 6 }}>
                  {(project.members || []).map((m) => (
                    <li key={m.id || m._id || m.email}>
                      {(m.username || m.name || m.email || 'user')}
                      {m.email ? ` (${m.email})` : ''}
                    </li>
                  ))}
                </ul>
                <Divider sx={{ my: 1 }} />
                <Typography variant="subtitle2">Pending invites</Typography>
                <ul style={{ marginTop: 6 }}>
                  {(invites || [])
                    .filter((inv) => (inv?.status || '').toLowerCase() === 'pending')
                    .map((inv) => (
                      <li key={inv._id || inv.id || `${inv.toUser?.email}-${inv.projectId || ''}`}>
                        {(inv.toUser?.username || inv.toUser?.name || inv.toUser?.email || 'user')}
                        {inv.toUser?.email ? ` (${inv.toUser.email})` : ''} (pending)
                      </li>
                    ))}
                </ul>
              </Paper>
            </Grid>

            {/* Tasks & Gantt */}
            <Grid xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Tasks</Typography>
                <Box sx={{ my: 2 }}>
                  <Box sx={{ overflow: 'hidden', borderRadius: 2 }}>
                    <GanttChart tasks={project.tasks || []} />
                  </Box>
                </Box>

                <Typography variant="subtitle1" sx={{ mt: 1, mb: 1 }}>Add Task</Typography>
                <form onSubmit={handleAddTask} id="add-task-section">
                  <Stack spacing={2} sx={{ maxWidth: 720 }}>
                    <TextField
                      label="Task title"
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      required
                      fullWidth
                    />
                    <TextField
                      label="Description"
                      value={taskDescription}
                      onChange={(e) => setTaskDescription(e.target.value)}
                      fullWidth
                      multiline
                      minRows={3}
                    />
                    <div>
                      <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>Due date (optional)</Typography>
                      <DatePicker
                        selected={dueDate}
                        onChange={(date) => setDueDate(date)}
                        placeholderText="Select due date"
                        dateFormat="yyyy-MM-dd"
                        isClearable
                        showPopperArrow={false}
                      />
                    </div>
                    <FormControl fullWidth>
                      <InputLabel id="assignee-label">Assign to</InputLabel>
                      <Select
                        labelId="assignee-label"
                        label="Assign to"
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                      >
                        <MenuItem value="">Unassigned</MenuItem>
                        {(project.members || []).map((m) => (
                          <MenuItem key={m._id} value={m._id}>{m.username}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    {taskError && <Typography color="error">{taskError}</Typography>}
                    <Button type="submit" variant="contained" disabled={taskLoading} sx={{ alignSelf: 'flex-start' }}>
                      {taskLoading ? 'Adding...' : 'Add Task'}
                    </Button>
                  </Stack>
                </form>

                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2 }}>
                  <KanbanBoard
                    projectId={projectId}
                    initialTasks={project.tasks || []}
                    showCreateForm={false}
                  />
                </Box>
              </Paper>
            </Grid>

            {/* Chat */}
            <Grid xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>Chat</Typography>
                <Box sx={{ pt: 1 }}>
                  <Chat
                    projectId={projectId}
                    user={user}
                    initialMessages={project.chatMessages || project.messages || []}
                  />
                </Box>
                <Button onClick={loadProject} sx={{ mt: 1 }}>Refresh Project</Button>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  )
}
