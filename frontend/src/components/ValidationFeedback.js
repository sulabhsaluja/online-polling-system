import React from 'react';
import { getFieldValidationRules, getFieldErrorProps } from '../utils/validationUtils';

/**
 * Display validation requirements for a field
 */
export const ValidationRequirements = ({ fieldName, show = true }) => {
  if (!show) return null;
  
  const rules = getFieldValidationRules(fieldName);
  
  if (!rules.requirements || rules.requirements.length === 0) {
    return null;
  }

  return (
    <div className="form-text">
      <small className="text-muted">
        {rules.requirements.map((requirement, index) => (
          <div key={index}>
            <i className="bi bi-info-circle me-1"></i>
            {requirement}
          </div>
        ))}
      </small>
    </div>
  );
};

/**
 * Display validation error messages for a field
 */
export const ValidationError = ({ fieldName, fieldErrors, show = true }) => {
  if (!show) return null;
  
  const errorProps = getFieldErrorProps(fieldName, fieldErrors);
  
  if (!errorProps.show) return null;

  return (
    <div className={errorProps.className}>
      <i className="bi bi-exclamation-triangle me-1"></i>
      {errorProps.message}
    </div>
  );
};

/**
 * Combined component showing both requirements and errors
 */
export const ValidationFeedback = ({ 
  fieldName, 
  fieldErrors = {}, 
  showRequirements = true, 
  showErrors = true 
}) => {
  const hasErrors = fieldErrors[fieldName] && fieldErrors[fieldName].length > 0;

  return (
    <>
      {showRequirements && !hasErrors && (
        <ValidationRequirements fieldName={fieldName} />
      )}
      {showErrors && hasErrors && (
        <ValidationError fieldName={fieldName} fieldErrors={fieldErrors} />
      )}
    </>
  );
};

/**
 * Special component for poll options validation
 */
export const PollOptionsValidation = ({ errors = [], showRequirements = true }) => {
  if (errors.length > 0) {
    return (
      <div className="invalid-feedback d-block">
        <i className="bi bi-exclamation-triangle me-1"></i>
        {errors.join('. ')}
      </div>
    );
  }

  if (showRequirements) {
    return (
      <div className="form-text">
        <small className="text-muted">
          <div><i className="bi bi-info-circle me-1"></i>Must have at least 2 options</div>
          <div><i className="bi bi-info-circle me-1"></i>Maximum 10 options allowed</div>
          <div><i className="bi bi-info-circle me-1"></i>Each option must be 1-100 characters</div>
          <div><i className="bi bi-info-circle me-1"></i>All options must be unique</div>
        </small>
      </div>
    );
  }

  return null;
};
