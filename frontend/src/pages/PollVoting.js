import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';

const PollVoting = () => {
  const { pollId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [poll, setPoll] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [hasVoted, setHasVoted] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pollData, pollOptions] = await Promise.all([
          userService.getPollById(pollId),
          userService.getPollOptions(pollId)
        ]);
        setPoll(pollData);
        setOptions(pollOptions);
      } catch (err) {
        setError('Failed to load poll data');
      } finally {
        setLoading(false);
      }
    };

    const checkVoteStatus = async () => {
      try {
        const votedData = await userService.hasUserVoted(user.id, pollId);
        if (votedData.hasVoted) {
          setHasVoted(true);
          const resultsData = await userService.getPollResults(pollId);
          setResults(resultsData);
        }
      } catch (err) {
        console.error('Error checking vote status:', err);
      }
    };

    if (pollId && user) {
      loadData();
      checkVoteStatus();
    }
  }, [pollId, user]);

  const handleVote = async () => {
    if (!selectedOption) {
      setError('Please select an option');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await userService.submitVote(user.id, pollId, selectedOption);
      setHasVoted(true);
      // Load results after voting
      const resultsData = await userService.getPollResults(pollId);
      setResults(resultsData);
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to submit vote';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const calculatePercentage = (voteCount, totalVotes) => {
    if (totalVotes === 0) return 0;
    return Math.round((voteCount / totalVotes) * 100);
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

  if (!poll) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          Poll not found
        </div>
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
                <h4 className="mb-0">{poll.title}</h4>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/user/dashboard')}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
            <div className="card-body">
              {poll.description && (
                <p className="text-muted mb-4">{poll.description}</p>
              )}

              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {!hasVoted ? (
                <div>
                  <h5 className="mb-3">Cast Your Vote</h5>
                  <div className="mb-3">
                    {options.map((option) => (
                      <div key={option.id} className="form-check mb-2">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="pollOption"
                          id={`option-${option.id}`}
                          value={option.id}
                          onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        <label className="form-check-label" htmlFor={`option-${option.id}`}>
                          {option.optionText}
                        </label>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={handleVote}
                    disabled={submitting || !selectedOption}
                  >
                    {submitting ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Submit Vote
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div>
                  <div className="alert alert-success d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <div>
                      Thank you for voting! Here are the current results:
                    </div>
                  </div>

                  <h5 className="mb-3">Poll Results</h5>
                  {results && results.options ? (
                    <div>
                      {results.options.map((option) => {
                        const percentage = calculatePercentage(option.voteCount, results.totalVotes);
                        return (
                          <div key={option.id} className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span>{option.optionText}</span>
                              <span className="badge bg-primary">
                                {option.voteCount} votes ({percentage}%)
                              </span>
                            </div>
                            <div className="progress" style={{ height: '20px' }}>
                              <div
                                className="progress-bar"
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
                      <div className="mt-3 text-center">
                        <small className="text-muted">
                          Total votes: {results.totalVotes}
                        </small>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">Loading results...</p>
                  )}
                </div>
              )}
            </div>
            <div className="card-footer text-muted">
              <small>
                Created: {new Date(poll.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollVoting;
