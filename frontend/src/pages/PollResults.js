import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const PollResults = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [poll, setPoll] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (admin && pollId) {
      fetchPollResults();
    }
  }, [admin, pollId]);

  const fetchPollResults = async () => {
    try {
      const pollResults = await adminService.getPollResults(pollId);
      
      // Get poll details by finding it in admin polls
      const adminPolls = await adminService.getAdminPolls(admin.id);
      const currentPoll = adminPolls.find(p => p.id.toString() === pollId);
      
      if (!currentPoll) {
        setError('Poll not found or you do not have permission to view it.');
        return;
      }
      
      setPoll(currentPoll);
      setResults(pollResults);
      console.log('Poll results:', pollResults); // Debug logging
    } catch (err) {
      console.error('Error fetching poll results:', err);
      
      let errorMessage = 'Failed to load poll results';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.status === 404) {
        errorMessage = 'Poll not found. It may have been deleted or you may not have permission to view it.';
      } else if (err.response?.status === 500) {
        errorMessage = 'Server error occurred. Please try again later.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (voteCount, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
  };

  const getProgressBarColor = (index) => {
    const colors = ['primary', 'success', 'info', 'warning', 'secondary'];
    return colors[index % colors.length];
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

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning" role="alert">
          Poll not found or you don't have permission to view it.
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
              <h1 className="text-success">
                <i className="bi bi-bar-chart me-2"></i>
                Poll Results
              </h1>
              <p className="text-muted">Detailed analytics for your poll</p>
            </div>
            <div>
              <button 
                className="btn btn-outline-secondary me-2"
                onClick={() => navigate('/admin/polls')}
              >
                <i className="bi bi-arrow-left me-1"></i>
                Back to Polls
              </button>
              <button 
                className="btn btn-success"
                onClick={() => navigate('/admin/dashboard')}
              >
                <i className="bi bi-house-door me-1"></i>
                Dashboard
              </button>
            </div>
          </div>

          {/* Poll Information */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0">{poll.title}</h4>
                <span className={`badge ${poll.isActive ? 'bg-success' : 'bg-secondary'} fs-6`}>
                  {poll.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            <div className="card-body">
              {poll.description && (
                <p className="text-muted mb-3">{poll.description}</p>
              )}
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">
                    <i className="bi bi-calendar me-1"></i>
                    Created: {formatDate(poll.createdAt)}
                  </small>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">
                    <i className="bi bi-person me-1"></i>
                    By: {admin.firstName} {admin.lastName}
                  </small>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-8">
              {/* Results */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">
                    <i className="bi bi-pie-chart me-2"></i>
                    Voting Results
                  </h5>
                </div>
                <div className="card-body">
                  {results && results.options && results.options.length > 0 ? (
                    <div>
                      {results.options
                        .sort((a, b) => b.voteCount - a.voteCount) // Sort by vote count descending
                        .map((option, index) => {
                          const percentage = calculatePercentage(option.voteCount, results.totalVotes);
                          const progressColor = getProgressBarColor(index);
                          
                          return (
                            <div key={option.id} className="mb-4">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h6 className="mb-0">{option.optionText}</h6>
                                <div>
                                  <span className={`badge bg-${progressColor} me-2`}>
                                    {option.voteCount} votes
                                  </span>
                                  <span className="text-muted">{percentage}%</span>
                                </div>
                              </div>
                              <div className="progress mb-2" style={{ height: '25px' }}>
                                <div
                                  className={`progress-bar bg-${progressColor}`}
                                  role="progressbar"
                                  style={{ width: `${percentage}%` }}
                                  aria-valuenow={percentage}
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  {percentage}%
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        
                      {results.totalVotes === 0 && (
                        <div className="text-center py-4">
                          <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                          <p className="text-muted">No votes have been cast yet.</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="bi bi-exclamation-triangle display-4 text-muted mb-3"></i>
                      <p className="text-muted">Unable to load poll results.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-md-4">
              {/* Statistics */}
              <div className="card">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-graph-up me-2"></i>
                    Statistics
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-12 mb-3">
                      <h2 className="text-success mb-0">
                        {results?.totalVotes || 0}
                      </h2>
                      <small className="text-muted">Total Votes</small>
                    </div>
                  </div>
                  
                  <hr />
                  
                  <div className="row text-center">
                    <div className="col-6">
                      <h4 className="text-primary mb-0">
                        {results?.options?.length || 0}
                      </h4>
                      <small className="text-muted">Options</small>
                    </div>
                    <div className="col-6">
                      <h4 className="text-info mb-0">
                        {results?.options ? 
                          Math.round((results.totalVotes / results.options.length) * 100) / 100 
                          : 0}
                      </h4>
                      <small className="text-muted">Avg per Option</small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="card mt-4">
                <div className="card-header">
                  <h6 className="mb-0">
                    <i className="bi bi-gear me-2"></i>
                    Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button 
                      className="btn btn-outline-primary"
                      onClick={() => navigate(`/admin/poll/${pollId}/edit`)}
                    >
                      <i className="bi bi-pencil me-2"></i>
                      Edit Poll
                    </button>
                    
                    {poll.isActive ? (
                      <button 
                        className="btn btn-outline-warning"
                        onClick={async () => {
                          try {
                            await adminService.deactivatePoll(admin.id, pollId);
                            window.location.reload();
                          } catch (err) {
                            alert('Failed to deactivate poll');
                          }
                        }}
                      >
                        <i className="bi bi-pause me-2"></i>
                        Deactivate Poll
                      </button>
                    ) : (
                      <button 
                        className="btn btn-outline-success"
                        onClick={async () => {
                          try {
                            await adminService.activatePoll(admin.id, pollId);
                            window.location.reload();
                          } catch (err) {
                            alert('Failed to activate poll');
                          }
                        }}
                      >
                        <i className="bi bi-play me-2"></i>
                        Activate Poll
                      </button>
                    )}
                    
                    <button 
                      className="btn btn-outline-info"
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
                </div>
              </div>

              {/* Winner */}
              {results?.options && results.totalVotes > 0 && (
                <div className="card mt-4">
                  <div className="card-header bg-success text-white">
                    <h6 className="mb-0">
                      <i className="bi bi-trophy me-2"></i>
                      Leading Option
                    </h6>
                  </div>
                  <div className="card-body">
                    {(() => {
                      const winner = results.options.reduce((prev, current) => 
                        (prev.voteCount > current.voteCount) ? prev : current
                      );
                      const winnerPercentage = calculatePercentage(winner.voteCount, results.totalVotes);
                      
                      return (
                        <div className="text-center">
                          <h5 className="text-success">{winner.optionText}</h5>
                          <p className="mb-0">
                            <strong>{winner.voteCount} votes ({winnerPercentage}%)</strong>
                          </p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollResults;
