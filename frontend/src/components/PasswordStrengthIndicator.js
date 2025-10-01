import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (pass) => {
    let score = 0;
    const checks = {
      length: pass.length >= 8,
      lowercase: /[a-z]/.test(pass),
      uppercase: /[A-Z]/.test(pass),
      numbers: /\d/.test(pass),
      special: /[@$!%*?&]/.test(pass)
    };

    score = Object.values(checks).filter(Boolean).length;
    
    return { score, checks };
  };

  const { score, checks } = calculateStrength(password);
  
  const getStrengthInfo = (score) => {
    if (score === 0) return { text: '', color: '', width: '0%' };
    if (score <= 2) return { text: 'Weak', color: 'bg-danger', width: '33%' };
    if (score <= 4) return { text: 'Medium', color: 'bg-warning', width: '66%' };
    return { text: 'Strong', color: 'bg-success', width: '100%' };
  };

  const strengthInfo = getStrengthInfo(score);

  if (!password) return null;

  return (
    <div className="password-strength-container mt-2">
      <div className="d-flex justify-content-between align-items-center mb-1">
        <small className="text-muted">Password Strength:</small>
        <small className={`fw-bold ${strengthInfo.color.replace('bg-', 'text-')}`}>
          {strengthInfo.text}
        </small>
      </div>
      
      <div className="progress mb-2" style={{ height: '4px' }}>
        <div 
          className={`progress-bar ${strengthInfo.color}`}
          style={{ width: strengthInfo.width }}
          role="progressbar"
        ></div>
      </div>
      
      <div className="password-requirements">
        <div className="row">
          <div className="col-6">
            <small className={checks.length ? 'text-success' : 'text-muted'}>
              <i className={`bi ${checks.length ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
              8+ characters
            </small>
          </div>
          <div className="col-6">
            <small className={checks.lowercase ? 'text-success' : 'text-muted'}>
              <i className={`bi ${checks.lowercase ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
              Lowercase
            </small>
          </div>
          <div className="col-6">
            <small className={checks.uppercase ? 'text-success' : 'text-muted'}>
              <i className={`bi ${checks.uppercase ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
              Uppercase
            </small>
          </div>
          <div className="col-6">
            <small className={checks.numbers ? 'text-success' : 'text-muted'}>
              <i className={`bi ${checks.numbers ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
              Numbers
            </small>
          </div>
          <div className="col-12">
            <small className={checks.special ? 'text-success' : 'text-muted'}>
              <i className={`bi ${checks.special ? 'bi-check-circle-fill' : 'bi-circle'} me-1`}></i>
              Special characters (@$!%*?&)
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
