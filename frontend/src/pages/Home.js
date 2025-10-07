import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%)'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="text-white animate-fade-in">
              <h1 className="display-4 fw-bold mb-4">
                Welcome to Polling App
              </h1>
              <p className="lead mb-4">
                Create engaging polls and gather valuable insights from your audience. 
                Simple, fast, and effective polling made easy.
              </p>
              <div className="row">
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-white me-3 fs-4" style={{opacity: 0.9}}></i>
                    <span>Easy Poll Creation</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-white me-3 fs-4" style={{opacity: 0.9}}></i>
                    <span>Real-time Results</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-white me-3 fs-4" style={{opacity: 0.9}}></i>
                    <span>User-friendly Interface</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-white me-3 fs-4" style={{opacity: 0.9}}></i>
                    <span>Secure Voting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row animate-slide-in">
              <div className="col-md-6 mb-4">
                <div className="card shadow-lg h-100 hover-lift" style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '1rem'
                }}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-person-circle display-4" style={{color: 'var(--primary-color)'}}></i>
                    </div>
                    <h5 className="card-title fw-bold text-dark">For Voters</h5>
                    <p className="card-text text-muted">
                      Participate in polls, cast your vote, and see results instantly.
                    </p>
                    <div className="d-grid gap-2">
                      <Link to="/user/login" className="btn btn-primary">
                        Login as User
                      </Link>
                      <Link to="/user/register" className="btn btn-outline-primary">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card shadow-lg h-100 hover-lift" style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: 'none',
                  borderRadius: '1rem'
                }}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-gear-fill display-4" style={{color: 'var(--secondary-color)'}}></i>
                    </div>
                    <h5 className="card-title fw-bold text-dark">For Admins</h5>
                    <p className="card-text text-muted">
                      Create and manage polls, analyze responses, and gain insights.
                    </p>
                    <div className="d-grid gap-2">
                      <Link to="/admin/login" className="btn btn-success">
                        Admin Login
                      </Link>
                      <Link to="/admin/register" className="btn btn-outline-success">
                        Admin Sign Up
                      </Link>
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

export default Home;
