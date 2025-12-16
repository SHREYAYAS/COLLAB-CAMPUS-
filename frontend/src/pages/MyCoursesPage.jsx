import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Stack,
  LinearProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import DownloadIcon from '@mui/icons-material/Download'
import DeleteIcon from '@mui/icons-material/Delete'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import SchoolIcon from '@mui/icons-material/School'
import { getSampleCourses, getEnrolledCourses } from '../data/sampleData'

function TabPanel(props) {
  const { children, value, index, ...other } = props
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  )
}

export default function MyCoursesPage() {
  const [tabValue, setTabValue] = useState(0)
  const [deleteDialog, setDeleteDialog] = useState(false)
  const [selectedCourseForDelete, setSelectedCourseForDelete] = useState(null)

  const courses = getSampleCourses()
  const enrolledCourses = getEnrolledCourses()

  const inProgressCourses = enrolledCourses.filter((e) => e.completionPercentage < 100)
  const completedCourses = enrolledCourses.filter((e) => e.completionPercentage === 100 || e.certificateEarned)

  const getCourseDetails = (courseId) => {
    return courses.find((c) => c.id === courseId)
  }

  const handleDeleteClick = (course) => {
    setSelectedCourseForDelete(course)
    setDeleteDialog(true)
  }

  const confirmDelete = () => {
    if (selectedCourseForDelete) {
      const updated = enrolledCourses.filter((e) => e._id !== selectedCourseForDelete._id)
      localStorage.setItem('enrolled_courses', JSON.stringify(updated))
      setDeleteDialog(false)
      setSelectedCourseForDelete(null)
      window.location.reload()
    }
  }

  const handleUpdateProgress = (enrolledId, newPercentage) => {
    const updated = enrolledCourses.map((e) => {
      if (e._id === enrolledId) {
        return {
          ...e,
          completionPercentage: newPercentage,
          lastAccessedDate: new Date().toISOString().split('T')[0],
        }
      }
      return e
    })
    localStorage.setItem('enrolled_courses', JSON.stringify(updated))
    window.location.reload()
  }

  const renderCourseCard = (enrolled) => {
    const courseDetails = getCourseDetails(enrolled.courseId)
    if (!courseDetails) return null

    return (
      <Card
        key={enrolled._id}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 24px rgba(0,0,0,0.12)',
          },
        }}
      >
        <Box sx={{ position: 'relative', height: 180 }}>
          <CardMedia component="img" height="180" image={courseDetails.image} alt={courseDetails.title} sx={{ objectFit: 'cover' }} />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              '&:hover': {
                opacity: 1,
              },
            }}
          >
            <PlayArrowIcon sx={{ fontSize: 48, color: '#fff' }} />
          </Box>
        </Box>

        <CardContent sx={{ pb: 2 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: 'text.primary', mb: 0.5 }}>
                {courseDetails.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {courseDetails.instructor}
              </Typography>
            </Box>

            {/* Progress Section */}
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Learning Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {enrolled.completionPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={enrolled.completionPercentage}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  bgcolor: '#f3f4f6',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 4,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              />
            </Box>

            {/* Course Stats */}
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Module
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {enrolled.currentModule}/{enrolled.totalModules}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ p: 1, bgcolor: '#f3f4f6', borderRadius: 2 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    Lesson
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                    {enrolled.currentLesson}/{enrolled.totalLessons}
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* Notes */}
            {enrolled.notes && (
              <Box sx={{ p: 1.5, bgcolor: '#fef3c7', borderRadius: 2 }}>
                <Typography variant="caption" sx={{ color: '#92400e', display: 'block' }}>
                  <strong>Your Notes:</strong>
                </Typography>
                <Typography variant="caption" sx={{ color: '#92400e', lineHeight: 1.5 }}>
                  {enrolled.notes}
                </Typography>
              </Box>
            )}

            {/* Bookmarks */}
            {enrolled.bookmarkedLessons && enrolled.bookmarkedLessons.length > 0 && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 0.75 }}>
                  📌 Bookmarked Lessons ({enrolled.bookmarkedLessons.length})
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
                  {enrolled.bookmarkedLessons.slice(0, 3).map((lesson, idx) => (
                    <Chip key={idx} label={lesson} size="small" variant="outlined" icon={<BookmarkIcon />} sx={{ fontSize: 11 }} />
                  ))}
                </Box>
              </Box>
            )}

            {/* Last Accessed */}
            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
              Last accessed: {enrolled.lastAccessedDate}
            </Typography>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 1, pt: 1 }}>
              <Button
                fullWidth
                variant="contained"
                size="small"
                startIcon={<PlayArrowIcon />}
                sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Continue
              </Button>
              <Button
                fullWidth
                variant="outlined"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => handleDeleteClick(enrolled)}
                sx={{
                  color: '#ef4444',
                  borderColor: '#ef4444',
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                Remove
              </Button>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    )
  }

  const totalProgress =
    inProgressCourses.length > 0 ? Math.round(inProgressCourses.reduce((sum, e) => sum + e.completionPercentage, 0) / inProgressCourses.length) : 0

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            📚 My Courses
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            Track your learning progress and continue where you left off
          </Typography>
        </Box>

        {/* Overall Stats */}
        {enrolledCourses.length > 0 && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    {enrolledCourses.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Enrolled Courses
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#10b981', mb: 0.5 }}>
                    {inProgressCourses.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    In Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b', mb: 0.5 }}>
                    {completedCourses.length}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Completed
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                    {totalProgress}%
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Overall Progress
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Tabs */}
        <Box sx={{ borderBottom: '1px solid #e5e7eb', mb: 3 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 600 } }}>
            <Tab label={`In Progress (${inProgressCourses.length})`} />
            <Tab label={`Completed (${completedCourses.length})`} />
          </Tabs>
        </Box>

        {/* In Progress Courses */}
        <TabPanel value={tabValue} index={0}>
          {inProgressCourses.length > 0 ? (
            <Grid container spacing={3}>
              {inProgressCourses.map((enrolled) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={enrolled._id}>
                  {renderCourseCard(enrolled)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No courses in progress
              </Typography>
              <Button href="/courses" variant="contained" sx={{ mt: 2, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
                Browse Courses
              </Button>
            </Box>
          )}
        </TabPanel>

        {/* Completed Courses */}
        <TabPanel value={tabValue} index={1}>
          {completedCourses.length > 0 ? (
            <Grid container spacing={3}>
              {completedCourses.map((enrolled) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={enrolled._id}>
                  {renderCourseCard(enrolled)}
                </Grid>
              ))}
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#fff', borderRadius: 3 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
                No completed courses yet
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                Keep learning and complete your courses to see them here
              </Typography>
              <Button href="/courses" variant="contained" sx={{ mt: 2, background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
                Continue Learning
              </Button>
            </Box>
          )}
        </TabPanel>
      </Container>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Course</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Are you sure you want to remove <strong>{selectedCourseForDelete?.courseName}</strong> from your enrolled courses? Your progress will be lost.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
