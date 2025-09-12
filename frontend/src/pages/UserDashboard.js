import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activePolls, setActivePolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivePolls();
  }, []);

  const fetchActivePolls = async () => {
    try {
      const polls = await userService.getActivePolls();
      setActivePolls(polls);
    } catch (err) {
      setError('Failed to load polls');
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
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-list-ul me-2"></i>
                    Active Polls ({activePolls.length})
                  </h5>
                </div>
                <div className="card-body">
                  {activePolls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                      <p className="text-muted">No active polls available at the moment.</p>
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
                      <h4 className="text-success mb-0">0</h4>
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
