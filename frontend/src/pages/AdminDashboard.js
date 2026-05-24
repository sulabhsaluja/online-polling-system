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
  }, [admin]); // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleActivatePoll = async (pollId) => {
    try {
      await adminService.activatePoll(admin.id, pollId);
      await fetchAdminPolls(); // Refresh data
    } catch (err) {
      setError('Failed to activate poll');
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
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center" style={{ background: 'var(--bg-primary)' }}>
        <div className="text-center">
          <div className="spinner-border mb-4" role="status" style={{ width: '3rem', height: '3rem', color: '#6366f1' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-white font-monospace">INITIALIZING ADMIN CONTROL BRIDGE...</h4>
          <p style={{ color: '#94a3b8' }}>Synchronizing local node data with Votex Cloud stream</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          
          {/* Header Actions banner */}
          <div className="card p-4 mb-4 border" style={{
            background: 'linear-gradient(135deg, rgba(11, 19, 38, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderColor: 'rgba(99, 102, 241, 0.15)',
            boxShadow: 'var(--shadow-glass)'
          }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <span className="badge px-3 py-2 text-uppercase font-monospace border mb-2 d-inline-block" style={{
                  background: 'rgba(99, 102, 241, 0.05)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  color: '#818cf8'
                }}>
                  Admin Control Node // {admin?.id}
                </span>
                <h1 className="display-5 fw-bold text-white mb-1">
                  Welcome, {admin?.firstName}!
                </h1>
                <p className="mb-0" style={{ color: '#94a3b8' }}>
                  Manage authorized polls, configure cryptographic segments, and audit voters ledgers.
                </p>
              </div>
              <div className="mt-3 mt-md-0 d-flex gap-2">
                <Link to="/admin/create-poll" className="btn text-white px-4" style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                  boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  textTransform: 'none'
                }}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Poll
                </Link>
              </div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger font-monospace border-danger mb-4" role="alert" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              SYSTEM_ERROR: {error}
            </div>
          )}

          <div className="row">
            {/* Left Side: Poll Management Table */}
            <div className="col-lg-8">
              
              <div className="card mb-4 border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(99, 102, 241, 0.15)'
              }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{
                  background: 'rgba(99, 102, 241, 0.03)',
                  borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-list-ul me-2" style={{ color: '#818cf8' }}></i>
                    Active System Polls
                  </h5>
                  <span className="badge font-monospace" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                    {polls.length} TOTAL
                  </span>
                </div>
                <div className="card-body">
                  {polls.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-grid-3x3-gap display-4 mb-3 d-block" style={{ color: 'rgba(99, 102, 241, 0.2)' }}></i>
                      <p style={{ color: '#94a3b8' }}>No polls located in this admin segment.</p>
                      <Link to="/admin/create-poll" className="btn btn-sm btn-outline-primary" style={{ textTransform: 'none' }}>
                        Create Your First Poll
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle" style={{ color: '#e2e8f0' }}>
                        <thead>
                          <tr style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
                            <th style={{ color: '#818cf8', fontWeight: '600' }}>Poll Title</th>
                            <th style={{ color: '#818cf8', fontWeight: '600' }}>State</th>
                            <th style={{ color: '#818cf8', fontWeight: '600' }}>Initiated</th>
                            <th className="text-end" style={{ color: '#818cf8', fontWeight: '600' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {polls.map((poll) => (
                            <tr key={poll.id} style={{ borderColor: 'rgba(255, 255, 255, 0.05)' }}>
                              <td>
                                <strong className="text-white d-block">{poll.title}</strong>
                                {poll.description && (
                                  <small style={{ color: '#94a3b8' }}>
                                    {poll.description.substring(0, 50)}
                                    {poll.description.length > 50 && '...'}
                                  </small>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${poll.isActive ? 'bg-success' : 'bg-secondary'}`} style={{
                                  background: poll.isActive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                  color: poll.isActive ? '#10b981' : '#94a3b8',
                                  border: poll.isActive ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                                }}>
                                  {poll.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td style={{ color: '#94a3b8', fontSize: '0.85rem' }}>{formatDate(poll.createdAt)}</td>
                              <td className="text-end">
                                <div className="btn-group">
                                  <Link
                                    to={`/admin/poll/${poll.id}/results`}
                                    className="btn btn-outline-info border"
                                    title="View Results"
                                    style={{ borderColor: 'rgba(0, 229, 255, 0.2)', color: '#00e5ff', background: 'rgba(0, 229, 255, 0.02)' }}
                                  >
                                    <i className="bi bi-bar-chart"></i>
                                  </Link>
                                  <Link
                                    to={`/admin/poll/${poll.id}/edit`}
                                    className="btn btn-outline-primary border"
                                    title="Edit Poll"
                                    style={{ borderColor: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', background: 'rgba(99, 102, 241, 0.02)' }}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Link>
                                  {poll.isActive ? (
                                    <button
                                      className="btn btn-outline-warning border"
                                      onClick={() => handleDeactivatePoll(poll.id)}
                                      title="Deactivate Poll"
                                      style={{ borderColor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', background: 'rgba(245, 158, 11, 0.02)' }}
                                    >
                                      <i className="bi bi-pause"></i>
                                    </button>
                                  ) : (
                                    <button
                                      className="btn btn-outline-success border"
                                      onClick={() => handleActivatePoll(poll.id)}
                                      title="Activate Poll"
                                      style={{ borderColor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', background: 'rgba(16, 185, 129, 0.02)' }}
                                    >
                                      <i className="bi bi-play"></i>
                                    </button>
                                  )}
                                  <button
                                    className="btn btn-outline-danger border"
                                    onClick={() => handleDeletePoll(poll.id)}
                                    title="Delete Poll"
                                    style={{ borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', background: 'rgba(239, 68, 68, 0.02)' }}
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

            {/* Right Side: Operations & Control Stats */}
            <div className="col-lg-4">
              
              {/* Operations Quick Card */}
              <div className="card mb-4 border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(99, 102, 241, 0.15)'
              }}>
                <div className="card-header" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-info-circle me-2" style={{ color: '#818cf8' }}></i>
                    Console Operations
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/admin/create-poll" className="btn btn-outline-primary" style={{
                      borderColor: 'rgba(99, 102, 241, 0.25)',
                      color: '#818cf8',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      letterSpacing: '0'
                    }}>
                      <i className="bi bi-plus-circle me-2"></i>
                      Initialize New Stream
                    </Link>
                    <Link to={`/admin/profile/${admin?.id}`} className="btn btn-outline-secondary" style={{
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      color: '#e2e8f0',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      letterSpacing: '0'
                    }}>
                      <i className="bi bi-person me-2"></i>
                      Modify Credentials
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Widget */}
              <div className="card mb-4 border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(99, 102, 241, 0.15)'
              }}>
                <div className="card-header" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-bar-chart me-2" style={{ color: '#6366f1' }}></i>
                    Ledger Summary
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6" style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <h4 className="mb-0 fw-bold" style={{ color: '#818cf8', textShadow: '0 0 10px rgba(99, 102, 241, 0.2)' }}>
                          {polls.length}
                        </h4>
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Total Pools</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <h4 className="mb-0 fw-bold" style={{ color: '#10b981', textShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                          {activePolls.length}
                        </h4>
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Active Streams</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips Widget Card */}
              <div className="card border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(255, 255, 255, 0.08)'
              }}>
                <div className="card-header" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-lightbulb me-2" style={{ color: '#f59e0b' }}></i>
                    Compliance Guidelines
                  </h6>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled small mb-0" style={{ color: '#94a3b8' }}>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Confirm options size fits voter UI cards.
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Deactivate inactive segments immediately.
                    </li>
                    <li className="mb-0">
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Payload constraints must meet JSR-380.
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
