import React from 'react'
import { Box, Card, CardContent, Stack, Typography, Chip, Button, IconButton, Tooltip } from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import LinkIcon from '@mui/icons-material/Link'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CancelIcon from '@mui/icons-material/Cancel'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import SchoolIcon from '@mui/icons-material/School'
import CodeIcon from '@mui/icons-material/Code'

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'warning',
    icon: HourglassEmptyIcon,
    bgColor: '#fef3c7',
    textColor: '#92400e',
  },
  selected: {
    label: 'Selected',
    color: 'success',
    icon: CheckCircleIcon,
    bgColor: '#d1fae5',
    textColor: '#065f46',
  },
  rejected: {
    label: 'Rejected',
    color: 'error',
    icon: CancelIcon,
    bgColor: '#fee2e2',
    textColor: '#7f1d1d',
  },
}

export default function ResumeCard({
  item,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const statusInfo = statusConfig[item.status || 'pending'] || statusConfig.pending
  const StatusIcon = statusInfo.icon

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
          transform: 'translateY(-2px)',
          borderColor: statusInfo.textColor,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Candidate Info - Name, Email, Phone */}
          {(item.candidateName || item.email || item.phone) && (
            <Box sx={{ pb: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              {item.candidateName && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <PersonIcon sx={{ fontSize: 20, color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {item.candidateName}
                  </Typography>
                </Box>
              )}
              {(item.email || item.phone) && (
                <Stack spacing={0.5} sx={{ ml: 3.5 }}>
                  {item.email && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13 }}>
                      <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.email}
                      </Typography>
                    </Box>
                  )}
                  {item.phone && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: 13 }}>
                      <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {item.phone}
                      </Typography>
                    </Box>
                  )}
                </Stack>
              )}
            </Box>
          )}

          {/* Header: Company and Status */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                <BusinessIcon sx={{ fontSize: 20, color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {item.company || 'Company'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 3.5 }}>
                <WorkIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  {item.jobRole || 'Job Title'}
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: 2.5,
                bgcolor: statusInfo.bgColor,
                color: statusInfo.textColor,
              }}
            >
              <StatusIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: 13 }}>
                {statusInfo.label}
              </Typography>
            </Box>
          </Box>

          {/* Job Description */}
          {item.jobDescription && (
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                {item.jobDescription}
              </Typography>
            </Box>
          )}

          {/* Experience Section */}
          {item.experience && (
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(102, 126, 234, 0.08)', borderLeft: '3px solid #667eea' }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.5 }}>
                <SchoolIcon sx={{ fontSize: 16, color: '#667eea', mt: 0.25 }} />
                <Typography variant="caption" sx={{ color: '#667eea', fontWeight: 700 }}>
                  Experience:
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6, display: 'block', ml: 3 }}>
                {item.experience}
              </Typography>
            </Box>
          )}

          {/* Skills Section */}
          {item.skills && item.skills.length > 0 && (
            <Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CodeIcon sx={{ fontSize: 16, color: '#667eea' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
                  Skills:
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', ml: 3 }}>
                {item.skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    size="small"
                    sx={{
                      bgcolor: '#f3f4f6',
                      color: '#374151',
                      fontWeight: 500,
                      fontSize: 11,
                      height: 'auto',
                      py: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Publications (for research roles) */}
          {item.publications && item.publications.length > 0 && (
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(139, 92, 246, 0.08)', borderLeft: '3px solid #8b5cf6' }}>
              <Typography variant="caption" sx={{ color: '#8b5cf6', fontWeight: 700, display: 'block', mb: 1 }}>
                📚 Publications:
              </Typography>
              <Stack spacing={0.75}>
                {item.publications.map((pub, idx) => (
                  <Typography key={idx} variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                    • {pub}
                  </Typography>
                ))}
              </Stack>
            </Box>
          )}

          {/* Details Grid */}
          <Stack spacing={1.5} sx={{ py: 1 }}>
            {/* URL */}
            {item.jobUrl && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <LinkIcon sx={{ fontSize: 16, color: 'text.secondary', flex: '0 0 auto' }} />
                <Tooltip title="Open job posting">
                  <Button
                    size="small"
                    href={item.jobUrl}
                    target="_blank"
                    rel="noopener"
                    sx={{
                      textTransform: 'none',
                      fontWeight: 500,
                      color: '#667eea',
                      p: 0,
                      '&:hover': { textDecoration: 'underline' },
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5,
                    }}
                  >
                    View Job Posting
                    <OpenInNewIcon sx={{ fontSize: 14 }} />
                  </Button>
                </Tooltip>
              </Box>
            )}

            {/* Notes */}
            {item.notes && (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flex: '0 0 60px' }}>
                  Notes:
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
                  {item.notes}
                </Typography>
              </Box>
            )}

            {/* Applied Date */}
            {(item.appliedDate || item.createdAt) && (
              <Box sx={{ display: 'flex', gap: 1.5 }}>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, flex: '0 0 60px' }}>
                  Applied:
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {formatDate(item.appliedDate || item.createdAt)}
                </Typography>
              </Box>
            )}

            {/* Selection/Rejection Reasons */}
            {item.status === 'selected' && item.selectionReasons && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f0fdf4',
                  borderLeft: '3px solid #10b981',
                }}
              >
                <Typography variant="caption" sx={{ color: '#065f46', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Why Selected:
                </Typography>
                <Typography variant="caption" sx={{ color: '#047857', lineHeight: 1.5 }}>
                  {item.selectionReasons}
                </Typography>
              </Box>
            )}

            {item.status === 'selected' && (item.offerSalary || item.equity || item.startDate) && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#f0fdf4',
                  borderLeft: '3px solid #059669',
                }}
              >
                <Typography variant="caption" sx={{ color: '#065f46', fontWeight: 700, display: 'block', mb: 0.75 }}>
                  💼 Offer Details:
                </Typography>
                <Stack spacing={0.5}>
                  {item.offerSalary && (
                    <Typography variant="caption" sx={{ color: '#047857' }}>
                      <strong>Salary:</strong> {item.offerSalary}
                    </Typography>
                  )}
                  {item.equity && (
                    <Typography variant="caption" sx={{ color: '#047857' }}>
                      <strong>Equity:</strong> {item.equity}
                    </Typography>
                  )}
                  {item.startDate && (
                    <Typography variant="caption" sx={{ color: '#047857' }}>
                      <strong>Start Date:</strong> {formatDate(item.startDate)}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {item.status === 'pending' && (item.interviewDate || item.expectedResponse) && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#fffbeb',
                  borderLeft: '3px solid #f59e0b',
                }}
              >
                <Typography variant="caption" sx={{ color: '#92400e', fontWeight: 700, display: 'block', mb: 0.75 }}>
                  📅 Interview Details:
                </Typography>
                <Stack spacing={0.5}>
                  {item.interviewDate && (
                    <Typography variant="caption" sx={{ color: '#b45309' }}>
                      <strong>Interview:</strong> {formatDate(item.interviewDate)}
                    </Typography>
                  )}
                  {item.expectedResponse && (
                    <Typography variant="caption" sx={{ color: '#b45309' }}>
                      <strong>Expected Response:</strong> {formatDate(item.expectedResponse)}
                    </Typography>
                  )}
                </Stack>
              </Box>
            )}

            {item.status === 'rejected' && item.rejectionReasons && (
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: 2,
                  bgcolor: '#fef2f2',
                  borderLeft: '3px solid #ef4444',
                }}
              >
                <Typography variant="caption" sx={{ color: '#7f1d1d', fontWeight: 700, display: 'block', mb: 0.5 }}>
                  Rejection Feedback:
                </Typography>
                <Typography variant="caption" sx={{ color: '#991b1b', lineHeight: 1.5 }}>
                  {item.rejectionReasons}
                </Typography>
              </Box>
            )}
          </Stack>

          {/* Files */}
          {(item.resumeFilename || item.cvFilename || item.offerFiles?.length > 0) && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', pt: 1 }}>
              {item.resumeFilename && (
                <Chip
                  icon={<span>📄</span>}
                  label={item.resumeFilename}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    fontWeight: 500,
                  }}
                />
              )}
              {item.cvFilename && (
                <Chip
                  icon={<span>📋</span>}
                  label={item.cvFilename}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    fontWeight: 500,
                  }}
                />
              )}
              {Array.isArray(item.offerFiles) && item.offerFiles.map((file, idx) => (
                <Chip
                  key={idx}
                  icon={<span>📎</span>}
                  label={file.name || `Offer ${idx + 1}`}
                  size="small"
                  variant="outlined"
                  sx={{
                    borderColor: '#10b981',
                    color: '#10b981',
                    fontWeight: 500,
                  }}
                />
              ))}
            </Box>
          )}

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 1 }}>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => onEdit?.(item)}
                sx={{
                  color: '#667eea',
                  '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.1)' },
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                onClick={() => onDelete?.(item._id || item.id)}
                sx={{
                  color: '#ef4444',
                  '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.1)' },
                }}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  )
}
