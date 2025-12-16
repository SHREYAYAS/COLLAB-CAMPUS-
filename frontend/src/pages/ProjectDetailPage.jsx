import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import client from '../api/client'
import { Box, Typography, Chip, Divider, Button, Skeleton, Stack } from '@mui/material'

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get(`/projects/${encodeURIComponent(projectId)}`)
      const next = data?.project ?? data
      setProject(next)
    } catch (err) {
      const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
      setError(msg || 'Failed to load project')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { 
    load() 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId])

  // const status = (project?.status || project?.stage || '').toString()

  return (
    <Box sx={{ p: 3, maxWidth: 960, mx: 'auto', pb: 6 }}>
      <Button component={Link} to="/projects" size="small" sx={{ mb: 3, fontWeight: 600 }}>← Back to Projects</Button>
      {loading && (
        <Stack spacing={1} sx={{ maxWidth: 520 }}>
          <Skeleton variant="text" height={48} />
          <Skeleton variant="text" height={24} width="60%" />
          <Skeleton variant="rectangular" height={120} />
        </Stack>
      )}
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {!loading && !error && project && (
        <>
          {/* ============ SECTION: PROJECT INFO ============ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#6b76ff', borderRadius: 999 }} />
              Project Information
            </Typography>
            <Box className="soft-card" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none' }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {project.name || project.title || 'Untitled Project'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                {project.status && <Chip size="small" label={project.status} sx={{ fontWeight: 600 }} />}
                {project.owner && (
                  <Chip size="small" variant="outlined" label={`Owner: ${project.owner.username || project.owner.name || project.owner.email || 'User'}`} />
                )}
              </Stack>
              {project.description && (
                <Typography variant="body1" sx={{ maxWidth: 720 }} color="text.secondary">
                  {project.description}
                </Typography>
              )}
            </Box>
          </Box>

          {/* ============ SECTION: TEAM MEMBERS ============ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#a66bff', borderRadius: 999 }} />
              Team Members
            </Typography>
            <Box className="soft-card" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none' }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {(project.members || []).map((m) => (
                  <Chip key={m._id || m.id || m.email} size="small" label={m.username || m.name || m.email || 'user'} variant="outlined" />
                ))}
                {(!project.members || project.members.length === 0) && <Typography variant="body2" color="text.secondary">No members yet.</Typography>}
              </Box>
            </Box>
          </Box>

          {/* ============ SECTION: TASKS ============ */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 4, height: 24, bgcolor: '#85e88a', borderRadius: 999 }} />
              Project Tasks
            </Typography>
            <Box className="soft-card" sx={{ p: 2.5, borderRadius: 3, boxShadow: 'none' }}>
              <Stack spacing={1}>
                {(project.tasks || []).slice(0, 10).map((t) => (
                  <Box key={t._id || t.id} sx={{ p: 1.5, borderRadius: 2, border: '1px solid #e9ecf3', bgcolor: '#f9f9fe' }}>
                    <Typography variant="subtitle2" fontWeight={700}>{t.title || 'Untitled task'}</Typography>
                    {t.status && <Chip size="small" label={t.status} sx={{ mt: 0.5 }} />}
                  </Box>
                ))}
                {(!project.tasks || project.tasks.length === 0) && <Typography variant="body2" color="text.secondary">No tasks yet.</Typography>}
              </Stack>
            </Box>
          </Box>
          <Button onClick={load} size="small" sx={{ fontWeight: 600 }}>Refresh Details</Button>
        </>
      )}
    </Box>
  )
}
