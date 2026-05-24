import React from 'react';
import { Link } from 'react-router-dom';
import ParticleBackground from '../components/ParticleBackground';

const Home = () => {
  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center position-relative overflow-hidden py-5" style={{
      background: 'radial-gradient(circle at 10% 20%, rgba(6, 11, 22, 1) 0%, rgba(15, 23, 42, 1) 90%)'
    }}>
      {/* Background Interactive Particles */}
      <ParticleBackground particleCount={60} particleColor="rgba(0, 229, 255, 0.15)" speed={0.8} />

      {/* Cyber Laser Grid lines */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'linear-gradient(rgba(0, 229, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 229, 255, 0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* Glow Orbs */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '20%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.08) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '15%',
        right: '15%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)',
        filter: 'blur(50px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container position-relative" style={{ zIndex: 1 }}>
        <div className="row align-items-center justify-content-between">
          
          {/* Left Column: Brand & Specifications */}
          <div className="col-lg-6 mb-5 mb-lg-0">
            <div className="animate-fade-in">
              <div className="d-flex align-items-center mb-3">
                <span className="badge px-3 py-2 text-uppercase font-monospace tracking-wider border" style={{
                  background: 'rgba(0, 229, 255, 0.1)',
                  borderColor: 'rgba(0, 229, 255, 0.3)',
                  color: '#00e5ff',
                  letterSpacing: '2px',
                  fontSize: '0.75rem'
                }}>
                  <span className="d-inline-block rounded-circle bg-pulse me-2" style={{
                    width: '8px',
                    height: '8px',
                    backgroundColor: '#00e5ff',
                    boxShadow: '0 0 8px #00e5ff',
                    animation: 'pulse 1.5s infinite'
                  }}></span>
                  Network Status: Online
                </span>
                <span className="badge px-3 py-2 ms-2 text-uppercase font-monospace border" style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#94a3b8',
                  fontSize: '0.75rem'
                }}>
                  v2.4.0-Stable
                </span>
              </div>

              <h1 className="display-3 fw-bold mb-3 tracking-tight" style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #00e5ff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Votex Cloud
              </h1>
              
              <p className="lead mb-4 text-slate-300" style={{ fontSize: '1.25rem', color: '#94a3b8' }}>
                Next-generation secure, real-time polling infrastructure. Engineered for high-integrity decisions, interactive participation, and verified auditing.
              </p>

              {/* Specs Glass Card */}
              <div className="card p-4 border shadow-2xl" style={{
                background: 'rgba(11, 19, 38, 0.5)',
                borderColor: 'rgba(0, 229, 255, 0.15)',
                backdropFilter: 'blur(20px)'
              }}>
                <h6 className="text-uppercase font-monospace tracking-wider mb-3" style={{ color: '#00e5ff', letterSpacing: '1px' }}>
                  System Specifications
                </h6>
                <div className="row g-3">
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-shield-lock-fill me-3 fs-5" style={{ color: '#00e5ff' }}></i>
                      <div>
                        <span className="d-block fw-bold text-white small">JSR-380 Integrity</span>
                        <span className="small" style={{ color: '#94a3b8' }}>Validated payload binding</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-lightning-charge-fill me-3 fs-5" style={{ color: '#6366f1' }}></i>
                      <div>
                        <span className="d-block fw-bold text-white small">Real-time Stream</span>
                        <span className="small" style={{ color: '#94a3b8' }}>Instantaneous metrics update</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-diagram-3-fill me-3 fs-5" style={{ color: '#6366f1' }}></i>
                      <div>
                        <span className="d-block fw-bold text-white small">Role Isolation</span>
                        <span className="small" style={{ color: '#94a3b8' }}>Decoupled user & admin portals</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-6">
                    <div className="d-flex align-items-start">
                      <i className="bi bi-cpu-fill me-3 fs-5" style={{ color: '#00e5ff' }}></i>
                      <div>
                        <span className="d-block fw-bold text-white small">DB Latency</span>
                        <span className="small" style={{ color: '#94a3b8' }}>Connection pool &lt; 3.8ms</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Portal Gates */}
          <div className="col-lg-5">
            <div className="row animate-slide-in">
              
              {/* Voter Portal Gate */}
              <div className="col-12 mb-4">
                <div className="card shadow-2xl position-relative hover-lift overflow-hidden" style={{
                  background: 'rgba(11, 19, 38, 0.75)',
                  borderColor: 'rgba(0, 229, 255, 0.2)',
                  borderRadius: '1.25rem',
                  boxShadow: '0 8px 32px 0 rgba(0, 229, 255, 0.05)'
                }}>
                  {/* Glowing edge strip */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(to bottom, #00e5ff, #0088cc)'
                  }} />

                  <div className="card-body p-4 ms-2">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="text-uppercase font-monospace small" style={{ color: '#00e5ff', letterSpacing: '1px' }}>
                          Gateway 01
                        </span>
                        <h4 className="card-title fw-bold text-white mt-1">Voter Portal</h4>
                      </div>
                      <div className="p-3 rounded-circle" style={{ background: 'rgba(0, 229, 255, 0.08)' }}>
                        <i className="bi bi-people-fill fs-3" style={{ color: '#00e5ff' }}></i>
                      </div>
                    </div>
                    
                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Cast your votes securely, participate in organizational discussions, and view verified statistical outcomes in real-time.
                    </p>

                    <div className="row g-2 mt-3">
                      <div className="col-6">
                        <Link to="/user/login" className="btn btn-primary w-100 text-center py-2" style={{
                          background: 'linear-gradient(135deg, #00e5ff 0%, #00b2cc 100%)',
                          boxShadow: '0 4px 14px rgba(0, 229, 255, 0.25)',
                          color: '#060b16',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: '600',
                          letterSpacing: '0'
                        }}>
                          Voter Login
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link to="/user/register" className="btn btn-outline-primary w-100 text-center py-2" style={{
                          borderColor: 'rgba(0, 229, 255, 0.3)',
                          color: '#00e5ff',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: '600',
                          letterSpacing: '0'
                        }}>
                          Register
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Admin Portal Gate */}
              <div className="col-12">
                <div className="card shadow-2xl position-relative hover-lift overflow-hidden" style={{
                  background: 'rgba(11, 19, 38, 0.75)',
                  borderColor: 'rgba(99, 102, 241, 0.2)',
                  borderRadius: '1.25rem',
                  boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.05)'
                }}>
                  {/* Glowing edge strip */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    bottom: 0,
                    width: '4px',
                    background: 'linear-gradient(to bottom, #6366f1, #4f46e5)'
                  }} />

                  <div className="card-body p-4 ms-2">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <span className="text-uppercase font-monospace small" style={{ color: '#818cf8', letterSpacing: '1px' }}>
                          Gateway 02
                        </span>
                        <h4 className="card-title fw-bold text-white mt-1">Admin Console</h4>
                      </div>
                      <div className="p-3 rounded-circle" style={{ background: 'rgba(99, 102, 241, 0.08)' }}>
                        <i className="bi bi-grid-1x2-fill fs-3" style={{ color: '#818cf8' }}></i>
                      </div>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                      Construct dynamic polls, configure JSR-380 payload bindings, audit active participant streams, and analyze polling metadata.
                    </p>

                    <div className="row g-2 mt-3">
                      <div className="col-6">
                        <Link to="/admin/login" className="btn btn-secondary w-100 text-center py-2" style={{
                          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.25)',
                          color: '#ffffff',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: '600',
                          letterSpacing: '0'
                        }}>
                          Admin Login
                        </Link>
                      </div>
                      <div className="col-6">
                        <Link to="/admin/register" className="btn btn-outline-secondary w-100 text-center py-2" style={{
                          borderColor: 'rgba(99, 102, 241, 0.3)',
                          color: '#818cf8',
                          borderRadius: '8px',
                          textTransform: 'none',
                          fontWeight: '600',
                          letterSpacing: '0'
                        }}>
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
    </div>
  );
};

export default Home;
