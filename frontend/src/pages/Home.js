import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container-fluid vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <div className="text-white">
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
                    <i className="bi bi-check-circle-fill text-success me-3 fs-4"></i>
                    <span>Easy Poll Creation</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-4"></i>
                    <span>Real-time Results</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-4"></i>
                    <span>User-friendly Interface</span>
                  </div>
                </div>
                <div className="col-sm-6 mb-3">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-success me-3 fs-4"></i>
                    <span>Secure Voting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card shadow h-100">
                  <div className="card-body text-center p-4">
                    <i className="bi bi-person-circle display-4 text-primary mb-3"></i>
                    <h5 className="card-title">For Voters</h5>
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
                <div className="card shadow h-100">
                  <div className="card-body text-center p-4">
                    <i className="bi bi-gear-fill display-4 text-success mb-3"></i>
                    <h5 className="card-title">For Admins</h5>
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
