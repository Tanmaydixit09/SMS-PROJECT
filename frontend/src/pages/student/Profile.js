import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentProfile = () => {
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  const token = localStorage.getItem('token');
  const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    setUser(storedUser);
    fetchStudentProfile();
  }, []);

  const fetchStudentProfile = async () => {
    try {
      const response = await api.get('/students');
      if (response.data.data.length > 0) {
        setStudent(response.data.data[0]);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch profile');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>My Profile</h2>
      </div>

      <div className="profile-container">
        {student ? (
          <>
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-field">
                <label>Name:</label>
                <span>{student.userId.name}</span>
              </div>
              <div className="profile-field">
                <label>Email:</label>
                <span>{student.userId.email}</span>
              </div>
              <div className="profile-field">
                <label>Roll Number:</label>
                <span>{student.rollNumber}</span>
              </div>
              <div className="profile-field">
                <label>Phone Number:</label>
                <span>{student.phoneNumber}</span>
              </div>
              <div className="profile-field">
                <label>Address:</label>
                <span>{student.address}</span>
              </div>
              <div className="profile-field">
                <label>Date of Birth:</label>
                <span>{new Date(student.dateOfBirth).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>Academic Information</h3>
              <div className="profile-field">
                <label>Batch:</label>
                <span>{student.batchId.batchName}</span>
              </div>
              <div className="profile-field">
                <label>Department:</label>
                <span>{student.batchId.department}</span>
              </div>
              <div className="profile-field">
                <label>Enrollment Date:</label>
                <span>{new Date(student.enrollmentDate).toLocaleDateString()}</span>
              </div>
              <div className="profile-field">
                <label>Status:</label>
                <span className={`status-${student.status.toLowerCase()}`}>{student.status}</span>
              </div>
            </div>
          </>
        ) : (
          <p>No student profile found.</p>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;
