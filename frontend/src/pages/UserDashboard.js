import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activePolls, setActivePolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = useCallback(async () => {
    try {
      console.log('Starting to fetch dashboard data for user:', user);
      
      const [activePollsData, votedPollsData] = await Promise.all([
        userService.getActivePolls(),
        userService.getUserVotedPolls(user.id)
      ]);
      
      // Filter out polls user has already voted in from active polls
      const votedPollIds = new Set(votedPollsData.map(poll => poll.id));
      const availablePolls = activePollsData.filter(poll => !votedPollIds.has(poll.id));
      
      setActivePolls(availablePolls);
      setVotedPolls(votedPollsData);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(`Failed to load dashboard data: ${err.response?.data?.error || err.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

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
          <div className="spinner-border mb-4" role="status" style={{ width: '3rem', height: '3rem', color: '#00e5ff' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-white font-monospace">DECRYPTING SYSTEM GATEWAY...</h4>
          <p style={{ color: '#94a3b8' }}>Synchronizing local node data with Votex Cloud stream</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          
          {/* Welcome Banner Card */}
          <div className="card p-4 mb-4 border" style={{
            background: 'linear-gradient(135deg, rgba(11, 19, 38, 0.8) 0%, rgba(15, 23, 42, 0.85) 100%)',
            borderColor: 'rgba(0, 229, 255, 0.15)',
            boxShadow: 'var(--shadow-glass)'
          }}>
            <div className="d-flex flex-wrap justify-content-between align-items-center">
              <div>
                <span className="badge px-3 py-2 text-uppercase font-monospace border mb-2 d-inline-block" style={{
                  background: 'rgba(0, 229, 255, 0.05)',
                  borderColor: 'rgba(0, 229, 255, 0.2)',
                  color: '#00e5ff'
                }}>
                  Voter Console Node // {user?.id}
                </span>
                <h1 className="display-5 fw-bold text-white mb-1">
                  Welcome, {user?.firstName}!
                </h1>
                <p className="mb-0" style={{ color: '#94a3b8' }}>
                  Participate in active secure polls and audit verified ledger results.
                </p>
              </div>
              <div className="mt-3 mt-md-0 d-flex gap-2">
                <span className="badge px-3 py-2 text-uppercase font-monospace border d-flex align-items-center" style={{
                  background: 'rgba(16, 185, 129, 0.05)',
                  borderColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981'
                }}>
                  <span className="d-inline-block rounded-circle bg-pulse me-2" style={{
                    width: '6px',
                    height: '6px',
                    backgroundColor: '#10b981',
                    boxShadow: '0 0 6px #10b981',
                    animation: 'pulse 1.5s infinite'
                  }}></span>
                  Authenticated ✓
                </span>
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
            {/* Left Side: Poll Lists */}
            <div className="col-lg-8">
              
              {/* Available Polls Container */}
              <div className="card mb-4 border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(0, 229, 255, 0.15)'
              }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{
                  background: 'rgba(0, 229, 255, 0.03)',
                  borderBottom: '1px solid rgba(0, 229, 255, 0.15)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-list-ul me-2" style={{ color: '#00e5ff' }}></i>
                    Available Polls
                  </h5>
                  <span className="badge font-monospace" style={{ background: 'rgba(0, 229, 255, 0.15)', color: '#00e5ff', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
                    {activePolls.length} ACTIVE
                  </span>
                </div>
                <div className="card-body">
                  {activePolls.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-grid-3x3-gap-fill display-4 mb-3 d-block" style={{ color: 'rgba(0, 229, 255, 0.2)' }}></i>
                      <p style={{ color: '#94a3b8' }}>No available polls located in your jurisdiction segment.</p>
                      <p className="small" style={{ color: '#64748b' }}>Check back shortly for newly initialized streams.</p>
                    </div>
                  ) : (
                    <div className="row">
                      {activePolls.map((poll) => (
                        <div key={poll.id} className="col-md-6 mb-3">
                          <div className="card hover-lift h-100" style={{
                            background: 'rgba(15, 23, 42, 0.65)',
                            borderColor: 'rgba(0, 229, 255, 0.15)',
                            borderRadius: '12px'
                          }}>
                            <div className="card-body d-flex flex-column justify-content-between">
                              <div>
                                <h6 className="card-title fw-bold text-white mb-2" style={{ color: '#00e5ff' }}>{poll.title}</h6>
                                <p className="card-text small mb-4" style={{ color: '#94a3b8' }}>
                                  {poll.description?.substring(0, 100)}
                                  {poll.description?.length > 100 && '...'}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                  Initiated: {formatDate(poll.createdAt)}
                                </small>
                                <Link 
                                  to={`/user/poll/${poll.id}`} 
                                  className="btn btn-sm"
                                  style={{
                                    background: 'linear-gradient(135deg, #00e5ff 0%, #00b2cc 100%)',
                                    color: '#060b16',
                                    fontWeight: '600',
                                    borderRadius: '6px',
                                    border: 'none',
                                    padding: '5px 12px',
                                    fontSize: '0.8rem',
                                    textTransform: 'none'
                                  }}
                                >
                                  Cast Vote
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Voted Polls Container */}
              <div className="card border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(16, 185, 129, 0.15)'
              }}>
                <div className="card-header d-flex justify-content-between align-items-center" style={{
                  background: 'rgba(16, 185, 129, 0.03)',
                  borderBottom: '1px solid rgba(16, 185, 129, 0.15)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-check-circle me-2" style={{ color: '#10b981' }}></i>
                    Your Ledger Record
                  </h5>
                  <span className="badge font-monospace" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                    {votedPolls.length} ARCHIVED
                  </span>
                </div>
                <div className="card-body">
                  {votedPolls.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="bi bi-clipboard-x display-4 mb-3 d-block" style={{ color: 'rgba(16, 185, 129, 0.2)' }}></i>
                      <p style={{ color: '#94a3b8' }}>No recorded ledger votes casting associated with this node.</p>
                      <p className="small" style={{ color: '#64748b' }}>Cast your first vote in any active stream above.</p>
                    </div>
                  ) : (
                    <div className="row">
                      {votedPolls.map((poll) => (
                        <div key={poll.id} className="col-md-6 mb-3">
                          <div className="card hover-lift h-100" style={{
                            background: 'rgba(15, 23, 42, 0.65)',
                            borderColor: 'rgba(16, 185, 129, 0.15)',
                            borderRadius: '12px'
                          }}>
                            <div className="card-body d-flex flex-column justify-content-between">
                              <div>
                                <h6 className="card-title fw-bold text-white mb-2 d-flex justify-content-between align-items-start">
                                  <span>{poll.title}</span>
                                  <span className="badge bg-success-50 text-success border border-success small" style={{ fontSize: '0.65rem', padding: '3px 6px', background: 'rgba(16, 185, 129, 0.1)' }}>VOTED ✓</span>
                                </h6>
                                <p className="card-text small mb-4" style={{ color: '#94a3b8' }}>
                                  {poll.description?.substring(0, 100)}
                                  {poll.description?.length > 100 && '...'}
                                </p>
                              </div>
                              <div className="d-flex justify-content-between align-items-center pt-2" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                                <small style={{ color: '#64748b', fontSize: '0.75rem' }}>
                                  Casted: {formatDate(poll.createdAt)}
                                </small>
                                <Link
                                  to={`/user/poll/${poll.id}`}
                                  className="btn btn-sm btn-outline-success"
                                  style={{
                                    borderColor: 'rgba(16, 185, 129, 0.3)',
                                    color: '#10b981',
                                    fontWeight: '600',
                                    borderRadius: '6px',
                                    padding: '5px 12px',
                                    fontSize: '0.8rem',
                                    textTransform: 'none'
                                  }}
                                >
                                  View Live Stats
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right Side: Quick Action & Profile Specs */}
            <div className="col-lg-4">
              
              {/* Quick Actions Card */}
              <div className="card mb-4 border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(0, 229, 255, 0.15)'
              }}>
                <div className="card-header" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-info-circle me-2" style={{ color: '#00e5ff' }}></i>
                    Node Operations
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/user/polls" className="btn btn-outline-primary" style={{
                      borderColor: 'rgba(0, 229, 255, 0.25)',
                      color: '#00e5ff',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      letterSpacing: '0'
                    }}>
                      <i className="bi bi-list-ul me-2"></i>
                      View All Poll Streams
                    </Link>
                    <Link to={`/user/profile/${user?.id}`} className="btn btn-outline-secondary" style={{
                      borderColor: 'rgba(255, 255, 255, 0.15)',
                      color: '#e2e8f0',
                      borderRadius: '8px',
                      textTransform: 'none',
                      fontWeight: '600',
                      letterSpacing: '0'
                    }}>
                      <i className="bi bi-person me-2"></i>
                      Modify Profile Details
                    </Link>
                  </div>
                </div>
              </div>

              {/* Stats Widget Card */}
              <div className="card border" style={{
                background: 'rgba(11, 19, 38, 0.7)',
                borderColor: 'rgba(99, 102, 241, 0.15)'
              }}>
                <div className="card-header" style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-white fw-bold">
                    <i className="bi bi-bar-chart me-2" style={{ color: '#6366f1' }}></i>
                    Ledger Metrics
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6" style={{ borderRight: '1px solid rgba(255, 255, 255, 0.08)' }}>
                      <div>
                        <h4 className="mb-0 fw-bold" style={{ color: '#00e5ff', textShadow: '0 0 10px rgba(0, 229, 255, 0.2)' }}>
                          {activePolls.length}
                        </h4>
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Active Streams</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div>
                        <h4 className="mb-0 fw-bold" style={{ color: '#10b981', textShadow: '0 0 10px rgba(16, 185, 129, 0.2)' }}>
                          {votedPolls.length}
                        </h4>
                        <small style={{ color: '#64748b', fontSize: '0.75rem' }}>Ledger Casts</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
