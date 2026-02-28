import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">SMS - Admin Panel</div>
        <div className="navbar-menu">
          <a href="/admin/dashboard">Dashboard</a>
          <a href="/admin/students">Students</a>
          <a href="/admin/courses">Courses</a>
          <a href="/admin/enrollments">Enrollments</a>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-card">
          <h1>Welcome, {user?.name}!</h1>
          <p>Email: {user?.email}</p>
          <p>Role: {user?.role}</p>
        </div>

        <div className="dashboard-grid">
          <div className="card">
            <h3>Manage Students</h3>
            <p>Add, edit, and delete student records</p>
            <a href="/admin/students">Manage Students</a>
          </div>
          <div className="card">
            <h3>Manage Courses</h3>
            <p>Create and manage course offerings</p>
            <a href="/admin/courses">Manage Courses</a>
          </div>
          <div className="card">
            <h3>Manage Enrollments</h3>
            <p>Enroll students and manage grades</p>
            <a href="/admin/enrollments">Manage Enrollments</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
