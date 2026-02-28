import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    grade: '',
    status: 'Active'
  });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { Authorization: `Bearer ${token}` }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [enrollmentsRes, studentsRes, coursesRes] = await Promise.all([
        api.get('/enroll'),
        api.get('/students'),
        api.get('/courses')
      ]);
      setEnrollments(enrollmentsRes.data.data);
      setStudents(studentsRes.data.data);
      setCourses(coursesRes.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/enroll/${editing._id}`, {
          grade: formData.grade,
          status: formData.status
        });
      } else {
        await api.post('/enroll', {
          studentId: formData.studentId,
          courseId: formData.courseId
        });
      }
      fetchData();
      setShowForm(false);
      setFormData({
        studentId: '',
        courseId: '',
        grade: '',
        status: 'Active'
      });
      setEditing(null);
    } catch (err) {
      setError('Failed to save enrollment');
    }
  };

  const handleEdit = (enrollment) => {
    setFormData({
      studentId: enrollment.studentId._id,
      courseId: enrollment.courseId._id,
      grade: enrollment.grade || '',
      status: enrollment.status || 'Active'
    });
    setEditing(enrollment);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      try {
        await api.delete(`/enroll/${id}`);
        fetchData();
      } catch (err) {
        setError('Failed to delete enrollment');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manage Enrollments</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Enroll Student</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editing ? 'Edit Enrollment' : 'Enroll Student'}</h3>
            <form onSubmit={handleSubmit}>
              {!editing && (
                <>
                  <select
                    value={formData.studentId}
                    onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                    required
                  >
                    <option value="">Select Student</option>
                    {students.map(student => (
                      <option key={student._id} value={student._id}>
                        {student.userId.name} - {student.rollNumber}
                      </option>
                    ))}
                  </select>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                    required
                  >
                    <option value="">Select Course</option>
                    {courses.map(course => (
                      <option key={course._id} value={course._id}>
                        {course.name} - {course.code}
                      </option>
                    ))}
                  </select>
                </>
              )}
              {editing && (
                <>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Dropped">Dropped</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Grade (optional)"
                    value={formData.grade}
                    onChange={(e) => setFormData({...formData, grade: e.target.value})}
                  />
                </>
              )}
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Enroll'}</button>
                <button type="button" onClick={() => {setShowForm(false); setEditing(null);}} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Roll Number</th>
              <th>Course</th>
              <th>Course Code</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map(enrollment => (
              <tr key={enrollment._id}>
                <td>{enrollment.studentId.userId.name}</td>
                <td>{enrollment.studentId.rollNumber}</td>
                <td>{enrollment.courseId.name}</td>
                <td>{enrollment.courseId.code}</td>
                <td>{enrollment.grade || '-'}</td>
                <td>{enrollment.status}</td>
                <td>
                  <button onClick={() => handleEdit(enrollment)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(enrollment._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;
