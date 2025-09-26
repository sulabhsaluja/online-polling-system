import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { parseValidationErrors, getFieldClass, validateField } from '../utils/validationUtils';
import { ValidationFeedback } from '../components/ValidationFeedback';

const UserProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, loginUser } = useAuth();
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [userStats, setUserStats] = useState({
    totalVotes: 0,
    pollsParticipated: 0
  });

  useEffect(() => {
    if (user && user.id.toString() === userId) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
      setLoading(false);
    } else {
      // Fetch user data if not current user or data not available
      fetchUserData();
    }
  }, [user, userId]);

  const fetchUserData = async () => {
    try {
      const userData = await userService.getUserById(userId);
      setProfileData({
        username: userData.username || '',
        email: userData.email || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || ''
      });
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
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

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedUser = await userService.updateUser(userId, profileData);
      
      // Update the auth context with new data
      if (user && user.id.toString() === userId) {
        loginUser(updatedUser);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const errorInfo = parseValidationErrors(err);
      setError(errorInfo.generalMessage);
      setFieldErrors(errorInfo.fieldErrors);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (user && user.id.toString() === userId) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-primary">
                  <i className="bi bi-person-circle me-2"></i>
                  User Profile
                </h4>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/user/dashboard')}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>

            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input
                      type="text"
                      className={getFieldClass('firstName', fieldErrors, touchedFields.firstName)}
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                    {isEditing && <ValidationFeedback fieldName="firstName" fieldErrors={fieldErrors} />}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className={getFieldClass('lastName', fieldErrors, touchedFields.lastName)}
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                    {isEditing && <ValidationFeedback fieldName="lastName" fieldErrors={fieldErrors} />}
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className={getFieldClass('username', fieldErrors, touchedFields.username)}
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={!isEditing}
                    placeholder="Enter your username"
                  />
                  {isEditing && <ValidationFeedback fieldName="username" fieldErrors={fieldErrors} />}
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className={getFieldClass('email', fieldErrors, touchedFields.email)}
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                  {isEditing && <ValidationFeedback fieldName="email" fieldErrors={fieldErrors} />}
                </div>

                <div className="d-flex gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Save Changes
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={handleCancel}
                        disabled={saving}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </form>
            </div>

            <div className="card-footer">
              <div className="row text-center text-muted">
                <div className="col-md-6">
                  <small>
                    <i className="bi bi-person-check me-1"></i>
                    User Account
                  </small>
                </div>
                <div className="col-md-6">
                  <small>
                    <i className="bi bi-calendar me-1"></i>
                    Member since {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* User Statistics */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-bar-chart me-2"></i>
                Your Activity
              </h6>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-6">
                  <div className="border-end">
                    <h4 className="text-primary mb-0">{userStats.totalVotes}</h4>
                    <small className="text-muted">Total Votes Cast</small>
                  </div>
                </div>
                <div className="col-md-6">
                  <h4 className="text-success mb-0">{userStats.pollsParticipated}</h4>
                  <small className="text-muted">Polls Participated</small>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Quick Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-outline-warning"
                  onClick={() => alert('Password change functionality would be implemented here')}
                >
                  <i className="bi bi-key me-2"></i>
                  Change Password
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/user/polls')}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Browse All Polls
                </button>
                <button 
                  className="btn btn-outline-info"
                  onClick={() => navigate('/user/dashboard')}
                >
                  <i className="bi bi-house-door me-2"></i>
                  Go to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
