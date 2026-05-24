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

  // Track scroll position for navbar background transition
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 15;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getAccentColor = () => {
    return isAdmin ? '#6366f1' : '#00e5ff';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top transition-all duration-300" style={{
      background: scrolled ? 'rgba(6, 11, 22, 0.85)' : 'rgba(6, 11, 22, 0.6)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: scrolled ? '10px 0' : '18px 0',
      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      boxShadow: scrolled ? `0 10px 30px rgba(0, 0, 0, 0.5)` : 'none'
    }}>
      <div className="container">
        
        {/* Pulsing Cyber Logo */}
        <Link className="navbar-brand d-flex align-items-center fw-bold text-white tracking-tight" to="/" style={{ fontSize: '1.4rem' }}>
          <span className="d-inline-block rounded-circle bg-pulse me-2" style={{
            width: '10px',
            height: '10px',
            backgroundColor: getAccentColor(),
            boxShadow: `0 0 10px ${getAccentColor()}`,
            animation: 'pulse 1.5s infinite'
          }}></span>
          <span className="font-monospace fw-bold" style={{ letterSpacing: '0.5px' }}>
            Votex <span style={{ color: getAccentColor() }}>Cloud</span>
          </span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '6px'
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link px-3 font-monospace small ${activePath.includes('dashboard') ? 'active' : ''}`}
                    to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
                    style={{
                      color: activePath.includes('dashboard') ? getAccentColor() : '#94a3b8',
                      transition: 'color 0.2s'
                    }}
                  >
                    Console
                  </Link>
                </li>
                
                {isAdmin && (
                  <>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link px-3 font-monospace small ${activePath.includes('/admin/polls') ? 'active' : ''}`} 
                        to="/admin/polls"
                        style={{
                          color: activePath.includes('/admin/polls') ? getAccentColor() : '#94a3b8',
                          transition: 'color 0.2s'
                        }}
                      >
                        Ledgers
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link 
                        className={`nav-link px-3 font-monospace small ${activePath.includes('/admin/create-poll') ? 'active' : ''}`} 
                        to="/admin/create-poll"
                        style={{
                          color: activePath.includes('/admin/create-poll') ? getAccentColor() : '#94a3b8',
                          transition: 'color 0.2s'
                        }}
                      >
                        Create Stream
                      </Link>
                    </li>
                  </>
                )}
                
                {isUser && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link px-3 font-monospace small ${activePath.includes('/user/polls') ? 'active' : ''}`} 
                      to="/user/polls"
                      style={{
                        color: activePath.includes('/user/polls') ? getAccentColor() : '#94a3b8',
                        transition: 'color 0.2s'
                      }}
                    >
                      Active Streams
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
                  className="nav-link dropdown-toggle btn btn-link border-0 text-decoration-none font-monospace small text-white d-flex align-items-center"
                  id="navbarDropdown"
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-expanded={menuOpen}
                  style={{ color: 'inherit' }}
                >
                  <i className="bi bi-cpu me-2" style={{ color: getAccentColor() }}></i>
                  {isAdmin ? admin?.firstName : user?.firstName}
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
                    <ul className="dropdown-menu show border" style={{
                      position: 'fixed',
                      zIndex: 2147483647,
                      top: '70px',
                      right: '20px',
                      left: 'auto',
                      transform: 'none',
                      margin: '0',
                      width: '220px',
                      backgroundColor: '#0b1326',
                      borderColor: 'rgba(255, 255, 255, 0.08)',
                      borderRadius: '8px',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.5)',
                      padding: '6px 0'
                    }}>
                      <li>
                        <Link 
                          className="dropdown-item py-2 font-monospace small text-white d-flex align-items-center" 
                          to={isAdmin ? `/admin/profile/${admin?.id}` : `/user/profile/${user?.id}`}
                          onClick={() => setMenuOpen(false)}
                          style={{ transition: 'background-color 0.2s', padding: '10px 14px' }}
                        >
                          <i className="bi bi-person me-2" style={{ color: getAccentColor() }}></i>
                          Node Profile
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" style={{ borderTop: '1px solid rgba(255,255,255,0.08)', margin: '6px 0' }} /></li>
                      <li>
                        <button 
                          className="dropdown-item py-2 font-monospace small text-danger d-flex align-items-center"
                          onClick={() => { setMenuOpen(false); handleLogout(); }}
                          style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', padding: '10px 14px' }}
                        >
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Disconnect
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
                  <Link className="nav-link px-3 font-monospace small text-white" to="/user/login" style={{ opacity: 0.85 }}>
                    Secure Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-3 font-monospace small" to="/user/register" style={{
                    color: '#00e5ff',
                    fontWeight: '600'
                  }}>
                    Register Node
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
