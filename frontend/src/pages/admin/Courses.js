import React, { useState, useEffect } from 'react';
import { courseService } from '../../services/api';
import '../../styles/Dashboard.css';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    credits: '',
    instructor: '',
    semester: '',
    maxStudents: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getAll();
      setCourses(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch courses');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        credits: parseInt(formData.credits),
        semester: parseInt(formData.semester),
        maxStudents: parseInt(formData.maxStudents)
      };
      
      if (editing) {
        await courseService.update(editing._id, data);
      } else {
        await courseService.create(data);
      }
      fetchCourses();
      setShowForm(false);
      setFormData({
        name: '',
        code: '',
        description: '',
        credits: '',
        instructor: '',
        semester: '',
        maxStudents: ''
      });
      setEditing(null);
    } catch (err) {
      setError('Failed to save course');
    }
  };

  const handleEdit = (course) => {
    setFormData({
      name: course.name,
      code: course.code,
      description: course.description,
      credits: course.credits.toString(),
      instructor: course.instructor,
      semester: course.semester.toString(),
      maxStudents: course.maxStudents.toString()
    });
    setEditing(course);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await courseService.delete(id);
        fetchCourses();
      } catch (err) {
        setError('Failed to delete course');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manage Courses</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add Course</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editing ? 'Edit Course' : 'Add Course'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Course Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Course Code"
                value={formData.code}
                onChange={(e) => setFormData({...formData, code: e.target.value})}
                required
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Credits"
                value={formData.credits}
                onChange={(e) => setFormData({...formData, credits: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Instructor"
                value={formData.instructor}
                onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Semester"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Max Students"
                value={formData.maxStudents}
                onChange={(e) => setFormData({...formData, maxStudents: e.target.value})}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Add'}</button>
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
              <th>Name</th>
              <th>Code</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Semester</th>
              <th>Max Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.instructor}</td>
                <td>{course.credits}</td>
                <td>{course.semester}</td>
                <td>{course.maxStudents}</td>
                <td>
                  <button onClick={() => handleEdit(course)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(course._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Courses;
