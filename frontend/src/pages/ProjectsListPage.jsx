import React, { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import client, { fetchCurrentUser } from '../api/client'
import { getSampleProjects } from '../data/sampleData'
import {
  Box,
  Typography,
  Button,
  TextField,
  Stack,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  CircularProgress,
  Divider,
  Chip,
  Card,
  CardContent,
  CardActions,
  ButtonGroup,
  Grid
} from '@mui/material'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'

// Minimalist design: flat surfaces, subtle dividers, list rows instead of cards.
export default function ProjectsListPage() {
  const [projects, setProjects] = useState([])
  const [projectsLoading, setProjectsLoading] = useState(true)
  const [projectsError, setProjectsError] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState('')
  const [currentUser, setCurrentUser] = useState(null)
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [viewMode, setViewMode] = useState('list') // 'list' | 'cards'

  const loadProjects = async () => {
    setProjectsLoading(true)
    setProjectsError('')
    try {
      // In development, use sample data as primary source
      if (import.meta.env.DEV) {
        const sampleProjects = getSampleProjects()
        if (sampleProjects && sampleProjects.length > 0) {
          setProjects(sampleProjects)
          setProjectsLoading(false)
          return
        }
      }
      
      const { data } = await client.get('/api/projects')
      const list = Array.isArray(data) ? data : (data?.projects || [])
      // If no real projects, use sample data
      if (!list || list.length === 0) {
        const sampleProjects = getSampleProjects()
        setProjects(sampleProjects)
      } else {
        setProjects(list)
      }
    } catch (err) {
      // Use sample data as fallback when API is unavailable
      const sampleProjects = getSampleProjects()
      setProjects(sampleProjects)
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      if (sampleProjects.length === 0) {
        setProjectsError(msg || 'Failed to load projects')
      }
    } finally {
      setProjectsLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
    fetchCurrentUser().then((u) => setCurrentUser(u))
  }, [])

  const canDelete = useMemo(() => {
    const userId = currentUser?._id || currentUser?.id
    const isAdmin = (currentUser?.role || '').toLowerCase() === 'admin'
    return (project) => {
      if (!currentUser) return false
      if (isAdmin) return true
      const ownerId = project?.owner?._id || project?.owner?.id || project?.createdBy?._id || project?.createdBy?.id || project?.user?._id || project?.user?.id
      return ownerId && userId && ownerId === userId
    }
  }, [currentUser])

  const handleSnackClose = (_, reason) => {
    if (reason === 'clickaway') return
    setSnack((s) => ({ ...s, open: false }))
  }

  const handleDelete = async (pid, title) => {
    const canProj = projects.find(p => (p.id || p._id || p.slug || p.name || p.title) === pid)
    if (!canProj || !canDelete(canProj)) return
    const ok = window.confirm(`Delete project "${title}"? This cannot be undone.`)
    if (!ok) return
    const prev = projects
    setDeletingIds((set) => new Set(set).add(pid))
    setProjects((list) => list.filter((x) => (x.id || x._id || x.slug || x.name || x.title) !== pid))
    try {
      await client.delete(`/projects/${encodeURIComponent(pid)}`)
      setSnack({ open: true, severity: 'success', msg: 'Project deleted' })
    } catch (err) {
      setProjects(prev)
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setSnack({ open: true, severity: 'error', msg: msg || 'Failed to delete' })
    } finally {
      setDeletingIds((set) => { const next = new Set(set); next.delete(pid); return next })
    }
  }

  const renderListView = () => (
    <Box className="soft-card" sx={{ borderRadius: 3, overflow: 'hidden', boxShadow: 'none' }}>
      {projects.map((p, idx) => {
        const pid = p.id || p._id || p.slug || p.name || p.title
        const title = p.name || p.title || 'Untitled'
        const desc = p.description || ''
        const members = Array.isArray(p.members)
          ? p.members
          : (Array.isArray(p.collaborators) ? p.collaborators : (Array.isArray(p.users) ? p.users : []))
        const names = members.map((m) => m?.username || m?.name || m?.email).filter(Boolean)
        const deleting = deletingIds.has(pid)
        return (
          <Box key={pid} sx={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 1.5, p: 1.5, backgroundColor: '#fff', '&:hover': { bgcolor: '#f9f9fe' }, transition: 'all .15s ease' }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="subtitle2" fontWeight={600} noWrap>{title}</Typography>
              {desc && (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{desc}</Typography>
              )}
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                {names.length > 0 ? `${names.slice(0,2).join(', ')}${names.length > 2 ? ` +${names.length-2}` : ''}` : 'No collaborators'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
              <Button size="small" component={Link} to={`/projects/${encodeURIComponent(pid)}`} variant="outlined" sx={{ borderRadius: 2 }}>Open</Button>
              <Tooltip title={canDelete(p) ? 'Delete project' : 'No permission'}>
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={deleting || !canDelete(p)}
                    onClick={() => handleDelete(pid, title)}
                  >
                    {deleting ? <CircularProgress size={16} /> : <DeleteOutlineRoundedIcon fontSize="small" />}
                  </IconButton>
                </span>
              </Tooltip>
            </Stack>
            {idx < projects.length - 1 && <Divider sx={{ position: 'absolute', left: 0, right: 0, bottom: 0 }} />}
          </Box>
        )
      })}
    </Box>
  )

  const renderCardView = () => (
    <Grid container spacing={2}>
      {projects.map((p) => {
        const pid = p.id || p._id || p.slug || p.name || p.title
        const title = p.name || p.title || 'Untitled'
        const desc = p.description || ''
        const members = Array.isArray(p.members)
          ? p.members
          : (Array.isArray(p.collaborators) ? p.collaborators : (Array.isArray(p.users) ? p.users : []))
        const names = members.map((m) => m?.username || m?.name || m?.email).filter(Boolean)
        const deleting = deletingIds.has(pid)
        return (
          <Grid xs={12} sm={6} md={4} lg={3} key={pid}>
            <Card className="soft-card" variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, boxShadow: 'none' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.5 }}>
                  <Typography variant="h6" component="div" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
                    {title}
                  </Typography>
                  <Tooltip title={canDelete(p) ? 'Delete project' : 'No permission'} arrow>
                    <span>
                      <IconButton
                        size="small"
                        color="error"
                        disabled={deleting || !canDelete(p)}
                        onClick={() => handleDelete(pid, title)}
                        aria-label={`Delete ${title}`}
                      >
                        {deleting ? <CircularProgress size={16} /> : <DeleteOutlineRoundedIcon fontSize="small" />}
                      </IconButton>
                    </span>
                  </Tooltip>
                </Stack>
                {desc && (
                  <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {desc}
                  </Typography>
                )}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1.25 }}>
                  {names.length > 0
                    ? `Collaborators: ${names.slice(0, 3).join(', ')}${names.length > 3 ? ` +${names.length - 3} more` : ''}`
                    : 'No collaborators yet'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" component={Link} to={`/projects/${encodeURIComponent(pid)}`} sx={{ fontWeight: 600 }}>Open</Button>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
    </Grid>
  )

  return (
    <Box sx={{ maxWidth: 960, mx: 'auto', pt: 3, pb: 6 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>Projects</Typography>
        <Typography variant="body2" color="text.secondary">Create and manage your projects collaboratively.</Typography>
      </Box>

      {/* ============ SECTION: CREATE PROJECT ============ */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
          Create New Project
        </Typography>

        {/* Create Project Form */}
        <Box component="form"
          onSubmit={async (e) => {
            e.preventDefault()
            setCreateError('')
            if (!name.trim()) { setCreateError('Project name is required'); return }
            setCreating(true)
              const payload = { name: name.trim(), title: name.trim(), description: description.trim() }
            try {
              const { data } = await client.post('/api/projects', payload)
              const created = data?.project || data
              setProjects((prev) => [created, ...prev])
              setName('')
              setDescription('')
            } catch (err) {
              const status = err?.response?.status
              const server = err?.response?.data
              const serverMsg = (server && (server.message || server.msg || JSON.stringify(server)))
              const msg = serverMsg || err.message
              setCreateError(`${msg}${status ? ` (status ${status})` : ''}`)
            } finally { setCreating(false) }
          }}
          className="soft-card"
          sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.5, alignItems: 'stretch', p: 2.5, borderRadius: 3, boxShadow: 'none' }}
        >
        <TextField
          placeholder="Project name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          size="small"
          sx={{ flex: 2 }}
        />
        <TextField
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          size="small"
          multiline
          minRows={1}
          sx={{ flex: 3 }}
        />
        <Button type="submit" variant="contained" disabled={creating} sx={{ flexShrink: 0, minWidth: 140, borderRadius: 2 }}>
          {creating ? 'Creating…' : 'Create'}
        </Button>
        {createError && (
          <Typography variant="caption" color="error" sx={{ flexBasis: '100%' }}>{createError}</Typography>
        )}
      </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* ============ SECTION: MY PROJECTS ============ */}
      <Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
            My Projects
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 1, justifyContent: 'space-between' }}>
          <Chip size="small" label={`${projects.length} projects`} variant="outlined" />
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button size="small" variant="text" onClick={loadProjects} disabled={projectsLoading}>Refresh</Button>
            <ButtonGroup size="small" variant="outlined">
              <Button onClick={() => setViewMode('list')} disabled={viewMode === 'list'}>List</Button>
              <Button onClick={() => setViewMode('cards')} disabled={viewMode === 'cards'}>Cards</Button>
            </ButtonGroup>
          </Box>
        </Box>
        {projectsLoading && <Typography variant="body2">Loading…</Typography>}
        {projectsError && <Typography variant="body2" color="error">{projectsError}</Typography>}
        {!projectsLoading && !projectsError && projects.length === 0 && (
          <Typography variant="body2" color="text.secondary">No projects yet. Create one above.</Typography>
        )}
        {!projectsLoading && !projectsError && projects.length > 0 && (
          viewMode === 'list' ? renderListView() : renderCardView()
        )}
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={handleSnackClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackClose} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
