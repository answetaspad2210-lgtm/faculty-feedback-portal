// client/src/App.jsx
// Top-level route configuration. Each route is wrapped in ProtectedRoute
// where a login is required, with allowedRoles restricting admin-only or
// student-only pages.
// Edit this file to add new pages/routes to the app.

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';

import StudentLayout from './layouts/StudentLayout.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FeedbackForm from './pages/FeedbackForm.jsx';

import AdminLayout from './layouts/AdminLayout.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminStudents from './pages/AdminStudents.jsx';
import AdminFaculty from './pages/AdminFaculty.jsx';
import AdminCourses from './pages/AdminCourses.jsx';
import AdminQuestions from './pages/AdminQuestions.jsx';
import AdminReports from './pages/AdminReports.jsx';

import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Student routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="feedback/:courseId" element={<FeedbackForm />} />
      </Route>

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="students" element={<AdminStudents />} />
        <Route path="faculty" element={<AdminFaculty />} />
        <Route path="courses" element={<AdminCourses />} />
        <Route path="questions" element={<AdminQuestions />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
