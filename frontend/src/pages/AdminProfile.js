import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const AdminProfile = () => {
  const { adminId } = useParams();
  const navigate = useNavigate();
  const { admin, loginAdmin } = useAuth();
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

  useEffect(() => {
    if (admin && admin.id.toString() === adminId) {
      setProfileData({
        username: admin.username || '',
        email: admin.email || '',
        firstName: admin.firstName || '',
        lastName: admin.lastName || ''
      });
      setLoading(false);
    } else {
      // Fetch admin data if not current admin or data not available
      fetchAdminData();
    }
  }, [admin, adminId]);

  const fetchAdminData = async () => {
    try {
      const adminData = await adminService.getAdminById(adminId);
      setProfileData({
        username: adminData.username || '',
        email: adminData.email || '',
        firstName: adminData.firstName || '',
        lastName: adminData.lastName || ''
      });
    } catch (err) {
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updatedAdmin = await adminService.updateAdmin(adminId, profileData);
      
      // Update the auth context with new data
      if (admin && admin.id.toString() === adminId) {
        loginAdmin(updatedAdmin);
      }
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update profile';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    if (admin && admin.id.toString() === adminId) {
      setProfileData({
        username: admin.username || '',
        email: admin.email || '',
        firstName: admin.firstName || '',
        lastName: admin.lastName || ''
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
          <div className="spinner-border text-success" role="status">
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
                <h4 className="mb-0 text-success">
                  <i className="bi bi-person-circle me-2"></i>
                  Admin Profile
                </h4>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/admin/dashboard')}
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
                      className="form-control"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="username" className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control"
                    id="username"
                    name="username"
                    value={profileData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your username"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Enter your email"
                  />
                </div>

                <div className="d-flex gap-2">
                  {!isEditing ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => setIsEditing(true)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Profile
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        className="btn btn-success"
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
                    <i className="bi bi-shield-check me-1"></i>
                    Admin Account
                  </small>
                </div>
                <div className="col-md-6">
                  <small>
                    <i className="bi bi-calendar me-1"></i>
                    Member since {admin?.createdAt ? new Date(admin.createdAt).getFullYear() : 'N/A'}
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Account Settings
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
                  className="btn btn-outline-info"
                  onClick={() => navigate('/admin/polls')}
                >
                  <i className="bi bi-list-ul me-2"></i>
                  Manage My Polls
                </button>
                <button 
                  className="btn btn-outline-primary"
                  onClick={() => navigate('/admin/create-poll')}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Poll
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
