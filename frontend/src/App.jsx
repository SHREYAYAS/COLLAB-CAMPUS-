import { Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import React from 'react'
import ProjectPage from './pages/ProjectPage.jsx'
import Layout from './components/Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ProjectsListPage from './pages/ProjectsListPage.jsx'
import TasksPage from './pages/TasksPage.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import AnalyticsPage from './pages/AnalyticsPage.jsx'
import TeamPage from './pages/TeamPage.jsx'
import SettingsPage from './pages/SettingsPage.jsx'
import HelpPage from './pages/HelpPage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'
import ResumeVaultPage from './pages/ResumeVaultPage.jsx'
import ResumeDetailPage from './pages/ResumeDetailPage.jsx'
import AICourseBuilderPage from './pages/AICourseBuilderPage.jsx'
import MyCoursesPage from './pages/MyCoursesPage.jsx'
import GenerateCourseBuilderPage from './pages/GenerateCourseBuilderPage.jsx'

function App() {
  return (
    <Routes>
      {/* Public routes (no Layout) */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      {/* Protected routes (inside Layout) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/projects" element={<Layout><ProjectsListPage /></Layout>} />
        <Route path="/projects/:projectId" element={<Layout><ProjectPage /></Layout>} />
        <Route path="/projects/:projectId/info" element={<Layout><ProjectDetailPage /></Layout>} />
        <Route path="/tasks" element={<Layout><TasksPage /></Layout>} />
        <Route path="/calendar" element={<Layout><CalendarPage /></Layout>} />
        <Route path="/analytics" element={<Layout><AnalyticsPage /></Layout>} />
        <Route path="/resumes" element={<Layout><ResumeVaultPage /></Layout>} />
        <Route path="/resumes/:id" element={<Layout><ResumeDetailPage /></Layout>} />
        <Route path="/courses" element={<Layout><AICourseBuilderPage /></Layout>} />
        <Route path="/generate-course" element={<Layout><GenerateCourseBuilderPage /></Layout>} />
        <Route path="/my-courses" element={<Layout><MyCoursesPage /></Layout>} />
        <Route path="/team" element={<Layout><TeamPage /></Layout>} />
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />
        <Route path="/help" element={<Layout><HelpPage /></Layout>} />
      </Route>
      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App