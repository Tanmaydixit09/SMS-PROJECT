import React, { useState, useEffect } from 'react';
import { studentService } from '../../services/api';
import '../../styles/Dashboard.css';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    batchId: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: ''
  });
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch students');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await studentService.update(editing._id, formData);
      } else {
        await studentService.create(formData);
      }
      fetchStudents();
      setShowForm(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        rollNumber: '',
        batchId: '',
        phoneNumber: '',
        address: '',
        dateOfBirth: ''
      });
      setEditing(null);
    } catch (err) {
      setError('Failed to save student');
    }
  };

  const handleEdit = (student) => {
    setFormData({
      name: student.userId.name,
      email: student.userId.email,
      rollNumber: student.rollNumber,
      batchId: student.batchId._id,
      phoneNumber: student.phoneNumber,
      address: student.address,
      dateOfBirth: student.dateOfBirth.split('T')[0]
    });
    setEditing(student);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.delete(id);
        fetchStudents();
      } catch (err) {
        setError('Failed to delete student');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manage Students</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add Student</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editing ? 'Edit Student' : 'Add Student'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              {!editing && (
                <input
                  type="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
              )}
              <input
                type="text"
                placeholder="Roll Number"
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Batch ID"
                value={formData.batchId}
                onChange={(e) => setFormData({...formData, batchId: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                required
              />
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
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
              <th>Email</th>
              <th>Roll Number</th>
              <th>Batch</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student._id}>
                <td>{student.userId.name}</td>
                <td>{student.userId.email}</td>
                <td>{student.rollNumber}</td>
                <td>{student.batchId.batchName}</td>
                <td>{student.phoneNumber}</td>
                <td>{student.status}</td>
                <td>
                  <button onClick={() => handleEdit(student)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(student._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Students;
