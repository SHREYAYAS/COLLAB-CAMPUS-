import React, { useState, useMemo } from 'react'
import {
  Box,
  Container,
  Typography,
  TextField,
  Grid,
  Chip,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import FilterListIcon from '@mui/icons-material/FilterList'
import AddIcon from '@mui/icons-material/Add'
import CourseCard from '../components/CourseCard'
import { getSampleCourses, getEnrolledCourses, getGeneratedCourses } from '../data/sampleData'

export default function AICourseBuilderPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedLevel, setSelectedLevel] = useState('All')
  const [selectedPrice, setSelectedPrice] = useState('All')
  const [enrollDialog, setEnrollDialog] = useState(false)
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState(null)

  const courses = getSampleCourses()
  const enrolledCourses = getEnrolledCourses()
  const generatedCourses = getGeneratedCourses()

  const categories = ['All', 'Machine Learning', 'Generative AI', 'Deep Learning', 'NLP', 'Computer Vision', 'AI Engineering', 'Reinforcement Learning', 'AI Fundamentals']
  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced', 'Intermediate to Advanced']
  const priceRanges = ['All', 'Free', 'Under $100', 'Under $150', '$150+']

  // Filter courses
  const filteredCourses = useMemo(() => {
    const allCourses = [...courses, ...generatedCourses]
    return allCourses.filter((course) => {
      // Search filter
      const matchesSearch =
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      // Category filter
      const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory

      // Level filter
      const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel

      // Price filter
      let matchesPrice = true
      if (selectedPrice === 'Free') {
        matchesPrice = course.price === 0
      } else if (selectedPrice === 'Under $100') {
        matchesPrice = course.price > 0 && course.price < 100
      } else if (selectedPrice === 'Under $150') {
        matchesPrice = course.price > 0 && course.price < 150
      } else if (selectedPrice === '$150+') {
        matchesPrice = course.price >= 150
      }

      return matchesSearch && matchesCategory && matchesLevel && matchesPrice
    })
  }, [searchQuery, selectedCategory, selectedLevel, selectedPrice, courses, generatedCourses])

  const handleEnroll = (course) => {
    setSelectedCourseForEnroll(course)
    setEnrollDialog(true)
  }

  const confirmEnroll = () => {
    if (selectedCourseForEnroll) {
      const newEnrollment = {
        _id: `enrolled-${Date.now()}`,
        courseId: selectedCourseForEnroll.id,
        courseName: selectedCourseForEnroll.title,
        instructor: selectedCourseForEnroll.instructor,
        enrolledDate: new Date().toISOString().split('T')[0],
        completionPercentage: 0,
        currentModule: 1,
        totalModules: selectedCourseForEnroll.modules,
        currentLesson: 1,
        totalLessons: selectedCourseForEnroll.lessons,
        lastAccessedDate: new Date().toISOString().split('T')[0],
        certificateEarned: false,
        notes: '',
        bookmarkedLessons: [],
      }

      const updatedEnrolled = [...enrolledCourses, newEnrollment]
      localStorage.setItem('enrolled_courses', JSON.stringify(updatedEnrolled))
      setEnrollDialog(false)
      setSelectedCourseForEnroll(null)
      window.location.reload()
    }
  }

  const handleContinue = (course) => {
    // Navigate to course detail or learning page
    window.location.href = `/courses/${course.id}`
  }

  const isCoursesEnrolled = (courseId) => {
    return enrolledCourses.some((e) => e.courseId === courseId)
  }

  const getEnrolledData = (courseId) => {
    return enrolledCourses.find((e) => e.courseId === courseId)
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    setSelectedLevel('All')
    setSelectedPrice('All')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f8f9fa', py: 4 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                🤖 AI Course Builder
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Master artificial intelligence with premium courses from industry experts
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              href="/generate-course"
              sx={{
                background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 700,
                borderRadius: 2,
                py: 1.5,
                px: 3,
              }}
            >
              Generate Course
            </Button>
          </Box>
        </Box>

        {/* Search and Filters */}
        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            {/* Search Bar */}
            <TextField
              fullWidth
              placeholder="Search courses by title, instructor, or topic..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 2, color: 'text.secondary' }} />,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  bgcolor: '#fff',
                  '&:hover fieldset': {
                    borderColor: '#667eea',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                  },
                },
              }}
            />

            {/* Filters */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Category</InputLabel>
                  <Select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} label="Category">
                    {categories.map((cat) => (
                      <MenuItem key={cat} value={cat}>
                        {cat}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Level</InputLabel>
                  <Select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)} label="Level">
                    {levels.map((level) => (
                      <MenuItem key={level} value={level}>
                        {level}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Price</InputLabel>
                  <Select value={selectedPrice} onChange={(e) => setSelectedPrice(e.target.value)} label="Price">
                    {priceRanges.map((price) => (
                      <MenuItem key={price} value={price}>
                        {price}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={2.4}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(102, 126, 234, 0.05)',
                    },
                  }}
                >
                  Clear Filters
                </Button>
              </Grid>
            </Grid>
          </Stack>
        </Box>

        {/* Results Count */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
            Showing <strong>{filteredCourses.length}</strong> courses
          </Typography>
        </Box>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <Grid container spacing={3}>
            {filteredCourses.map((course) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={course._id}>
                <CourseCard
                  course={course}
                  isEnrolled={isCoursesEnrolled(course.id)}
                  enrolledData={getEnrolledData(course.id)}
                  onEnroll={handleEnroll}
                  onContinue={handleContinue}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: '#fff',
              borderRadius: 3,
              border: '2px dashed #e5e7eb',
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary', mb: 1 }}>
              No courses found
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Try adjusting your search or filter criteria
            </Typography>
          </Box>
        )}
      </Container>

      {/* Enrollment Dialog */}
      <Dialog open={enrollDialog} onClose={() => setEnrollDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>Enroll in Course</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Are you sure you want to enroll in this course?
            </Typography>
            <Box sx={{ bgcolor: '#f3f4f6', p: 2, borderRadius: 2, mb: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {selectedCourseForEnroll?.title}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Instructor: {selectedCourseForEnroll?.instructor}
              </Typography>
              <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 700, mt: 1 }}>
                ${selectedCourseForEnroll?.price}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEnrollDialog(false)}>Cancel</Button>
          <Button onClick={confirmEnroll} variant="contained" sx={{ background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)' }}>
            Confirm Enrollment
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
