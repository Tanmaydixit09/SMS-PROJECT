import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Admin pages
import Students from './pages/admin/Students';
import Courses from './pages/admin/Courses';
import Batches from './pages/admin/Batches';
import Enrollments from './pages/admin/Enrollments';

// Student pages
import StudentEnrollments from './pages/student/Enrollments';
import StudentProfile from './pages/student/Profile';

import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          
          {/* Student Routes */}
          <Route
            path="/student/dashboard"
            element={
              <PrivateRoute requiredRole="Student">
                <StudentDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/enrollments"
            element={
              <PrivateRoute requiredRole="Student">
                <StudentEnrollments />
              </PrivateRoute>
            }
          />
          <Route
            path="/student/profile"
            element={
              <PrivateRoute requiredRole="Student">
                <StudentProfile />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute requiredRole="Admin">
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <PrivateRoute requiredRole="Admin">
                <Students />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <PrivateRoute requiredRole="Admin">
                <Courses />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/batches"
            element={
              <PrivateRoute requiredRole="Admin">
                <Batches />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/enrollments"
            element={
              <PrivateRoute requiredRole="Admin">
                <Enrollments />
              </PrivateRoute>
            }
          />

          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
