// Utility functions for handling validation errors and providing user feedback

/**
 * Parse backend validation errors into user-friendly messages
 * @param {Object} error - The error response from the backend API
 * @returns {Object} - Parsed error information
 */
export const parseValidationErrors = (error) => {
  const result = {
    generalMessage: 'An error occurred. Please try again.',
    fieldErrors: {},
    hasValidationErrors: false,
    errorList: []
  };

  if (!error?.response?.data) {
    return result;
  }

  const data = error.response.data;

  // Handle structured validation errors
  if (data.validationErrors && Array.isArray(data.validationErrors)) {
    result.hasValidationErrors = true;
    result.errorList = data.validationErrors.map(err => err.message);
    result.generalMessage = result.errorList.join('. ');
    
    // Group errors by field
    data.validationErrors.forEach(err => {
      if (err.field) {
        if (!result.fieldErrors[err.field]) {
          result.fieldErrors[err.field] = [];
        }
        result.fieldErrors[err.field].push(err.message);
      }
    });
  }
  // Handle single message
  else if (data.message) {
    result.generalMessage = data.message;
  }
  // Handle legacy error format
  else if (data.error) {
    result.generalMessage = data.error;
  }

  return result;
};

/**
 * Get field-specific validation requirements for display
 * @param {string} fieldName - The name of the form field
 * @returns {Object} - Validation requirements for the field
 */
export const getFieldValidationRules = (fieldName) => {
  const rules = {
    username: {
      requirements: [
        'Must be 3-50 characters long',
        'Can only contain letters, numbers, underscores, and hyphens',
        'Must start with a letter or number'
      ],
      pattern: /^[a-zA-Z0-9][a-zA-Z0-9_-]*$/,
      minLength: 3,
      maxLength: 50
    },
    email: {
      requirements: [
        'Must be a valid email address',
        'Maximum 254 characters'
      ],
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      maxLength: 254
    },
    password: {
      requirements: [
        'Must be at least 8 characters long',
        'Must contain at least one lowercase letter (a-z)',
        'Must contain at least one uppercase letter (A-Z)',
        'Must contain at least one digit (0-9)',
        'Must contain at least one special character (@$!%*?&)'
      ],
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      minLength: 8
    },
    firstName: {
      requirements: [
        'Must be 1-50 characters long',
        'Cannot be blank'
      ],
      maxLength: 50,
      minLength: 1
    },
    lastName: {
      requirements: [
        'Must be 1-50 characters long',
        'Cannot be blank'
      ],
      maxLength: 50,
      minLength: 1
    },
    title: {
      requirements: [
        'Must be 5-200 characters long',
        'Cannot be blank'
      ],
      minLength: 5,
      maxLength: 200
    },
    description: {
      requirements: [
        'Maximum 1000 characters',
        'Optional field'
      ],
      maxLength: 1000
    },
    pollOptions: {
      requirements: [
        'Must have at least 2 options',
        'Maximum 10 options allowed',
        'Each option must be 1-100 characters',
        'All options must be unique'
      ],
      minCount: 2,
      maxCount: 10,
      maxLength: 100
    }
  };

  return rules[fieldName] || { requirements: [] };
};

/**
 * Validate a single field on the frontend
 * @param {string} fieldName - The name of the field
 * @param {any} value - The value to validate
 * @returns {Array} - Array of validation errors
 */
export const validateField = (fieldName, value) => {
  const errors = [];
  const rules = getFieldValidationRules(fieldName);
  
  if (!value || (typeof value === 'string' && !value.trim())) {
    if (['firstName', 'lastName', 'username', 'email', 'password', 'title'].includes(fieldName)) {
      errors.push(`${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`);
      return errors;
    }
  }

  const stringValue = String(value).trim();

  // Length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    errors.push(`Must be at least ${rules.minLength} characters long`);
  }
  
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    errors.push(`Must be at most ${rules.maxLength} characters long`);
  }

  // Pattern validation
  if (rules.pattern && stringValue && !rules.pattern.test(stringValue)) {
    switch (fieldName) {
      case 'email':
        errors.push('Must be a valid email address');
        break;
      case 'password':
        errors.push('Password does not meet complexity requirements');
        break;
      case 'username':
        errors.push('Username contains invalid characters');
        break;
    }
  }

  return errors;
};

/**
 * Validate poll options array
 * @param {Array} options - Array of poll options
 * @returns {Array} - Array of validation errors
 */
export const validatePollOptions = (options) => {
  const errors = [];
  const validOptions = options.filter(opt => opt && opt.trim());

  if (validOptions.length < 2) {
    errors.push('Must have at least 2 options');
  }

  if (validOptions.length > 10) {
    errors.push('Maximum 10 options allowed');
  }

  // Check for duplicates
  const uniqueOptions = [...new Set(validOptions.map(opt => opt.trim().toLowerCase()))];
  if (uniqueOptions.length !== validOptions.length) {
    errors.push('All options must be unique');
  }

  // Check individual option length
  validOptions.forEach((option, index) => {
    if (option.length > 100) {
      errors.push(`Option ${index + 1} must be at most 100 characters long`);
    }
    if (option.length === 0) {
      errors.push(`Option ${index + 1} cannot be empty`);
    }
  });

  return errors;
};

/**
 * Format validation errors for display in UI
 * @param {Array} errors - Array of error messages
 * @returns {string} - Formatted error message
 */
export const formatErrorsForDisplay = (errors) => {
  if (!errors || errors.length === 0) return '';
  
  if (errors.length === 1) {
    return errors[0];
  }
  
  return errors.map((error, index) => `${index + 1}. ${error}`).join(' ');
};

/**
 * Get CSS class for form field based on validation state
 * @param {string} fieldName - The field name
 * @param {Object} fieldErrors - Object containing field-specific errors
 * @param {boolean} touched - Whether the field has been touched
 * @returns {string} - CSS class for the form field
 */
export const getFieldClass = (fieldName, fieldErrors, touched = false) => {
  const baseClass = 'form-control';
  
  if (!touched) return baseClass;
  
  if (fieldErrors[fieldName] && fieldErrors[fieldName].length > 0) {
    return `${baseClass} is-invalid`;
  }
  
  return `${baseClass} is-valid`;
};

/**
 * Create a validation error component for display
 * @param {string} fieldName - The field name
 * @param {Object} fieldErrors - Object containing field-specific errors  
 * @returns {Object} - Props for error display component
 */
export const getFieldErrorProps = (fieldName, fieldErrors) => {
  const errors = fieldErrors[fieldName];
  
  if (!errors || errors.length === 0) {
    return { show: false, message: '', className: '' };
  }
  
  return {
    show: true,
    message: formatErrorsForDisplay(errors),
    className: 'invalid-feedback'
  };
};
