import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const EditPoll = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [poll, setPoll] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (admin && pollId) {
      fetchPoll();
    }
  }, [admin, pollId]);

  const fetchPoll = async () => {
    try {
      // Get poll details by finding it in admin polls
      const adminPolls = await adminService.getAdminPolls(admin.id);
      const currentPoll = adminPolls.find(p => p.id.toString() === pollId);
      
      if (currentPoll) {
        setPoll(currentPoll);
        setFormData({
          title: currentPoll.title || '',
          description: currentPoll.description || ''
        });
      } else {
        setError('Poll not found or you don\'t have permission to edit it.');
      }
    } catch (err) {
      setError('Failed to load poll data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title.trim()) {
      setError('Poll title is required');
      setSaving(false);
      return;
    }

    try {
      const updatedData = {
        title: formData.title.trim(),
        description: formData.description.trim()
      };

      await adminService.updatePoll(admin.id, pollId, updatedData);
      setSuccess('Poll updated successfully!');
      
      // Update local state
      setPoll({
        ...poll,
        ...updatedData
      });
      
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to update poll';
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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

  if (error && !poll) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button 
          className="btn btn-secondary"
          onClick={() => navigate('/admin/polls')}
        >
          <i className="bi bi-arrow-left me-1"></i>
          Back to Polls
        </button>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-success">
                  <i className="bi bi-pencil me-2"></i>
                  Edit Poll
                </h4>
                <div>
                  <button 
                    className="btn btn-outline-secondary btn-sm me-2"
                    onClick={() => navigate(`/admin/poll/${pollId}/results`)}
                  >
                    <i className="bi bi-bar-chart me-1"></i>
                    View Results
                  </button>
                  <button 
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => navigate('/admin/polls')}
                  >
                    <i className="bi bi-arrow-left me-1"></i>
                    Back to Polls
                  </button>
                </div>
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

              {/* Poll Info */}
              {poll && (
                <div className="alert alert-info mb-4">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Poll Status:</strong>
                      <span className={`badge ms-2 ${poll.isActive ? 'bg-success' : 'bg-secondary'}`}>
                        {poll.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <small className="text-muted">
                      Created: {formatDate(poll.createdAt)}
                    </small>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Poll Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter a clear, concise poll title"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Provide additional context or instructions (optional)"
                  ></textarea>
                </div>

                <div className="alert alert-warning">
                  <h6 className="alert-heading">
                    <i className="bi bi-info-circle me-2"></i>
                    Note about Poll Options
                  </h6>
                  <p className="mb-0">
                    Poll options cannot be modified after creation to preserve voting integrity. 
                    If you need to change the options, please create a new poll.
                  </p>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => navigate('/admin/polls')}
                      disabled={saving}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Update Poll
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Preview */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-eye me-2"></i>
                Preview
              </h6>
            </div>
            <div className="card-body">
              <h5>{formData.title || 'Poll Title'}</h5>
              {formData.description && (
                <p className="text-muted">{formData.description}</p>
              )}
              <div className="mt-3">
                <p className="text-muted small">
                  <i className="bi bi-info-circle me-1"></i>
                  Poll options will be displayed here when users vote.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-gear me-2"></i>
                Poll Actions
              </h6>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-info w-100"
                    onClick={() => navigate(`/admin/poll/${pollId}/results`)}
                  >
                    <i className="bi bi-bar-chart me-2"></i>
                    View Results
                  </button>
                </div>
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-primary w-100"
                    onClick={() => {
                      const shareUrl = `${window.location.origin}/user/poll/${pollId}`;
                      navigator.clipboard.writeText(shareUrl);
                      alert('Poll URL copied to clipboard!');
                    }}
                  >
                    <i className="bi bi-share me-2"></i>
                    Share Poll
                  </button>
                </div>
                {poll && (
                  <div className="col-md-6 mb-2">
                    {poll.isActive ? (
                      <button 
                        className="btn btn-outline-warning w-100"
                        onClick={async () => {
                          try {
                            await adminService.deactivatePoll(admin.id, pollId);
                            setPoll({...poll, isActive: false});
                            setSuccess('Poll deactivated successfully!');
                          } catch (err) {
                            setError('Failed to deactivate poll');
                          }
                        }}
                      >
                        <i className="bi bi-pause me-2"></i>
                        Deactivate Poll
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline-success w-100"
                        onClick={async () => {
                          try {
                            await adminService.activatePoll(admin.id, pollId);
                            setPoll({...poll, isActive: true});
                            setSuccess('Poll activated successfully!');
                          } catch (err) {
                            setError('Failed to activate poll');
                          }
                        }}
                      >
                        <i className="bi bi-play me-2"></i>
                        Activate Poll
                      </button>
                    )}
                  </div>
                )}
                <div className="col-md-6 mb-2">
                  <button 
                    className="btn btn-outline-danger w-100"
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
                        try {
                          await adminService.deletePoll(admin.id, pollId);
                          navigate('/admin/polls');
                        } catch (err) {
                          setError('Failed to delete poll');
                        }
                      }
                    }}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Delete Poll
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPoll;
