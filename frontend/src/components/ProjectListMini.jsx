import React, { useEffect, useMemo, useState } from 'react'
import { Box, Stack, Typography, Chip, Tooltip, Button, IconButton, CircularProgress } from '@mui/material'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded'
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded'
import { useNavigate } from 'react-router-dom'
import { alpha } from '@mui/material/styles'
import FolderOpenIcon from '@mui/icons-material/FolderOpen'
import client from '../api/client'
import { getSampleProjects } from '../data/sampleData'

// Fallback color palette for project dots
const palette = ['#0EA5E9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#A78BFA']

const shortDue = (str) => (typeof str === 'string' ? str.replace(/,\s*\d{4}$/, '') : str)

// Normalize arbitrary backend statuses into a label + chip color
const normalizeStatus = (raw) => {
  const s = (raw || '').toString().trim().toLowerCase()
  if (!s) return { label: '', color: 'default' }
  if (['done', 'completed', 'complete', 'finished'].includes(s)) return { label: 'Completed', color: 'success' }
  if (['in progress', 'progress', 'running', 'active', 'ongoing'].includes(s)) return { label: 'In Progress', color: 'info' }
  if (['review', 'qa', 'testing', 'approval'].includes(s)) return { label: 'Review', color: 'secondary' }
  if (['todo', 'pending', 'backlog', 'queued', 'not started'].includes(s)) return { label: 'Pending', color: 'warning' }
  // fallback: title-case the unknown status
  const label = s.replace(/\b\w/g, (c) => c.toUpperCase())
  return { label, color: 'default' }
}

