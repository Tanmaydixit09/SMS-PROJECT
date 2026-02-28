import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import '../styles/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);

  const { login } = useAuth();
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((s) => !s);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      const { token, user } = response.data;
      login(user, token, remember);
      navigate(user.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Student Management System</h2>
        <h3>Welcome back</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-row">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
              <button type="button" className="toggle-password" onClick={toggleShowPassword}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-row">
            <label className="remember">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me
            </label>
            <Link to="#" className="forgot">Forgot?</Link>
          </div>

          <button type="submit" disabled={loading} className="primary-btn">
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="divider">or</div>

          <button
            type="button"
            className="social-btn"
            onClick={async () => {
              try {
                const idToken = await (await import('../services/googleAuth')).requestGoogleToken();
                const response = await (await import('../services/api')).authService.googleLogin(idToken);
                const { token, user } = response.data;
                login(user, token);
                navigate(user.role === 'Admin' ? '/admin/dashboard' : '/student/dashboard');
              } catch (err) {
                setError(err.message || 'Google sign-in failed');
              }
            }}
          >
            Sign in with Google
          </button>

          <div className="auth-footer">
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/forgot" className="link">Forgot password?</Link>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span>Don't have an account?</span>
              <Link to="/register" className="link">Sign up</Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
