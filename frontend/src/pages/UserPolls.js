import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const UserPolls = () => {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, title

  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    filterAndSortPolls();
  }, [polls, searchTerm, sortBy]);

  const fetchPolls = async () => {
    try {
      const activePolls = await userService.getActivePolls();
      setPolls(activePolls);
    } catch (err) {
      setError('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortPolls = () => {
    let filtered = polls;

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort polls
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    setFilteredPolls(filtered);
  };

  const checkIfVoted = async (pollId) => {
    try {
      const result = await userService.hasUserVoted(user.id, pollId);
      return result.hasVoted;
    } catch {
      return false;
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

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInHours = Math.floor((now - created) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
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
              <h1 className="text-primary">
                <i className="bi bi-list-ul me-2"></i>
                Available Polls
              </h1>
              <p className="text-muted">Participate in polls and make your voice heard</p>
            </div>
            <Link to="/user/dashboard" className="btn btn-outline-primary">
              <i className="bi bi-house-door me-2"></i>
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          {/* Search and Sort */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-8">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search for polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => setSearchTerm('')}
                      >
                        <i className="bi bi-x"></i>
                      </button>
                    )}
                  </div>
                </div>
                <div className="col-md-4">
                  <select 
                    className="form-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>
              </div>
              
              {searchTerm && (
                <div className="mt-2">
                  <small className="text-muted">
                    Showing {filteredPolls.length} result{filteredPolls.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </small>
                </div>
              )}
            </div>
          </div>

          {/* Polls List */}
          <div className="row">
            {filteredPolls.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                  <h4 className="text-muted">
                    {searchTerm ? 'No polls found' : 'No active polls available'}
                  </h4>
                  <p className="text-muted">
                    {searchTerm 
                      ? 'Try adjusting your search criteria.' 
                      : 'Check back later for new polls to participate in!'
                    }
                  </p>
                  {searchTerm && (
                    <button 
                      className="btn btn-primary"
                      onClick={() => setSearchTerm('')}
                    >
                      View All Polls
                    </button>
                  )}
                </div>
              </div>
            ) : (
              filteredPolls.map((poll) => (
                <div key={poll.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 border-primary">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">{poll.title}</h5>
                        <span className="badge bg-success">Active</span>
                      </div>
                      
                      <p className="card-text text-muted">
                        {poll.description 
                          ? poll.description.substring(0, 120) + (poll.description.length > 120 ? '...' : '')
                          : 'No description provided'
                        }
                      </p>
                      
                      <div className="mb-3">
                        <small className="text-muted d-block">
                          <i className="bi bi-calendar me-1"></i>
                          Created: {formatDate(poll.createdAt)}
                        </small>
                        <small className="text-muted d-block">
                          <i className="bi bi-clock me-1"></i>
                          {getTimeAgo(poll.createdAt)}
                        </small>
                      </div>
                    </div>
                    
                    <div className="card-footer bg-transparent">
                      <div className="d-flex justify-content-between align-items-center">
                        <VoteStatus user={user} pollId={poll.id} />
                        <Link 
                          to={`/user/poll/${poll.id}`} 
                          className="btn btn-primary"
                        >
                          <i className="bi bi-arrow-right-circle me-1"></i>
                          {/* We'll show "Vote" or "View Results" based on vote status */}
                          Participate
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Statistics */}
          {polls.length > 0 && (
            <div className="card mt-4">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-4">
                    <h4 className="text-primary mb-0">{polls.length}</h4>
                    <small className="text-muted">Total Active Polls</small>
                  </div>
                  <div className="col-md-4">
                    <h4 className="text-success mb-0">{filteredPolls.length}</h4>
                    <small className="text-muted">Currently Showing</small>
                  </div>
                  <div className="col-md-4">
                    <h4 className="text-info mb-0">
                      {searchTerm ? searchTerm.length : '0'}
                    </h4>
                    <small className="text-muted">Search Characters</small>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Component to show vote status
const VoteStatus = ({ user, pollId }) => {
  const [hasVoted, setHasVoted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkVoteStatus = async () => {
      try {
        const result = await userService.hasUserVoted(user.id, pollId);
        setHasVoted(result.hasVoted);
      } catch (err) {
        console.error('Error checking vote status:', err);
      } finally {
        setLoading(false);
      }
    };

    checkVoteStatus();
  }, [user.id, pollId]);

  if (loading) {
    return <small className="text-muted">Checking...</small>;
  }

  return (
    <small className={hasVoted ? 'text-success' : 'text-muted'}>
      <i className={`bi ${hasVoted ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
      {hasVoted ? 'Voted' : 'Not voted'}
    </small>
  );
};

export default UserPolls;
