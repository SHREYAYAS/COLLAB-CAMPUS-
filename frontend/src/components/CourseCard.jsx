import React from 'react'
import { Box, Card, CardContent, CardMedia, Stack, Typography, Chip, Button, Rating, LinearProgress } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import PersonIcon from '@mui/icons-material/Person'
import SchoolIcon from '@mui/icons-material/School'
import TimerIcon from '@mui/icons-material/Timer'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddIcon from '@mui/icons-material/Add'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

export default function CourseCard({ course, isEnrolled, enrolledData, onEnroll, onContinue }) {
  const getCategoryColor = (category) => {
    const colors = {
      'Machine Learning': '#667eea',
      'Generative AI': '#f093fb',
      'Deep Learning': '#4facfe',
      'NLP': '#43e97b',
      'Computer Vision': '#fa709a',
      'AI Engineering': '#30cfd0',
      'Reinforcement Learning': '#a8edea',
      'AI Fundamentals': '#fed6e3',
    }
    return colors[category] || '#667eea'
  }

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        '&:hover': {
          boxShadow: '0 16px 32px rgba(0,0,0,0.15)',
          transform: 'translateY(-8px)',
        },
      }}
    >
      {/* Course Image */}
      <Box sx={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={course.image}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
        {/* Premium Badge */}
        {course.isPremium && (
          <Chip
            label="Premium"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              bgcolor: '#fff',
              fontWeight: 700,
              color: '#667eea',
            }}
          />
        )}
        {/* Enrolled Badge */}
        {isEnrolled && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              bgcolor: 'rgba(16, 185, 129, 0.9)',
              color: '#fff',
              px: 1.5,
              py: 0.75,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 16 }} />
            Enrolled
          </Box>
        )}
      </Box>

      <CardContent sx={{ flex: 1, pb: 2, display: 'flex', flexDirection: 'column' }}>
        <Stack spacing={2}>
          {/* Category */}
          <Box>
            <Chip
              label={course.category}
              size="small"
              sx={{
                bgcolor: getCategoryColor(course.category),
                color: '#fff',
                fontWeight: 600,
                fontSize: 11,
              }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.3, color: 'text.primary' }}>
            {course.title}
          </Typography>

          {/* Description */}
          <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.5 }}>
            {course.description.substring(0, 80)}...
          </Typography>

          {/* Instructor */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              component="img"
              src={course.instructorImage}
              alt={course.instructor}
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
              }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              {course.instructor}
            </Typography>
          </Box>

          {/* Rating and Reviews */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Rating value={course.rating} readOnly size="small" sx={{ fontSize: 16 }} />
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
              {course.rating} ({course.reviews.toLocaleString()} reviews)
            </Typography>
          </Box>

          {/* Progress Bar (if enrolled) */}
          {isEnrolled && enrolledData && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary' }}>
                  Progress
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#667eea' }}>
                  {enrolledData.completionPercentage}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={enrolledData.completionPercentage}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: '#f3f4f6',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 3,
                    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  },
                }}
              />
            </Box>
          )}

          {/* Course Stats */}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {course.modules} modules
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <TimerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {course.duration}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {course.students.toLocaleString()} students
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <StarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {course.level}
              </Typography>
            </Box>
          </Box>

          {/* Price and Tags */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
              ${course.price}
            </Typography>
          </Box>

          {/* Tags */}
          <Box sx={{ display: 'flex', gap: 0.75, flexWrap: 'wrap' }}>
            {course.tags.slice(0, 3).map((tag, idx) => (
              <Chip
                key={idx}
                label={tag}
                size="small"
                variant="outlined"
                sx={{
                  height: 24,
                  fontSize: 11,
                  color: '#667eea',
                  borderColor: '#667eea',
                  bgcolor: 'rgba(102, 126, 234, 0.05)',
                }}
              />
            ))}
          </Box>
        </Stack>
      </CardContent>

      {/* Action Button */}
      <Box sx={{ px: 2, pb: 2, pt: 1 }}>
        {isEnrolled ? (
          <Button
            fullWidth
            variant="contained"
            startIcon={<PlayArrowIcon />}
            onClick={() => onContinue?.(course)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Continue Learning
          </Button>
        ) : (
          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => onEnroll?.(course)}
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              '&:hover': {
                boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
              },
            }}
          >
            Enroll Now
          </Button>
        )}
      </Box>
    </Card>
  )
}
