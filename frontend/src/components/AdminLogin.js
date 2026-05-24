import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import { parseValidationErrors } from '../utils/validationUtils';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
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
      const response = await adminService.loginAdmin({
        email: formData.email,
        password: formData.password
      });
      
      if (response.admin) {
        loginAdmin(response.admin);
        navigate('/admin/dashboard');
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
              animationDuration: `${Math.random() * 4 + 4}s`,
              background: 'rgba(99, 102, 241, 0.08)'
            }}
          />
        ))}
      </div>
      
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5 col-xl-4">
            <div className="signup-card fade-in" style={{ borderColor: 'rgba(99, 102, 241, 0.15)' }}>
              <div className="signup-header">
                <div className="signup-icon">
                  <i className="bi bi-cpu-fill"></i>
                </div>
                <h1 className="signup-title">Admin Console</h1>
                <p className="signup-subtitle">Authorized orchestration gateway only</p>
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
                <div className="form-floating">
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
                    <i className="bi bi-envelope-fill me-2"></i>Admin Email
                  </label>
                </div>

                <div className="form-floating">
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
                  className="signup-btn w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Authorizing...
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
                    Authorized Node registration required?{' '}
                    <Link to="/admin/register" className="signup-link">
                      Register node
                    </Link>
                  </p>
                  <p className="mb-0">
                    <Link to="/user/login" className="signup-link user" style={{ color: '#00e5ff' }}>
                      Voter Secure Gateway
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

export default AdminLogin;
