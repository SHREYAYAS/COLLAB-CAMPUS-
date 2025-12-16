import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Box, Typography, Paper, Stack, Chip, Button, TextField, Divider,
  IconButton, Link as MuiLink, CircularProgress, Alert, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import LinkIcon from '@mui/icons-material/Link'
import DescriptionIcon from '@mui/icons-material/Description'
import ArticleIcon from '@mui/icons-material/Article'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PendingIcon from '@mui/icons-material/Pending'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import NotesIcon from '@mui/icons-material/Notes'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import ThumbDownIcon from '@mui/icons-material/ThumbDown'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import DeleteIcon from '@mui/icons-material/Delete'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import client from '../api/client'

const statusColors = {
  pending: { label: 'Pending', color: 'warning', icon: PendingIcon },
  selected: { label: 'Selected', color: 'success', icon: CheckCircleIcon },
  rejected: { label: 'Rejected', color: 'error', icon: CancelOutlinedIcon },
}

export default function ResumeDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [loading, setLoading] = useState(true)
  const [item, setItem] = useState(null)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Editable fields
  const [company, setCompany] = useState('')
  const [jobRole, setJobRole] = useState('')
  const [jobUrl, setJobUrl] = useState('')
  const [status, setStatus] = useState('pending')
  const [jobDescription, setJobDescription] = useState('')
  const [notes, setNotes] = useState('')
  const [selectionReasons, setSelectionReasons] = useState('')
  const [rejectionReasons, setRejectionReasons] = useState('')
  const [offerFiles, setOfferFiles] = useState([])
  const [newOfferFiles, setNewOfferFiles] = useState([])

  useEffect(() => {
    loadItem()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const loadItem = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get(`/resumes/${id}`)
      const resume = data?.resume || data
      setItem(resume)
      populateFields(resume)
    } catch {
      // Try local storage
      try {
        const raw = localStorage.getItem('resume_vault')
        const list = raw ? JSON.parse(raw) : []
        const found = list.find(r => (r.id || r._id) === id)
        if (found) {
          setItem(found)
          populateFields(found)
        } else {
          setError('Resume application not found')
        }
      } catch {
        setError('Failed to load resume application')
      }
    } finally {
      setLoading(false)
    }
  }

  const populateFields = (resume) => {
    setCompany(resume.company || '')
    setJobRole(resume.jobRole || resume.role || '')
    setJobUrl(resume.jobUrl || resume.url || resume.link || '')
    setStatus(resume.status || 'pending')
    setJobDescription(resume.jobDescription || resume.description || '')
    setNotes(resume.notes || '')
    setSelectionReasons(resume.selectionReasons || '')
    setRejectionReasons(resume.rejectionReasons || '')
    setOfferFiles(resume.offerFiles || [])
    setNewOfferFiles([])
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Upload new offer files first if any
      if (newOfferFiles.length > 0) {
        const fd = new FormData()
        newOfferFiles.forEach(file => fd.append('offerFiles', file))
        await client.post(`/resumes/${id}/offer-files`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      }

      const payload = {
        company: company.trim(),
        jobRole: jobRole.trim(),
        jobUrl: jobUrl.trim(),
        status,
        jobDescription: jobDescription.trim(),
        notes: notes.trim(),
        selectionReasons: selectionReasons.trim(),
        rejectionReasons: rejectionReasons.trim(),
      }
      
      const { data } = await client.patch(`/resumes/${id}`, payload)
      const updated = data?.resume || data
      setItem(updated)
      populateFields(updated)
      setEditing(false)
    } catch {
      // Update local storage
      const payload = {
        company: company.trim(),
        jobRole: jobRole.trim(),
        jobUrl: jobUrl.trim(),
        status,
        jobDescription: jobDescription.trim(),
        notes: notes.trim(),
        selectionReasons: selectionReasons.trim(),
        rejectionReasons: rejectionReasons.trim(),
      }
      try {
        const raw = localStorage.getItem('resume_vault')
        const list = raw ? JSON.parse(raw) : []
        const idx = list.findIndex(r => (r.id || r._id) === id)
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...payload, offerFiles: [...(list[idx].offerFiles || []), ...newOfferFiles.map(f => ({ name: f.name }))] }
          localStorage.setItem('resume_vault', JSON.stringify(list))
          setItem(list[idx])
          populateFields(list[idx])
          setEditing(false)
        }
      } catch {
        alert('Failed to save changes')
      }
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    if (item) populateFields(item)
    setEditing(false)
  }

  const handleRemoveOfferFile = async (fileId) => {
    const ok = window.confirm('Delete this file?')
    if (!ok) return
    try {
      await client.delete(`/resumes/${id}/offer-files/${fileId}`)
      const updatedFiles = offerFiles.filter(f => f._id !== fileId && f.id !== fileId)
      setOfferFiles(updatedFiles)
      setItem(prev => ({ ...prev, offerFiles: updatedFiles }))
    } catch {
      alert('Failed to delete file')
    }
  }

  const handleAddOfferFile = (e) => {
    const files = Array.from(e.target.files || [])
    setNewOfferFiles(prev => [...prev, ...files])
  }

  const handleRemoveNewOfferFile = (idx) => {
    setNewOfferFiles(prev => prev.filter((_, i) => i !== idx))
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error || !item) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>{error || 'Resume not found'}</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/resumes')}>
          Back to Resume Vault
        </Button>
      </Box>
    )
  }

  const statusConfig = statusColors[status] || statusColors.pending
  const StatusIcon = statusConfig.icon
  const resumeFilename = item.resumeFilename || item.filename || item.fileName || 'resume'
  const cvFilename = item.cvFilename || item.cvFileName || null
  const fileUrl = item.url || item.fileUrl || item.downloadUrl
  const cvUrl = item.cvUrl || item.cvFileUrl || item.cvDownloadUrl
  const currentStatus = item.status || 'pending'

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
        <Button 
          startIcon={<ArrowBackIcon />} 
          onClick={() => navigate('/resumes')}
          sx={{ textTransform: 'none' }}
        >
          Back to Resume Vault
        </Button>
        {!editing ? (
          <Button 
            startIcon={<EditIcon />} 
            variant="contained" 
            onClick={() => setEditing(true)}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Edit Details
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button 
              startIcon={<CancelIcon />} 
              onClick={handleCancel}
              disabled={saving}
              sx={{ textTransform: 'none' }}
            >
              Cancel
            </Button>
            <Button 
              startIcon={<SaveIcon />} 
              variant="contained" 
              onClick={handleSave}
              disabled={saving}
              sx={{ textTransform: 'none', borderRadius: 2 }}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Stack>
        )}
      </Stack>

      {/* Main Content */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          borderRadius: 3, 
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        {/* Company & Role Header */}
        <Stack spacing={3}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2} flexWrap="wrap" sx={{ mb: 2 }}>
              {editing ? (
                <TextField 
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  variant="outlined"
                  size="small"
                  sx={{ flex: 1, minWidth: 200 }}
                  InputProps={{
                    startAdornment: <BusinessIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              ) : (
                <>
                  <BusinessIcon sx={{ color: 'text.secondary', fontSize: 32 }} />
                  <Typography variant="h4" sx={{ fontWeight: 600 }}>{company}</Typography>
                </>
              )}
              {!editing && (
                <Chip 
                  icon={<StatusIcon fontSize="small" />} 
                  label={statusConfig.label} 
                  size="medium"
                  color={statusConfig.color}
                  sx={{ fontWeight: 600 }}
                />
              )}
            </Stack>

            {editing ? (
              <Stack spacing={2} sx={{ mb: 2 }}>
                <TextField 
                  label="Job Role"
                  value={jobRole}
                  onChange={(e) => setJobRole(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: <WorkIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
                <FormControl size="small">
                  <InputLabel>Status</InputLabel>
                  <Select value={status} onChange={(e) => setStatus(e.target.value)} label="Status">
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="selected">Selected</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            ) : (
              jobRole && (
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <WorkIcon sx={{ color: 'primary.main', fontSize: 24 }} />
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 500 }}>{jobRole}</Typography>
                </Stack>
              )
            )}
          </Box>

          <Divider />

          {/* Files & Links Section */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>Documents & Links</Typography>
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} flexWrap="wrap">
                {resumeFilename && (
                  <Chip 
                    icon={<DescriptionIcon fontSize="small" />} 
                    label={resumeFilename} 
                    variant="outlined"
                    sx={{ py: 2 }}
                  />
                )}
                {cvFilename && (
                  <Chip 
                    icon={<ArticleIcon fontSize="small" />} 
                    label={cvFilename} 
                    variant="outlined" 
                    color="secondary"
                    sx={{ py: 2 }}
                  />
                )}
              </Stack>
              
              {editing ? (
                <TextField 
                  label="Job URL"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  size="small"
                  fullWidth
                  placeholder="https://..."
                  InputProps={{
                    startAdornment: <LinkIcon sx={{ mr: 1, color: 'action.active' }} />
                  }}
                />
              ) : (
                <Stack direction="row" spacing={3} flexWrap="wrap">
                  {jobUrl && (
                    <MuiLink 
                      href={jobUrl} 
                      target="_blank" 
                      rel="noopener" 
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}
                    >
                      <LinkIcon fontSize="small" />
                      Job Posting
                    </MuiLink>
                  )}
                  {fileUrl && (
                    <MuiLink 
                      href={fileUrl} 
                      target="_blank" 
                      rel="noopener" 
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}
                    >
                      <DownloadIcon fontSize="small" />
                      Download Resume
                    </MuiLink>
                  )}
                  {cvUrl && (
                    <MuiLink 
                      href={cvUrl} 
                      target="_blank" 
                      rel="noopener" 
                      underline="hover"
                      sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.95rem' }}
                    >
                      <DownloadIcon fontSize="small" />
                      Download CV
                    </MuiLink>
                  )}
                </Stack>
              )}
            </Stack>
          </Box>

          <Divider />

          {/* Job Description */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkIcon color="primary" />
              Job Description
            </Typography>
            {editing ? (
              <TextField 
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                multiline
                minRows={6}
                fullWidth
                placeholder="Paste or enter the job description..."
              />
            ) : (
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {jobDescription || 'No job description provided'}
                </Typography>
              </Paper>
            )}
          </Box>

          <Divider />

          {/* General Notes */}
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
              <NotesIcon color="primary" />
              General Notes
            </Typography>
            {editing ? (
              <TextField 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                multiline
                minRows={4}
                fullWidth
                placeholder="Interview details, contact info, preparation notes..."
              />
            ) : (
              <Paper elevation={0} sx={{ p: 3, bgcolor: 'background.default', borderRadius: 2 }}>
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                  {notes || 'No general notes added'}
                </Typography>
              </Paper>
            )}
          </Box>

          <Divider />

          {/* Selection/Rejection Reasons */}
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            {/* Why Selected */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                <ThumbUpIcon />
                Why I Got Selected
              </Typography>
              {editing ? (
                <TextField 
                  value={selectionReasons}
                  onChange={(e) => setSelectionReasons(e.target.value)}
                  multiline
                  minRows={5}
                  fullWidth
                  placeholder="Key skills they valued, interview performance highlights, cultural fit..."
                />
              ) : (
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'success.lighter', borderRadius: 2, border: '1px solid', borderColor: 'success.light' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {selectionReasons || (status === 'selected' ? 'Add reasons why you were selected' : 'N/A')}
                  </Typography>
                </Paper>
              )}
            </Box>

            {/* Why Rejected */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                <ThumbDownIcon />
                Why I Got Rejected
              </Typography>
              {editing ? (
                <TextField 
                  value={rejectionReasons}
                  onChange={(e) => setRejectionReasons(e.target.value)}
                  multiline
                  minRows={5}
                  fullWidth
                  placeholder="Skills gap, interview feedback, areas to improve..."
                />
              ) : (
                <Paper elevation={0} sx={{ p: 3, bgcolor: 'error.lighter', borderRadius: 2, border: '1px solid', borderColor: 'error.light' }}>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                    {rejectionReasons || (status === 'rejected' ? 'Add reasons why you were rejected' : 'N/A')}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Stack>

          {/* Offer Letter & Files Section (only show for selected status) */}
          {(currentStatus === 'selected' || offerFiles.length > 0 || newOfferFiles.length > 0) && (
            <>
              <Divider />
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
                  <AttachFileIcon />
                  Offer Letter & Related Files
                </Typography>

                {/* Existing Uploaded Files */}
                {offerFiles.length > 0 && (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {offerFiles.map((file) => (
                      <Paper
                        key={file._id || file.id || file.name}
                        elevation={0}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: 'success.lighter',
                          border: '1px solid',
                          borderColor: 'success.light',
                          borderRadius: 2
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ flex: 1 }}>
                          <DescriptionIcon color="success" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {file.filename || file.name || 'Document'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1}>
                          {file.url && (
                            <IconButton
                              component="a"
                              href={file.url}
                              target="_blank"
                              rel="noopener"
                              size="small"
                              color="success"
                            >
                              <DownloadIcon fontSize="small" />
                            </IconButton>
                          )}
                          {editing && (
                            <IconButton
                              onClick={() => handleRemoveOfferFile(file._id || file.id)}
                              size="small"
                              color="error"
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          )}
                        </Stack>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {/* Newly Added Files (not yet uploaded) */}
                {newOfferFiles.length > 0 && (
                  <Stack spacing={1} sx={{ mb: 2 }}>
                    {newOfferFiles.map((file, idx) => (
                      <Paper
                        key={idx}
                        elevation={0}
                        sx={{
                          p: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          bgcolor: 'info.lighter',
                          border: '1px dashed',
                          borderColor: 'info.main',
                          borderRadius: 2
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <UploadFileIcon color="info" />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {file.name}
                          </Typography>
                          <Chip label="New" size="small" color="info" />
                        </Stack>
                        <IconButton
                          onClick={() => handleRemoveNewOfferFile(idx)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Paper>
                    ))}
                  </Stack>
                )}

                {/* Upload Button */}
                {editing && (
                  <Button
                    component="label"
                    variant="outlined"
                    color="success"
                    startIcon={<UploadFileIcon />}
                    sx={{ 
                      textTransform: 'none',
                      borderRadius: 2,
                      borderStyle: 'dashed',
                      '&:hover': { borderStyle: 'solid' }
                    }}
                  >
                    Add Offer Letter / Files
                    <input
                      type="file"
                      hidden
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={handleAddOfferFile}
                    />
                  </Button>
                )}

                {!editing && offerFiles.length === 0 && (
                  <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    No offer files uploaded yet. Click "Edit Details" to add files.
                  </Typography>
                )}
              </Box>
            </>
          )}

          {/* Timestamp */}
          {item.createdAt && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="caption" color="text.secondary">
                Applied on: {new Date(item.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  )
}
