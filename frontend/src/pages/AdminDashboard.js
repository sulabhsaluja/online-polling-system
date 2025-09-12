import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const AdminDashboard = () => {
  const { admin } = useAuth();
  const [polls, setPolls] = useState([]);
  const [activePolls, setActivePolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin) {
      fetchAdminPolls();
    }
  }, [admin]);

  const fetchAdminPolls = async () => {
    try {
      const [allPolls, adminActivePolls] = await Promise.all([
        adminService.getAdminPolls(admin.id),
        adminService.getActiveAdminPolls(admin.id)
      ]);
      setPolls(allPolls);
      setActivePolls(adminActivePolls);
    } catch (err) {
      setError('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivatePoll = async (pollId) => {
    try {
      await adminService.deactivatePoll(admin.id, pollId);
      await fetchAdminPolls(); // Refresh data
    } catch (err) {
      setError('Failed to deactivate poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        await adminService.deletePoll(admin.id, pollId);
        await fetchAdminPolls(); // Refresh data
      } catch (err) {
        setError('Failed to delete poll');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-success">Welcome, {admin?.firstName}!</h1>
              <p className="text-muted">Manage your polls and analyze responses</p>
            </div>
            <Link to="/admin/create-poll" className="btn btn-success">
              <i className="bi bi-plus-circle me-2"></i>
              Create New Poll
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Your Polls ({polls.length})
                  </h5>
                </div>
                <div className="card-body">
                  {polls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                      <p className="text-muted">You haven't created any polls yet.</p>
                      <Link to="/admin/create-poll" className="btn btn-success">
                        Create Your First Poll
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {polls.map((poll) => (
                            <tr key={poll.id}>
                              <td>
                                <strong>{poll.title}</strong>
                                {poll.description && (
                                  <>
                                    <br />
                                    <small className="text-muted">
                                      {poll.description.substring(0, 50)}
                                      {poll.description.length > 50 && '...'}
                                    </small>
                                  </>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${poll.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                  {poll.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>{formatDate(poll.createdAt)}</td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <Link
                                    to={`/admin/poll/${poll.id}/results`}
                                    className="btn btn-outline-info"
                                    title="View Results"
                                  >
                                    <i className="bi bi-bar-chart"></i>
                                  </Link>
                                  <Link
                                    to={`/admin/poll/${poll.id}/edit`}
                                    className="btn btn-outline-primary"
                                    title="Edit Poll"
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  {poll.isActive && (
                                    <button
                                      className="btn btn-outline-warning"
                                      onClick={() => handleDeactivatePoll(poll.id)}
                                      title="Deactivate Poll"
                                    >
                                      <i className="bi bi-pause"></i>
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-outline-danger"
                                    onClick={() => handleDeletePoll(poll.id)}
                                    title="Delete Poll"
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card bg-light">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/admin/create-poll" className="btn btn-success">
                      <i className="bi bi-plus-circle me-2"></i>
                      Create Poll
                    </Link>
                    <Link to="/admin/polls" className="btn btn-outline-success">
                      <i className="bi bi-list-ul me-2"></i>
                      Manage Polls
                    </Link>
                    <Link to={`/admin/profile/${admin?.id}`} className="btn btn-outline-secondary">
                      <i className="bi bi-person me-2"></i>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-bar-chart me-2"></i>
                    Your Statistics
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="text-success mb-0">{polls.length}</h4>
                        <small className="text-muted">Total Polls</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="text-primary mb-0">{activePolls.length}</h4>
                      <small className="text-muted">Active Polls</small>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card mt-3">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-lightbulb me-2"></i>
                    Tips
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled small mb-0">
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Use clear, concise poll titles
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Provide detailed descriptions
                    </li>
                    <li className="mb-0">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Monitor results regularly
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
