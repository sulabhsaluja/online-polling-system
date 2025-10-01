import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { parseValidationErrors, getFieldClass, validateField } from '../utils/validationUtils';
import { ValidationFeedback } from './ValidationFeedback';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';

const UserRegister = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: ''
  });
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
    
    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur for immediate feedback
    const fieldErrors = validateField(name, value);
    if (fieldErrors.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName
      };

      const createdUser = await userService.registerUser(userData);
      loginUser(createdUser);
      navigate('/user/dashboard');
    } catch (err) {
      const errorInfo = parseValidationErrors(err);
      setError(errorInfo.generalMessage);
      setFieldErrors(errorInfo.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container bg-gradient-user">
      <div className="signup-bg-particles">
        {Array.from({ length: 20 }, (_, i) => (
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
          <div className="col-lg-10 col-xl-8">
            <div className="signup-card fade-in">
              <div className="signup-header user">
                <div className="signup-icon user">
                  <i className="bi bi-person-plus"></i>
                </div>
                <h1 className="signup-title user">User Registration</h1>
                <p className="signup-subtitle">Join our community and start voting on polls</p>
              </div>

              {error && (
                <div className="mx-4 mb-0">
                  <div className="alert alert-modern alert-danger" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="signup-form">
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating user">
                      <input
                        type="text"
                        className={getFieldClass('firstName', fieldErrors, touchedFields.firstName)}
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="First Name"
                        required
                      />
                      <label htmlFor="firstName">
                        <i className="bi bi-person-fill me-2"></i>First Name
                      </label>
                      <ValidationFeedback fieldName="firstName" fieldErrors={fieldErrors} />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating user">
                      <input
                        type="text"
                        className={getFieldClass('lastName', fieldErrors, touchedFields.lastName)}
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Last Name"
                        required
                      />
                      <label htmlFor="lastName">
                        <i className="bi bi-person-fill me-2"></i>Last Name
                      </label>
                      <ValidationFeedback fieldName="lastName" fieldErrors={fieldErrors} />
                    </div>
                  </div>
                </div>

                <div className="form-floating user">
                  <input
                    type="text"
                    className={getFieldClass('username', fieldErrors, touchedFields.username)}
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Username"
                    required
                  />
                  <label htmlFor="username">
                    <i className="bi bi-at me-2"></i>Username
                  </label>
                  <ValidationFeedback fieldName="username" fieldErrors={fieldErrors} />
                </div>

                <div className="form-floating user">
                  <input
                    type="email"
                    className={getFieldClass('email', fieldErrors, touchedFields.email)}
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email Address"
                    required
                  />
                  <label htmlFor="email">
                    <i className="bi bi-envelope-fill me-2"></i>Email Address
                  </label>
                  <ValidationFeedback fieldName="email" fieldErrors={fieldErrors} />
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-floating user">
                      <input
                        type="password"
                        className={getFieldClass('password', fieldErrors, touchedFields.password)}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Password"
                        minLength="8"
                        required
                      />
                      <label htmlFor="password">
                        <i className="bi bi-lock-fill me-2"></i>Password
                      </label>
                      <ValidationFeedback fieldName="password" fieldErrors={fieldErrors} />
                    </div>
                    <PasswordStrengthIndicator password={formData.password} />
                  </div>
                  <div className="col-md-6">
                    <div className="form-floating user">
                      <input
                        type="password"
                        className={getFieldClass('confirmPassword', fieldErrors, touchedFields.confirmPassword)}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="Confirm Password"
                        minLength="8"
                        required
                      />
                      <label htmlFor="confirmPassword">
                        <i className="bi bi-shield-lock-fill me-2"></i>Confirm Password
                      </label>
                      <ValidationFeedback 
                        fieldName="confirmPassword" 
                        fieldErrors={fieldErrors} 
                        showRequirements={false}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="signup-btn user w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="loading-spinner me-2"></span>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-person-plus-fill me-2"></i>
                      Create User Account
                    </>
                  )}
                </button>

                <div className="signup-footer">
                  <p className="mb-0">
                    Already have an account?{' '}
                    <Link to="/user/login" className="signup-link user">
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Sign In Here
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

export default UserRegister;
