import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Dashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">SMS - Student Portal</div>
        <div className="navbar-menu">
          <a href="/student/dashboard">Dashboard</a>
          <a href="/student/enrollments">My Courses</a>
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
            <h3>My Enrollments</h3>
            <p>View all your enrolled courses</p>
            <a href="/student/enrollments">Go to Enrollments</a>
          </div>
          <div className="card">
            <h3>My Profile</h3>
            <p>View and manage your profile information</p>
            <a href="/student/profile">View Profile</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