export default function ProjectListMini() {
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      // In development, use sample data as primary source
      if (import.meta.env.DEV) {
        const sampleProjects = getSampleProjects()
        if (sampleProjects && sampleProjects.length > 0) {
          setProjects(sampleProjects)
          setLoading(false)
          return
        }
      }
      
      const { data } = await client.get('/api/projects')
      const list = Array.isArray(data) ? data : (data?.projects || [])
      setProjects(list.length > 0 ? list : getSampleProjects())
    } catch (err) {
      // Use sample data as fallback
      const sampleProjects = getSampleProjects()
      setProjects(sampleProjects)
      if (sampleProjects.length === 0) {
        const msg = err?.response?.data?.message || err?.response?.data?.msg || err.message
        setError(msg || 'Failed to load projects')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const displayItems = useMemo(() => {
    return projects.map((p, idx) => {
      const id = p.id || p._id || p.slug || p.name || p.title || String(idx)
      const title = p.name || p.title || 'Untitled'
      const dueRaw = p.dueDate || p.deadline || p.due || p.endDate
      let due = ''
      if (dueRaw) {
        const d = new Date(dueRaw)
        if (!isNaN(d)) {
          due = d.toLocaleString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        } else if (typeof dueRaw === 'string') {
          due = dueRaw
        }
      }
      const statusRaw = p.status || p.stage || ''
      const status = normalizeStatus(statusRaw)
      const color = p.color || palette[idx % palette.length]
      return { id, title, due, status, color, raw: p }
    })
  }, [projects])
  return (
    <Stack spacing={1.5}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
          <Typography variant="h6">Projects</Typography>
          {!loading && <Typography variant="caption" color="text.secondary">{projects.length}</Typography>}
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title="Refresh" arrow>
            <span>
              <IconButton size="small" onClick={load} disabled={loading} aria-label="Refresh projects">
                <RefreshRoundedIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
          <Button
            size="small"
            color="primary"
            endIcon={<ArrowForwardIosIcon sx={{ fontSize: 14 }} />}
            onClick={() => navigate('/projects')}
            sx={{
              textTransform: 'none',
              borderRadius: 999,
              px: 1,
              '& .MuiButton-endIcon': { transition: 'transform 120ms ease' },
              '&:hover': { bgcolor: 'action.hover' },
              '&:hover .MuiButton-endIcon': { transform: 'translateX(2px)' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
            }}
          >
            View all
          </Button>
        </Box>
      </Box>
      <Stack spacing={0.25}>
        {loading && (
          <Typography variant="body2" color="text.secondary" sx={{ py: 1.5 }}>Loading projects…</Typography>
        )}
        {!loading && error && (
          <Typography variant="body2" color="error" sx={{ py: 1.5 }}>{error}</Typography>
        )}
        {!loading && !error && projects.length === 0 && (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            py: 4,
            px: 2,
            color: 'text.secondary',
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
            borderRadius: 2,
          }}>
            <FolderOpenIcon sx={{ fontSize: 28, mb: 1, color: 'text.disabled' }} />
            <Typography variant="body2" sx={{ mb: 1 }}>No projects yet</Typography>
            <Button size="small" variant="outlined" onClick={() => navigate('/projects')} sx={{ borderRadius: 999 }}>
              Create one
            </Button>
          </Box>
        )}
        {displayItems.slice(0, 5).map((p, idx) => (
          <Box
            key={p.id}
            sx={(theme) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 0.75,
              borderRadius: 2,
              transition: 'background-color 0.15s ease',
              bgcolor: idx % 2 === 1 ? alpha(theme.palette.text.primary, 0.03) : 'transparent',
              cursor: 'pointer',
              '&:hover': { bgcolor: theme.palette.action.hover },
              '&:hover .row-hover-icon': { opacity: 1, transform: 'translateX(0)' },
              '&:hover .delete-hover-icon': { opacity: 1, transform: 'scale(1)' },
              '&:focus-visible': { outline: '2px solid', outlineColor: 'primary.main' },
            })}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/projects/${encodeURIComponent(p.id)}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                navigate(`/projects/${encodeURIComponent(p.id)}`)
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, minWidth: 0 }}>
              <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: p.color, display: 'inline-block', flex: '0 0 auto' }} />
              <Tooltip title={p.title} arrow>
                <Typography variant="body2" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {p.title}
                </Typography>
              </Tooltip>
              {/* Delete icon always visible on hover; optimistic removal */}
              <Tooltip title="Delete" arrow>
                <span>
                  <IconButton
                    size="small"
                    color="error"
                    className="delete-hover-icon"
                    sx={{ ml: 0.25, opacity: 0, transform: 'scale(0.6)', transition: 'opacity 120ms ease, transform 120ms ease' }}
                    disabled={deletingIds.has(p.id)}
                    onClick={async (e) => {
                      e.stopPropagation()
                        const title = p.name || p.title || 'Untitled'
                        const ok = window.confirm(`Delete project ${title}? This cannot be undone.`)
                      if (!ok) return
                      const pid = p.id
                      const prev = projects
                      setDeletingIds((set) => new Set(set).add(pid))
                      setProjects((list) => list.filter((x) => (x.id || x._id || x.slug || x.name || x.title) !== pid))
                      try {
                        await client.delete(`/projects/${encodeURIComponent(pid)}`)
                      } catch (err) {
                        // rollback
                        setProjects(prev)
                        console.error('Delete failed', err)
                      } finally {
                        setDeletingIds((set) => { const next = new Set(set); next.delete(pid); return next })
                      }
                    }}
                    aria-label={`Delete ${p.title}`}
                  >
                    {deletingIds.has(p.id) ? <CircularProgress size={14} /> : <DeleteOutlineRoundedIcon fontSize="inherit" />}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', flexShrink: 0 }}>
              {p.status?.label && (
                <Chip
                  size="small"
                  variant="outlined"
                  color={p.status.color}
                  label={p.status.label}
                  sx={{
                    height: 20,
                    '& .MuiChip-label': { px: 0.75, py: 0, fontSize: 10.5, fontWeight: 500 },
                  }}
                />
              )}
              {p.due && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarMonthIcon sx={{ fontSize: 15 }} />
                  <Tooltip title={p.due} arrow>
                    <Typography variant="caption">{shortDue(p.due)}</Typography>
                  </Tooltip>
                </Box>
              )}
              <ChevronRightRoundedIcon
                className="row-hover-icon"
                sx={{ fontSize: 16, ml: 0.25, opacity: 0, transform: 'translateX(-2px)', transition: 'opacity 120ms ease, transform 120ms ease' }}
              />
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  )
}
