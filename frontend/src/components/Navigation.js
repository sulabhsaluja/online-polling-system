import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const { user, admin, logout, isAuthenticated, isAdmin, isUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [activePath, setActivePath] = useState('');

  // Track scroll position for navbar animation
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  // Update active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark transition-all duration-300 ${
      scrolled 
        ? 'shadow-lg backdrop-blur glass' 
        : ''
    } ${
      isAdmin 
        ? 'bg-gradient-success animate-aurora' 
        : 'bg-gradient-primary animate-aurora'
    }`} style={{
      background: scrolled 
        ? (isAdmin 
          ? 'rgba(17, 153, 142, 0.9)' 
          : 'rgba(102, 126, 234, 0.9)'
        ) : undefined,
      backdropFilter: scrolled ? 'blur(20px)' : undefined,
      borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.1)' : undefined,
      transform: scrolled ? 'translateY(0)' : 'translateY(-5px)',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div className="container">
        <Link className="navbar-brand fw-bold animate-glow-pulse hover-scale" to="/">
          <i className="bi bi-pie-chart-fill me-2 animate-spin" style={{ animation: 'spin 8s linear infinite' }}></i>
          <span className="neon-primary">Polling App</span>
        </Link>

        <button
          className="navbar-toggler micro-bounce glass-button"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px'
          }}
        >
          <span className="navbar-toggler-icon animate-bounce"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link micro-elastic position-relative ${
                      activePath.includes('dashboard') ? 'active animate-glow-pulse' : ''
                    }`}
                    to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                  >
                    Dashboard
                    {activePath.includes('dashboard') && (
                      <span className="position-absolute bottom-0 start-50 translate-middle-x" style={{
                        width: '4px',
                        height: '4px',
                        background: 'currentColor',
                        borderRadius: '50%',
                        animation: 'glowPulse 2s infinite'
                      }}></span>
                    )}
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
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  style={{color: 'inherit'}}
                >
                  <i className="bi bi-person-circle me-1"></i>
                  {isAdmin ? admin?.firstName : user?.firstName} {isAdmin ? admin?.lastName : user?.lastName}
                </button>
                {menuOpen && createPortal(
                  <>
                    <div 
                      onClick={() => setMenuOpen(false)}
                      style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 2147483646
                      }}
                    />
                    <ul className="dropdown-menu show" style={{
                      position: 'fixed',
                      zIndex: 2147483647,
                      top: '60px',
                      right: '20px',
                      left: 'auto',
                      transform: 'none',
                      margin: '0',
                      width: '220px',
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      borderRadius: '10px',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.18)'
                    }}>
                      <li>
                        <Link 
                          className="dropdown-item" 
                          to={isAdmin ? `/admin/profile/${admin?.id}` : `/user/profile/${user?.id}`}
                          onClick={() => setMenuOpen(false)}
                          style={{ color: '#111827', padding: '10px 14px', display: 'block' }}
                        >
                          <i className="bi bi-person me-2"></i>
                          Profile
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" style={{ borderTop: '1px solid rgba(0,0,0,0.12)', margin: '8px 0' }} /></li>
                      <li>
                        <button 
                          className="dropdown-item text-danger"
                          onClick={() => { setMenuOpen(false); handleLogout(); }}
                          style={{ color: '#dc2626', padding: '10px 14px', display: 'block', width: '100%', textAlign: 'left', background: 'transparent', border: 'none' }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </>,
                  document.body
                )}
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
