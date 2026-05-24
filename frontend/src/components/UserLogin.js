import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { parseValidationErrors } from '../utils/validationUtils';

const UserLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await userService.loginUser({
        email: formData.email,
        password: formData.password
      });
      
      if (response.user) {
        loginUser(response.user);
        navigate('/user/dashboard');
      } else {
        setError('Login failed. Invalid response from server.');
      }
    } catch (err) {
      const errorInfo = parseValidationErrors(err);
      setError(errorInfo.generalMessage || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-bg-particles">
        {Array.from({ length: 15 }, (_, i) => (
          <div 
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 4}px`,
              height: `${Math.random() * 6 + 4}px`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${Math.random() * 4 + 4}s`
            }}
          />
        ))}
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="signup-card fade-in">
              <div className="signup-header user">
                <div className="signup-icon user">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>
                <h1 className="signup-title user">Voter Login</h1>
                <p className="signup-subtitle">Sign in to Votex secure stream gateway</p>
              </div>

              {error && (
                <div className="mx-4 mb-0">
                  <div className="alert alert-modern alert-danger font-monospace" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="form-floating user">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    required
                  />
                  <label htmlFor="email">
                    <i className="bi bi-envelope-fill me-2"></i>Email Address
                  </label>
                </div>

                <div className="form-floating user">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                  />
                  <label htmlFor="password">
                    <i className="bi bi-lock-fill me-2"></i>Password
                  </label>
                </div>

                <button
                  type="submit"
                  className="signup-btn user w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Authenticating Node...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Sign In
                    </>
                  )}
                </button>

                <div className="signup-footer">
                  <p className="mb-2" style={{ color: '#94a3b8' }}>
                    Don't have a registered node?{' '}
                    <Link to="/user/register" className="signup-link user">
                      Register here
                    </Link>
                  </p>
                  <p className="mb-0">
                    <Link to="/admin/login" className="signup-link" style={{ color: '#818cf8' }}>
                      Admin Console Gateway
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
