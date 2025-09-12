import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, admin, logout, isAuthenticated, isAdmin, isUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isAdmin ? 'navbar-dark bg-success' : 'navbar-dark bg-primary'}`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-pie-chart-fill me-2"></i>
          Polling App
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className="nav-link" 
                    to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                  >
                    <i className="bi bi-house-door me-1"></i>
                    Dashboard
                  </Link>
                </li>
                
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/polls">
                        <i className="bi bi-list-ul me-1"></i>
                        My Polls
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/admin/create-poll">
                        <i className="bi bi-plus-circle me-1"></i>
                        Create Poll
                      </Link>
                    </li>
                  </>
                )}
                
                {isUser && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/user/polls">
                      <i className="bi bi-list-ul me-1"></i>
                      Available Polls
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <li className="nav-item dropdown">
                <button
                  className="nav-link dropdown-toggle btn btn-link border-0 text-decoration-none"
                  id="navbarDropdown"
                  type="button"
                  data-bs-toggle="dropdown"
                  style={{color: 'inherit'}}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {isAdmin ? admin?.firstName : user?.firstName} {isAdmin ? admin?.lastName : user?.lastName}
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <Link 
                      className="dropdown-item" 
                      to={isAdmin ? `/admin/profile/${admin?.id}` : `/user/profile/${user?.id}`}
                    >
                      <i className="bi bi-person me-2"></i>
                      Profile
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item text-danger" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </ul>
              </li>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user/register">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
