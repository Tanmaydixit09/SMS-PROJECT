import React, { useState } from 'react';
import '../styles/Auth.css';
import { authService } from '../services/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setMessage('If an account exists, a reset link has been sent to your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset your password</h2>
        <h3>Forgot password</h3>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <button className="primary-btn" disabled={loading}>{loading ? 'Sending...' : 'Send reset link'}</button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;