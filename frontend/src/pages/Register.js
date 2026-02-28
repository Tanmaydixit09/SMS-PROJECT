import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/Auth.css';
import { authService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password) {
      setError('Please fill all required fields');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please provide a valid email');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.register({ name, email, password });
      const { token, user } = response.data;
      setSuccess('Registration successful — redirecting...');
      // Auto-login and redirect
      login(user, token, true);
      setTimeout(() => {
        navigate(user.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard');
      }, 900);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Management System</h2>
        <h3>Create an account</h3>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />
              <button type="button" className="toggle-password" onClick={() => setShowPassword((s) => !s)}>{showPassword ? 'Hide' : 'Show'}</button>
            </div>
          </div>

          <div className="form-group">
            <label>Confirm password</label>
            <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" required />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>{loading ? 'Registering...' : 'Sign up'}</button>

          <div className="divider">or</div>
          <button
            type="button"
            className="social-btn"
            onClick={async () => {
              try {
                const idToken = await (await import('../services/googleAuth')).requestGoogleToken();
                const response = await (await import('../services/api')).authService.googleLogin(idToken);
                const { token, user } = response.data;
                login(user, token, true);
                // Redirect
                setTimeout(() => { window.location.href = user.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard'; }, 200);
              } catch (err) {
                setError(err.message || 'Google sign-up failed');
              }
            }}
          >
            Sign up with Google
          </button>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="link">Sign in</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;