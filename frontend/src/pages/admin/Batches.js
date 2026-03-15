import React, { useState, useEffect } from 'react';
import { batchService } from '../../services/api';

const Batches = () => {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    batchName: '',
    startYear: '',
    endYear: '',
    department: ''
  });
  const [editing, setEditing] = useState(null);

  // Using centralized batchService with token interceptor

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await batchService.getAll();
      setBatches(response.data.data || response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch batches');
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        startYear: parseInt(formData.startYear),
        endYear: parseInt(formData.endYear)
      };
      
      if (editing) {
        await batchService.update(editing._id, data);
      } else {
        await batchService.create(data);
      }
      fetchBatches();
      setShowForm(false);
      setFormData({
        batchName: '',
        startYear: '',
        endYear: '',
        department: ''
      });
      setEditing(null);
    } catch (err) {
      setError('Failed to save batch');
    }
  };

  const handleEdit = (batch) => {
    setFormData({
      batchName: batch.batchName,
      startYear: batch.startYear.toString(),
      endYear: batch.endYear.toString(),
      department: batch.department
    });
    setEditing(batch);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this batch?')) {
      try {
        await batchService.delete(id);
        fetchBatches();
      } catch (err) {
        setError('Failed to delete batch');
      }
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Manage Batches</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">Add Batch</button>
      </div>

      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editing ? 'Edit Batch' : 'Add Batch'}</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Batch Name"
                value={formData.batchName}
                onChange={(e) => setFormData({...formData, batchName: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Start Year"
                value={formData.startYear}
                onChange={(e) => setFormData({...formData, startYear: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="End Year"
                value={formData.endYear}
                onChange={(e) => setFormData({...formData, endYear: e.target.value})}
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
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
              <th>Batch Name</th>
              <th>Start Year</th>
              <th>End Year</th>
              <th>Department</th>
              <th>Total Students</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {batches.map(batch => (
              <tr key={batch._id}>
                <td>{batch.batchName}</td>
                <td>{batch.startYear}</td>
                <td>{batch.endYear}</td>
                <td>{batch.department}</td>
                <td>{batch.totalStudents}</td>
                <td>
                  <button onClick={() => handleEdit(batch)} className="btn-edit">Edit</button>
                  <button onClick={() => handleDelete(batch._id)} className="btn-delete">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Batches;
