import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/Auth.css';
import { authService } from '../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.resetPassword(token, { password });
      setMessage('Password reset successful — redirecting to dashboard');
      // Save token and user automatically
      const { token: authToken, user } = response.data;
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));
      setTimeout(() => {
        navigate(user.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard');
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Choose a new password</h2>
        <h3>Reset password</h3>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Confirm password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>

          <button className="primary-btn" disabled={loading}>{loading ? 'Resetting...' : 'Reset password'}</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;