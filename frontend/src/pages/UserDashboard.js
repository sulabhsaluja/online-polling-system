import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import { useLoadingAnimation } from '../hooks/useAnimations';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activePolls, setActivePolls] = useState([]);
  const [votedPolls, setVotedPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Animation hooks - simplified since we're applying animations directly
  const headerRef = useRef();
  const activeCardRef = useRef();
  const votedCardRef = useRef();
  const sidebarRef = useRef();
  const pollsRef = useRef();
  const votedPollsRef = useRef();
  const showLoading = useLoadingAnimation(loading, 300);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      console.log('Starting to fetch dashboard data for user:', user);
      
      const [activePolls, votedPolls] = await Promise.all([
        userService.getActivePolls(),
        userService.getUserVotedPolls(user.id)
      ]);
      
      console.log('Fetched active polls:', activePolls);
      console.log('Fetched voted polls:', votedPolls);
      
      // Filter out polls user has already voted in from active polls
      const votedPollIds = new Set(votedPolls.map(poll => poll.id));
      const availablePolls = activePolls.filter(poll => !votedPollIds.has(poll.id));
      
      console.log('Available polls after filtering:', availablePolls);
      console.log('Voted poll IDs:', Array.from(votedPollIds));
      
      setActivePolls(availablePolls);
      setVotedPolls(votedPolls);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      console.error('Error details:', err.response?.data);
      console.error('Error status:', err.response?.status);
      setError(`Failed to load dashboard data: ${err.response?.data?.error || err.message}`);
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

  if (showLoading) {
    return (
      <div className="container mt-5" style={{ minHeight: '50vh' }}>
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary mb-4" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-primary">Loading your dashboard...</h4>
          <p className="text-muted">Preparing your personalized polling experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="bg-white rounded-3 shadow-sm p-4 mb-4 animate-fade-in">
            <div>
              <h1 className="text-primary fw-bold mb-2">Welcome, {user?.firstName}!</h1>
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
              <div className="card mb-4 shadow-sm border-0 hover-lift animate-fade-in">
                <div className="card-header bg-primary-50" style={{borderBottom: '1px solid var(--primary-100)'}}>
                  <h5 className="mb-0 d-flex align-items-center text-primary">
                    <i className="bi bi-list-ul me-2"></i>
                    Available Polls
                    <span className="badge bg-primary ms-2">{activePolls.length}</span>
                  </h5>
                </div>
                <div className="card-body">
                  {activePolls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-4 text-muted mb-3 animate-floating"></i>
                      <p className="text-muted animate-fade-in-up">No new polls available at the moment.</p>
                      <p className="text-muted animate-fade-in-up animate-delay-200">Check back later!</p>
                    </div>
                  ) : (
                    <div ref={pollsRef} className="row">
                      {activePolls.map((poll, index) => (
                        <div key={poll.id} className="col-md-6 mb-3 animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="card border-primary hover-lift micro-elastic shadow-sm animate-liquid-wave" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(102, 126, 234, 0.3)'
                          }}>
                            <div className="card-body">
                              <h6 className="card-title fw-bold text-primary">{poll.title}</h6>
                              <p className="card-text text-secondary small">
                                {poll.description?.substring(0, 100)}
                                {poll.description?.length > 100 && '...'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-secondary">
                                  Created: {formatDate(poll.createdAt)}
                                </small>
                                <Link 
                                  to={`/user/poll/${poll.id}`} 
                                  className="btn btn-primary btn-sm btn-magnetic"
                                >
                                  Vote Now ✨
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
              <div 
                ref={votedCardRef}
                className="card hover-lift micro-magnetic shadow-lg animate-fade-in-left animate-delay-500"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.98)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(17, 153, 142, 0.2)'
                }}
              >
                <div className="card-header" style={{ 
                  background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.1) 0%, rgba(56, 239, 125, 0.1) 100%)',
                  borderBottom: '1px solid rgba(17, 153, 142, 0.2)'
                }}>
                  <h5 className="mb-0 d-flex align-items-center text-dark">
                    <i className="bi bi-check-circle me-2 animate-pulse text-success"></i>
                    Your Votes ({votedPolls.length})
                    <span className="badge bg-success ms-2 animate-bounce">{votedPolls.length}</span>
                  </h5>
                </div>
                <div className="card-body">
                  {votedPolls.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-ballot display-4 text-muted mb-3 animate-floating"></i>
                      <p className="text-muted animate-fade-in-up">You haven't voted in any polls yet.</p>
                      <p className="text-muted animate-fade-in-up animate-delay-200">Cast your first vote above!</p>
                    </div>
                  ) : (
                    <div ref={votedPollsRef} className="row">
                      {votedPolls.map((poll, index) => (
                        <div key={poll.id} className="col-md-6 mb-3 animate-zoom-in" style={{ animationDelay: `${index * 100}ms` }}>
                          <div className="card border-success hover-lift micro-elastic shadow-sm animate-liquid-wave" style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(5px)',
                            border: '1px solid rgba(17, 153, 142, 0.3)'
                          }}>
                            <div className="card-body">
                              <h6 className="card-title fw-bold text-success">
                                {poll.title}
                                <span className="badge bg-success ms-2 small animate-pulse">Voted ✓</span>
                              </h6>
                              <p className="card-text text-secondary small">
                                {poll.description?.substring(0, 100)}
                                {poll.description?.length > 100 && '...'}
                              </p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-secondary">
                                  Created: {formatDate(poll.createdAt)}
                                </small>
                                <Link
                                  to={`/user/poll/${poll.id}`}
                                  className="btn btn-outline-success btn-sm btn-magnetic"
                                >
                                  View Results 📈
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
              <div 
                ref={sidebarRef}
                className="card hover-lift micro-magnetic shadow-lg animate-slide-in-right animate-delay-400"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="card-header" style={{ 
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(79, 172, 254, 0.08) 100%)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-dark">
                    <i className="bi bi-info-circle me-2 animate-pulse text-primary"></i>
                    Quick Actions
                  </h6>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <Link to="/user/polls" className="btn btn-outline-primary btn-magnetic">
                      <i className="bi bi-list-ul me-2"></i>
                      View All Polls
                    </Link>
                    <Link to={`/user/profile/${user?.id}`} className="btn btn-outline-secondary btn-magnetic">
                      <i className="bi bi-person me-2"></i>
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>

              <div className="card mt-3 hover-lift micro-magnetic animate-breathe shadow-lg" style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(0, 0, 0, 0.1)'
              }}>
                <div className="card-header" style={{ 
                  background: 'linear-gradient(135deg, rgba(17, 153, 142, 0.08) 0%, rgba(56, 239, 125, 0.08) 100%)',
                  borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
                }}>
                  <h6 className="mb-0 d-flex align-items-center text-dark">
                    <i className="bi bi-bar-chart me-2 animate-pulse text-success"></i>
                    Your Stats
                  </h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="border-end">
                        <h4 className="text-primary mb-0 fw-bold animate-glow-pulse">{activePolls.length}</h4>
                        <small className="text-secondary">Available Polls</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <h4 className="text-success mb-0 fw-bold animate-glow-pulse">{votedPolls.length}</h4>
                      <small className="text-secondary">Votes Cast</small>
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
