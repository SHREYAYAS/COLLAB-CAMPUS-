import React, { useState } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  LinearProgress,
  Chip,
} from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CourseCard from '../components/CourseCard'
import { generateCourseFromPrompt, saveGeneratedCourse, getGeneratedCourses, getSampleCourses, getEnrolledCourses } from '../data/sampleData'

export default function GenerateCourseBuilderPage() {
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCourse, setGeneratedCourse] = useState(null)
  const [savedCourses, setSavedCourses] = useState(getGeneratedCourses())
  const [confirmDialog, setConfirmDialog] = useState(false)
  const [successDialog, setSuccessDialog] = useState(false)

  const sampleCourses = getSampleCourses()
  const enrolledCourses = getEnrolledCourses()

  const handleGenerateCourse = async (e) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsGenerating(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const newCourse = generateCourseFromPrompt(prompt)
    setGeneratedCourse(newCourse)
    setConfirmDialog(true)
    setIsGenerating(false)
  }

  const handleSaveCourse = () => {
    if (generatedCourse) {
      saveGeneratedCourse(generatedCourse)
      setSavedCourses([...savedCourses, generatedCourse])
      setConfirmDialog(false)
      setSuccessDialog(true)
      setPrompt('')
      setGeneratedCourse(null)
    }
  }

  const handleDeleteCourse = (courseId) => {
    const updated = savedCourses.filter((c) => c.id !== courseId)
    setSavedCourses(updated)
    localStorage.setItem('generated_courses', JSON.stringify(updated))
  }

  const handleEnroll = (course) => {
    const newEnrollment = {
      _id: `enrolled-${Date.now()}`,
      courseId: course.id,
      courseName: course.title,
      instructor: course.instructor,
      enrolledDate: new Date().toISOString().split('T')[0],
      completionPercentage: 0,
      currentModule: 1,
      totalModules: course.modules,
      currentLesson: 1,
      totalLessons: course.lessons,
      lastAccessedDate: new Date().toISOString().split('T')[0],
      certificateEarned: false,
      notes: '',
      bookmarkedLessons: [],
    }

    const allEnrolled = [...enrolledCourses, newEnrollment]
    localStorage.setItem('enrolled_courses', JSON.stringify(allEnrolled))
    setSuccessDialog(false)
    setTimeout(() => {
      window.location.href = '/my-courses'
    }, 1000)
  }

  const isEnrolledInCourse = (courseId) => {
    return enrolledCourses.some((e) => e.courseId === courseId)
  }

  const getEnrolledData = (courseId) => {
    return enrolledCourses.find((e) => e.courseId === courseId)
  }

  const examplePrompts = [
    'Advanced Python for Data Science',
    'Build ChatGPT-like Applications',
    'Computer Vision with PyTorch',
    'Blockchain and Web3 Development',
    'Quantum Computing Basics',
    'Mobile AI Applications',
  ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            ✨ AI Course Generator
          </Typography>
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500, mb: 1 }}>
            Describe what you want to learn, and AI will create a personalized course for you
          </Typography>
        </Box>

        {/* Generator Section */}
        <Card sx={{ mb: 6, borderRadius: 3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LightbulbIcon sx={{ color: '#f59e0b' }} />
                  What would you like to learn?
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="e.g., 'Create a course on advanced machine learning with focus on neural networks and transformers' or 'Teach me how to build mobile apps with AI capabilities'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      bgcolor: '#f9f9f9',
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Box>

              {/* Example Prompts */}
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', display: 'block', mb: 1 }}>
                  Try these examples:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {examplePrompts.map((example, idx) => (
                    <Chip
                      key={idx}
                      label={example}
                      onClick={() => setPrompt(example)}
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        borderColor: '#667eea',
                        color: '#667eea',
                        '&:hover': {
                          bgcolor: 'rgba(102, 126, 234, 0.1)',
                        },
                      }}
                    />
                  ))}
                </Box>
              </Box>

              {/* Progress Bar */}
              {isGenerating && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <LinearProgress sx={{ flex: 1, height: 4, borderRadius: 2 }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                      Generating...
                    </Typography>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    AI is analyzing your request and creating a personalized course...
                  </Typography>
                </Box>
              )}

              {/* Generate Button */}
              <Button
                fullWidth
                variant="contained"
                size="large"
                startIcon={<SendIcon />}
                onClick={handleGenerateCourse}
                disabled={!prompt.trim() || isGenerating}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: 16,
                  py: 1.5,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    boxShadow: '0 12px 32px rgba(102, 126, 234, 0.4)',
                  },
                  '&:disabled': {
                    background: '#ccc',
                  },
                }}
              >
                Generate Course
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* Generated Courses Section */}
        {savedCourses.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleIcon sx={{ color: '#10b981' }} />
              Your Generated Courses ({savedCourses.length})
            </Typography>
            <Grid container spacing={3}>
              {savedCourses.map((course) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                  <Box position="relative">
                    <CourseCard
                      course={course}
                      isEnrolled={isEnrolledInCourse(course.id)}
                      enrolledData={getEnrolledData(course.id)}
                      onEnroll={(c) => handleEnroll(c)}
                      onContinue={() => (window.location.href = '/my-courses')}
                    />
                    <Chip
                      label="Generated"
                      size="small"
                      sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        bgcolor: 'rgba(147, 197, 253, 0.9)',
                        color: '#1e40af',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Features Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>
            How It Works
          </Typography>
          <Grid container spacing={2}>
            {[
              {
                title: 'Describe Your Learning Goal',
                description: 'Tell the AI what you want to learn in your own words',
              },
              {
                title: 'AI Generates Course Structure',
                description: 'The system creates modules, lessons, and learning objectives',
              },
              {
                title: 'Personalized Content',
                description: 'Get a course tailored to your specific learning needs',
              },
              {
                title: 'Save and Learn',
                description: 'Save the course and start learning immediately',
              },
            ].map((feature, idx) => (
              <Grid item xs={12} sm={6} md={3} key={idx}>
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', h: '100%' }}>
                  <CardContent>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        bgcolor: '#667eea',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: 20,
                        mb: 1.5,
                      }}
                    >
                      {idx + 1}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Confirm Dialog */}
      <Dialog open={confirmDialog} onClose={() => setConfirmDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Course Generated Successfully!</DialogTitle>
        <DialogContent>
          {generatedCourse && (
            <Box sx={{ pt: 2 }}>
              <Alert severity="success" sx={{ mb: 2 }}>
                Your AI-generated course is ready to save and explore!
              </Alert>
              <Box sx={{ bgcolor: '#f9f9f9', p: 2.5, borderRadius: 2, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.75 }}>
                  {generatedCourse.title}
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
                  Instructor: {generatedCourse.instructor}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mb: 1 }}>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Category
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {generatedCourse.category}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Level
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {generatedCourse.level}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Duration
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {generatedCourse.duration}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                      Modules
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {generatedCourse.modules}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                  {generatedCourse.description_long}
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveCourse} variant="contained" sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
            Save Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successDialog} onClose={() => setSuccessDialog(false)}>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CheckCircleIcon sx={{ color: '#10b981' }} />
          Course Saved!
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Your course has been saved successfully. You can now enroll and start learning!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSuccessDialog(false)}>Continue</Button>
          <Button onClick={() => handleEnroll(generatedCourse)} variant="contained" sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
            Enroll Now
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
