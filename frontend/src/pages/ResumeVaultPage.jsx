import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import client from '../api/client'
import { getSampleResumes } from '../data/sampleData'
import ResumeCard from '../components/ResumeCard'
import { Box, Typography, TextField, Button, Stack, Snackbar, Alert, Link as MuiLink, Divider, Paper, Chip, IconButton, Fade, Select, MenuItem, FormControl, InputLabel, ToggleButtonGroup, ToggleButton, Menu, ListItemIcon, ListItemText } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import ArticleIcon from '@mui/icons-material/Article'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DownloadIcon from '@mui/icons-material/Download'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import MoreVertIcon from '@mui/icons-material/MoreVert'

export default function ResumeVaultPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [company, setCompany] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('pending')
  const [resumeFile, setResumeFile] = useState(null)
  const [cvFile, setCvFile] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [snack, setSnack] = useState({ open: false, severity: 'success', msg: '' })
  const [errors, setErrors] = useState({})
  const [filterStatus, setFilterStatus] = useState('all')
  const [menuAnchor, setMenuAnchor] = useState(null)
  const [selectedItemId, setSelectedItemId] = useState(null)

  const loadItems = async () => {
    try {
      // In development, use sample data as primary source
      if (import.meta.env.DEV) {
        const sampleResumes = getSampleResumes()
        if (sampleResumes && sampleResumes.length > 0) {
          setItems(sampleResumes)
          return
        }
      }
      
      const { data } = await client.get('/resumes')
      const list = Array.isArray(data) ? data : (data?.resumes || [])
      // If no real resumes, use sample data
      if (!list || list.length === 0) {
        const sampleResumes = getSampleResumes()
        setItems(sampleResumes)
      } else {
        setItems(list)
      }
    } catch {
      // Use sample data as fallback
      try {
        const sampleData = getSampleResumes()
        setItems(sampleData)
      } catch {
        setItems([])
      }
    }
  }

  useEffect(() => { loadItems() }, [])

  const saveLocal = (entry) => {
    try {
      const raw = localStorage.getItem('resume_vault')
      const prev = raw ? JSON.parse(raw) : []
      const next = [entry, ...prev]
      localStorage.setItem('resume_vault', JSON.stringify(next))
      setItems(next)
    } catch {
      // Ignore storage errors
    }
  }

  const validateFile = (file) => {
    if (!file) return null
    const okType = ['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type) || /\.(pdf|doc|docx)$/i.test(file.name)
    if (!okType) return 'Only PDF, DOC, DOCX allowed'
    const maxBytes = 10 * 1024 * 1024
    if (file.size > maxBytes) return 'File must be ≤ 10 MB'
    return null
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!company.trim()) nextErrors.company = 'Company is required'
    if (!jobRole.trim()) nextErrors.jobRole = 'Job role is required'
    if (jobUrl && !/^https?:\/\//i.test(jobUrl.trim())) nextErrors.jobUrl = 'Enter a valid URL (http/https)'
    if (!resumeFile) nextErrors.resumeFile = 'Select a resume file'
    const resumeErr = validateFile(resumeFile)
    if (resumeErr) nextErrors.resumeFile = resumeErr
    const cvErr = validateFile(cvFile)
    if (cvErr) nextErrors.cvFile = cvErr
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) { setSnack({ open: true, severity: 'error', msg: 'Please fix the form errors' }); return }
    setSubmitting(true)
    try {
      const fd = new FormData()
      fd.append('company', company.trim())
      fd.append('jobRole', jobRole.trim())
      fd.append('status', status)
      if (jobUrl) fd.append('jobUrl', jobUrl.trim())
      if (jobDescription) fd.append('jobDescription', jobDescription.trim())
      if (notes) fd.append('notes', notes.trim())
      fd.append('resume', resumeFile)
      if (cvFile) fd.append('cv', cvFile)
      const { data } = await client.post('/resumes', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      const created = data?.resume || data
      setItems((prev) => [created, ...prev])
      setCompany('')
      setJobRole('')
      // Don't reset status - keep user's selection
      setJobUrl('')
      setJobDescription('')
      setNotes('')
      setResumeFile(null)
      setCvFile(null)
      setSnack({ open: true, severity: 'success', msg: 'Resume uploaded' })
    } catch {
      // Fallback: store minimal entry locally
      const entry = {
        id: Date.now().toString(),
        company: company.trim(),
        jobRole: jobRole.trim(),
        status: status,
        jobUrl: jobUrl.trim(),
        jobDescription: jobDescription.trim(),
        notes: notes.trim(),
        resumeFilename: resumeFile?.name || 'resume.pdf',
        cvFilename: cvFile?.name || null,
        createdAt: new Date().toISOString(),
      }
      saveLocal(entry)
      setCompany('')
      setJobRole('')
      // Don't reset status - keep user's selection
      setJobUrl('')
      setJobDescription('')
      setNotes('')
      setResumeFile(null)
      setCvFile(null)
      setSnack({ open: true, severity: 'warning', msg: 'Saved locally (API not available)' })
    } finally {
      setSubmitting(false)
    }
  }

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this entry?')
    if (!ok) return
    const prev = items
    setItems((list) => list.filter((x) => (x.id || x._id) !== id))
    try {
      await client.delete(`/resumes/${encodeURIComponent(id)}`)
      setSnack({ open: true, severity: 'success', msg: 'Deleted' })
    } catch {
      // local delete
      try {
        const raw = localStorage.getItem('resume_vault')
        const arr = raw ? JSON.parse(raw) : []
        const next = arr.filter((x) => (x.id || x._id) !== id)
        localStorage.setItem('resume_vault', JSON.stringify(next))
      } catch {
        // Ignore storage errors
      }
      setSnack({ open: true, severity: 'info', msg: 'Deleted locally' })
      setItems(prev)
    }
  }

  const handleSnackClose = (_, reason) => { if (reason === 'clickaway') return; setSnack((s) => ({ ...s, open: false })) }

  const updateStatus = async (id, newStatus) => {
    const prev = items
    // Optimistic update
    setItems((list) => list.map((x) => (x.id || x._id) === id ? { ...x, status: newStatus } : x))
    try {
      await client.patch(`/resumes/${encodeURIComponent(id)}`, { status: newStatus })
      setSnack({ open: true, severity: 'success', msg: `Status updated to ${newStatus}` })
    } catch {
      // Rollback on error
      setItems(prev)
      // Update local storage fallback
      try {
        const raw = localStorage.getItem('resume_vault')
        const arr = raw ? JSON.parse(raw) : []
        const updated = arr.map((x) => (x.id || x._id) === id ? { ...x, status: newStatus } : x)
        localStorage.setItem('resume_vault', JSON.stringify(updated))
        setItems(updated)
        setSnack({ open: true, severity: 'info', msg: `Status updated locally to ${newStatus}` })
      } catch {
        setSnack({ open: true, severity: 'error', msg: 'Failed to update status' })
      }
    }
  }

  const filteredItems = useMemo(() => {
    if (filterStatus === 'all') return items
    return items.filter(item => (item.status || 'pending') === filterStatus)
  }, [items, filterStatus])

  const statusColors = {
    pending: { color: 'warning', icon: HourglassEmptyIcon, label: 'Pending' },
    selected: { color: 'success', icon: CheckCircleIcon, label: 'Selected' },
    rejected: { color: 'error', icon: CancelIcon, label: 'Rejected' },
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', pt: 4, pb: 8, px: { xs: 2, sm: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 5, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Resume Vault
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Upload your resumes and CVs, track job applications, and keep everything organized in one place.
        </Typography>
      </Box>

      {/* Upload Form Card */}
      <Paper 
        elevation={0}
        component="form" 
        onSubmit={onSubmit} 
        sx={{ 
          p: 4, 
          mb: 5, 
          borderRadius: 3, 
          border: '1px solid', 
          borderColor: 'divider',
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.6))',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            borderColor: 'primary.main',
          }
        }}
      >
        <Stack spacing={3}>
          {/* Row 1: Company, Role, Status, Link */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField 
              label="Company" 
              value={company} 
              onChange={(e)=>setCompany(e.target.value)} 
              required 
              size="small" 
              sx={{ flex: 1 }} 
              error={Boolean(errors.company)} 
              helperText={errors.company || ''}
              InputProps={{
                startAdornment: <BusinessIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            <TextField 
              label="Job Role" 
              value={jobRole} 
              onChange={(e)=>setJobRole(e.target.value)} 
              required 
              size="small" 
              sx={{ flex: 1 }} 
              error={Boolean(errors.jobRole)} 
              helperText={errors.jobRole || ''}
              InputProps={{
                startAdornment: <WorkIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
            <FormControl size="small" sx={{ flex: 1 }}>
              <InputLabel>Status</InputLabel>
              <Select value={status} onChange={(e)=>setStatus(e.target.value)} label="Status">
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="selected">Selected</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <TextField 
              label="Job Link (optional)" 
              value={jobUrl} 
              onChange={(e)=>setJobUrl(e.target.value)} 
              size="small" 
              sx={{ flex: 1.5 }} 
              error={Boolean(errors.jobUrl)} 
              helperText={errors.jobUrl || ''}
              InputProps={{
                startAdornment: <LinkIcon fontSize="small" sx={{ mr: 1, color: 'action.active' }} />
              }}
            />
          </Stack>

          {/* Row 2: Job Description and Notes */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
            <TextField 
              label="Job Description (optional)" 
              value={jobDescription} 
              onChange={(e)=>setJobDescription(e.target.value)} 
              size="small" 
              multiline
              minRows={3}
              sx={{ flex: 1 }} 
              placeholder="Paste the job description here..."
            />
            <TextField 
              label="Notes (optional)" 
              value={notes} 
              onChange={(e)=>setNotes(e.target.value)} 
              size="small" 
              multiline
              minRows={3}
              sx={{ flex: 1 }} 
              placeholder="Add personal notes, interview details, etc."
            />
          </Stack>

          <Divider />

          {/* Row 3: File uploads */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
            <Box sx={{ flex: 1, width: '100%' }}>
              <Button 
                component="label" 
                variant="outlined" 
                fullWidth 
                color={errors.resumeFile ? 'error' : 'primary'}
                startIcon={<DescriptionIcon />}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  borderStyle: 'dashed',
                  '&:hover': { borderStyle: 'solid' }
                }}
              >
                {resumeFile ? (resumeFile.name.length > 28 ? resumeFile.name.slice(0,25) + '…' : resumeFile.name) : 'Upload Resume *'}
                <input type="file" accept="application/pdf,.doc,.docx" hidden onChange={(e)=>setResumeFile(e.target.files?.[0] || null)} />
              </Button>
              {errors.resumeFile && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1 }}>{errors.resumeFile}</Typography>}
            </Box>
            <Box sx={{ flex: 1, width: '100%' }}>
              <Button 
                component="label" 
                variant="outlined" 
                fullWidth 
                color={errors.cvFile ? 'error' : 'secondary'}
                startIcon={<ArticleIcon />}
                sx={{ 
                  py: 1.5, 
                  borderRadius: 2,
                  textTransform: 'none',
                  justifyContent: 'flex-start',
                  borderStyle: 'dashed',
                  '&:hover': { borderStyle: 'solid' }
                }}
              >
                {cvFile ? (cvFile.name.length > 28 ? cvFile.name.slice(0,25) + '…' : cvFile.name) : 'Upload CV (optional)'}
                <input type="file" accept="application/pdf,.doc,.docx" hidden onChange={(e)=>setCvFile(e.target.files?.[0] || null)} />
              </Button>
              {errors.cvFile && <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5, ml: 1 }}>{errors.cvFile}</Typography>}
            </Box>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={submitting} 
              startIcon={<UploadFileIcon />}
              sx={{ 
                flexShrink: 0, 
                minWidth: { xs: '100%', sm: 160 }, 
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
                '&:hover': { boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)' }
              }}
            >
              {submitting ? 'Uploading…' : 'Upload'}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* List Section */}
      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>My Applications</Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <ToggleButtonGroup 
              size="small" 
              value={filterStatus} 
              exclusive 
              onChange={(e, val) => { if (val !== null) setFilterStatus(val) }}
              sx={{ '& .MuiToggleButton-root': { textTransform: 'none', px: 2 } }}
            >
              <ToggleButton value="all">All ({items.length})</ToggleButton>
              <ToggleButton value="pending">Pending ({items.filter(i => (i.status || 'pending') === 'pending').length})</ToggleButton>
              <ToggleButton value="selected">Selected ({items.filter(i => i.status === 'selected').length})</ToggleButton>
              <ToggleButton value="rejected">Rejected ({items.filter(i => i.status === 'rejected').length})</ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
        
        {filteredItems.length === 0 && items.length === 0 ? (
          <Paper elevation={0} sx={{ p: 6, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
            <UploadFileIcon sx={{ fontSize: 56, color: 'action.disabled', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">No applications yet.</Typography>
            <Typography variant="caption" color="text.secondary">Upload your first resume above to get started.</Typography>
          </Paper>
        ) : filteredItems.length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px dashed', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">No applications with this status.</Typography>
          </Paper>
        ) : (
          <Stack spacing={2}>
            {filteredItems.map((item, idx) => (
              <Fade in key={item.id || item._id || idx} timeout={300 + idx * 50}>
                <div onClick={() => navigate(`/resumes/${item.id || item._id}`)} style={{ cursor: 'pointer' }}>
                  <ResumeCard
                    item={item}
                    onEdit={(itm) => navigate(`/resumes/${itm.id || itm._id}`)}
                    onDelete={onDelete}
                    onStatusChange={(id, status) => updateStatus(id, status)}
                  />
                </div>
              </Fade>
            ))}
          </Stack>
        )}
        
        {/* Status Update Menu - shared for all cards */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={()=>{ setMenuAnchor(null); setSelectedItemId(null) }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={()=>{ if(selectedItemId) updateStatus(selectedItemId, 'pending'); setMenuAnchor(null) }} disabled={items.find(i => (i.id || i._id) === selectedItemId)?.status === 'pending'}>
            <ListItemIcon><HourglassEmptyIcon fontSize="small" color="warning" /></ListItemIcon>
            <ListItemText>Mark as Pending</ListItemText>
          </MenuItem>
          <MenuItem onClick={()=>{ if(selectedItemId) updateStatus(selectedItemId, 'selected'); setMenuAnchor(null) }} disabled={items.find(i => (i.id || i._id) === selectedItemId)?.status === 'selected'}>
            <ListItemIcon><CheckCircleIcon fontSize="small" color="success" /></ListItemIcon>
            <ListItemText>Mark as Selected</ListItemText>
          </MenuItem>
          <MenuItem onClick={()=>{ if(selectedItemId) updateStatus(selectedItemId, 'rejected'); setMenuAnchor(null) }} disabled={items.find(i => (i.id || i._id) === selectedItemId)?.status === 'rejected'}>
            <ListItemIcon><CancelIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>Mark as Rejected</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem onClick={()=>{ if(selectedItemId) onDelete(selectedItemId); setMenuAnchor(null) }} sx={{ color: 'error.main' }}>
            <ListItemIcon><DeleteOutlineIcon fontSize="small" color="error" /></ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={4000} onClose={handleSnackClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert onClose={handleSnackClose} severity={snack.severity} variant="filled" sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  )
}
