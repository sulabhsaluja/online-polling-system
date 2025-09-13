import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activePolls, setActivePolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const [activePolls, votedPolls] = await Promise.all([
        userService.getActivePolls(),
        userService.getUserVotedPolls(user.id)
      ]);
      
      // Filter out polls user has already voted in from active polls
      const votedPollIds = new Set(votedPolls.map(poll => poll.id));
      const availablePolls = activePolls.filter(poll => !votedPollIds.has(poll.id));
      
      setActivePolls(availablePolls);
      setVotedPolls(votedPolls);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
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
          <div className="spinner-border text-primary" role="status">
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
              <h1 className="text-primary">Welcome, {user?.firstName}!</h1>
              <p className="text-muted">Participate in active polls and make your voice heard</p>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <div className="row">
            <div className="col-md-8">
              {/* Available Polls */}
              <div className="card mb-4">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Available Polls ({activePolls.length})
                  </h5>
                </div>
                <div className="card-body">
                  {activePolls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                      <p className="text-muted">No new polls available at the moment.</p>
                      <p className="text-muted">Check back later!</p>
                    </div>
                  ) : (
                    <div className="row">
                      {activePolls.map((poll) => (
                        <div key={poll.id} className="col-md-6 mb-3">
                          <div className="card border-primary">
                            <div className="card-body">
                              <h6 className="card-title">{poll.title}</h6>
                              <p className="card-text text-muted small">
                                {poll.description?.substring(0, 100)}
                                {poll.description?.length > 100 && '...'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  Created: {formatDate(poll.createdAt)}
                                </small>
                                <Link 
                                  to={`/user/poll/${poll.id}`} 
                                  className="btn btn-primary btn-sm"
                                >
                                  Vote Now
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
              
              {/* Voted Polls */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    Your Votes ({votedPolls.length})
                  </h5>
                </div>
                <div className="card-body">
                  {votedPolls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-ballot display-4 text-muted mb-3"></i>
                      <p className="text-muted">You haven't voted in any polls yet.</p>
                      <p className="text-muted">Cast your first vote above!</p>
                    </div>
                  ) : (
                    <div className="row">
                      {votedPolls.map((poll) => (
                        <div key={poll.id} className="col-md-6 mb-3">
                          <div className="card border-success">
                            <div className="card-body">
                              <h6 className="card-title">
                                {poll.title}
                                <span className="badge bg-success ms-2 small">Voted</span>
                              </h6>
                              <p className="card-text text-muted small">
                                {poll.description?.substring(0, 100)}
                                {poll.description?.length > 100 && '...'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  Created: {formatDate(poll.createdAt)}
                                </small>
                                <button 
                                  className="btn btn-outline-success btn-sm"
                                  onClick={() => window.open(`/user/polls/${poll.id}/results`, '_blank')}
                                >
                                  View Results
                                </button>
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
                    <Link to="/user/polls" className="btn btn-outline-primary">
                      <i className="bi bi-list-ul me-2"></i>
                      View All Polls
                    </Link>
                    <Link to={`/user/profile/${user?.id}`} className="btn btn-outline-secondary">
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
                    Your Stats
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="text-primary mb-0">{activePolls.length}</h4>
                        <small className="text-muted">Available Polls</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="text-success mb-0">{votedPolls.length}</h4>
                      <small className="text-muted">Votes Cast</small>
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
