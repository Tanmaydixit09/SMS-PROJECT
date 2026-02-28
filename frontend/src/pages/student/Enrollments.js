import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await api.get('/enroll');
      setEnrollments(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch enrollments');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>My Enrolled Courses</h2>
      </div>

      <div className="cards-container">
        {enrollments.length === 0 ? (
          <p>No courses enrolled yet.</p>
        ) : (
          enrollments.map(enrollment => (
            <div key={enrollment._id} className="card">
              <h3>{enrollment.courseId.name}</h3>
              <p><strong>Course Code:</strong> {enrollment.courseId.code}</p>
              <p><strong>Instructor:</strong> {enrollment.courseId.instructor}</p>
              <p><strong>Credits:</strong> {enrollment.courseId.credits}</p>
              <p><strong>Status:</strong> {enrollment.status}</p>
              <p><strong>Grade:</strong> {enrollment.grade || 'Not graded yet'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default StudentEnrollments;
