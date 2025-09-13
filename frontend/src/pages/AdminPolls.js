import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';

const AdminPolls = () => {
  const { admin } = useAuth();
  const [polls, setPolls] = useState([]);
  const [filteredPolls, setFilteredPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, inactive
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (admin) {
      fetchAdminPolls();
    }
  }, [admin]);

  useEffect(() => {
    filterPolls();
  }, [polls, filter, searchTerm]);

  const fetchAdminPolls = async () => {
    try {
      const adminPolls = await adminService.getAdminPolls(admin.id);
      setPolls(adminPolls);
    } catch (err) {
      setError('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const filterPolls = () => {
    let filtered = polls;

    // Filter by status
    if (filter === 'active') {
      filtered = filtered.filter(poll => poll.isActive);
    } else if (filter === 'inactive') {
      filtered = filtered.filter(poll => !poll.isActive);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(poll => 
        poll.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        poll.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPolls(filtered);
  };

  const handleActivatePoll = async (pollId) => {
    try {
      await adminService.activatePoll(admin.id, pollId);
      await fetchAdminPolls();
    } catch (err) {
      setError('Failed to activate poll');
    }
  };

  const handleDeactivatePoll = async (pollId) => {
    try {
      await adminService.deactivatePoll(admin.id, pollId);
      await fetchAdminPolls();
    } catch (err) {
      setError('Failed to deactivate poll');
    }
  };

  const handleDeletePoll = async (pollId) => {
    if (window.confirm('Are you sure you want to delete this poll? This action cannot be undone.')) {
      try {
        await adminService.deletePoll(admin.id, pollId);
        await fetchAdminPolls();
      } catch (err) {
        setError('Failed to delete poll');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="text-success">
                <i className="bi bi-list-ul me-2"></i>
                My Polls
              </h1>
              <p className="text-muted">Manage all your polls in one place</p>
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

          {/* Filters and Search */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="bi bi-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search polls..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="btn-group w-100" role="group">
                    <input
                      type="radio"
                      className="btn-check"
                      name="filter"
                      id="all"
                      value="all"
                      checked={filter === 'all'}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <label className="btn btn-outline-success" htmlFor="all">All</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="filter"
                      id="active"
                      value="active"
                      checked={filter === 'active'}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <label className="btn btn-outline-success" htmlFor="active">Active</label>

                    <input
                      type="radio"
                      className="btn-check"
                      name="filter"
                      id="inactive"
                      value="inactive"
                      checked={filter === 'inactive'}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <label className="btn btn-outline-success" htmlFor="inactive">Inactive</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Polls Grid */}
          <div className="row">
            {filteredPolls.length === 0 ? (
              <div className="col-12">
                <div className="text-center py-5">
                  <i className="bi bi-inbox display-4 text-muted mb-3"></i>
                  <p className="text-muted">
                    {searchTerm || filter !== 'all' ? 'No polls match your criteria.' : 'You haven\'t created any polls yet.'}
                  </p>
                  {!searchTerm && filter === 'all' && (
                    <Link to="/admin/create-poll" className="btn btn-success">
                      Create Your First Poll
                    </Link>
                  )}
                </div>
              </div>
            ) : (
              filteredPolls.map((poll) => (
                <div key={poll.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h5 className="card-title">{poll.title}</h5>
                        <span className={`badge ${poll.isActive ? 'bg-success' : 'bg-secondary'}`}>
                          {poll.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="card-text text-muted">
                        {poll.description 
                          ? poll.description.substring(0, 100) + (poll.description.length > 100 ? '...' : '')
                          : 'No description provided'
                        }
                      </p>
                      
                      <div className="mb-3">
                        <small className="text-muted">
                          <i className="bi bi-calendar me-1"></i>
                          Created: {formatDate(poll.createdAt)}
                        </small>
                      </div>
                    </div>
                    
                    <div className="card-footer">
                      <div className="btn-group w-100">
                        <Link
                          to={`/admin/poll/${poll.id}/results`}
                          className="btn btn-outline-info btn-sm"
                          title="View Results"
                        >
                          <i className="bi bi-bar-chart"></i>
                        </Link>
                        
                        <Link
                          to={`/admin/poll/${poll.id}/edit`}
                          className="btn btn-outline-primary btn-sm"
                          title="Edit Poll"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        
                        {poll.isActive ? (
                          <button
                            className="btn btn-outline-warning btn-sm"
                            onClick={() => handleDeactivatePoll(poll.id)}
                            title="Deactivate Poll"
                          >
                            <i className="bi bi-pause"></i>
                          </button>
                        ) : (
                          <button
                            className="btn btn-outline-success btn-sm"
                            onClick={() => handleActivatePoll(poll.id)}
                            title="Activate Poll"
                          >
                            <i className="bi bi-play"></i>
                          </button>
                        )}
                        
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleDeletePoll(poll.id)}
                          title="Delete Poll"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Summary */}
          {polls.length > 0 && (
            <div className="card mt-4">
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3">
                    <h4 className="text-primary mb-0">{polls.length}</h4>
                    <small className="text-muted">Total Polls</small>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-success mb-0">
                      {polls.filter(p => p.isActive).length}
                    </h4>
                    <small className="text-muted">Active Polls</small>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-secondary mb-0">
                      {polls.filter(p => !p.isActive).length}
                    </h4>
                    <small className="text-muted">Inactive Polls</small>
                  </div>
                  <div className="col-md-3">
                    <h4 className="text-info mb-0">{filteredPolls.length}</h4>
                    <small className="text-muted">Showing</small>
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

export default AdminPolls;
