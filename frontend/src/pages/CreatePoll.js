import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import adminService from '../services/adminService';
import { parseValidationErrors, getFieldClass, validateField, validatePollOptions } from '../utils/validationUtils';
import { ValidationFeedback, PollOptionsValidation } from '../components/ValidationFeedback';

const CreatePoll = () => {
  const navigate = useNavigate();
  const { admin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [options, setOptions] = useState(['', '']);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});
  const [optionErrors, setOptionErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear field-specific errors when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: []
      }));
    }
    
    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true }));
    
    // Validate field on blur for immediate feedback
    const fieldErrors = validateField(name, value);
    if (fieldErrors.length > 0) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: fieldErrors
      }));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
    
    // Validate options when changed
    const errors = validatePollOptions(newOptions);
    setOptionErrors(errors);
    
    // Clear general error when user makes changes
    if (error) {
      setError('');
    }
  };

  const addOption = () => {
    if (options.length < 10) { // Limit to 10 options
      setOptions([...options, '']);
    }
  };

  const removeOption = (index) => {
    if (options.length > 2) { // Minimum 2 options
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Poll title is required');
      setLoading(false);
      return;
    }

    const validOptions = options.filter(option => option.trim() !== '');
    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      setLoading(false);
      return;
    }

    try {
      const pollData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        options: validOptions
      };

      await adminService.createPoll(admin.id, pollData);
      navigate('/admin/dashboard');
    } catch (err) {
      const errorInfo = parseValidationErrors(err);
      setError(errorInfo.generalMessage);
      setFieldErrors(errorInfo.fieldErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 text-success">
                  <i className="bi bi-plus-circle me-2"></i>
                  Create New Poll
                </h4>
                <button 
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => navigate('/admin/dashboard')}
                >
                  <i className="bi bi-arrow-left me-1"></i>
                  Back to Dashboard
                </button>
              </div>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Poll Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={getFieldClass('title', fieldErrors, touchedFields.title)}
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Enter a clear, concise poll title"
                    required
                  />
                  <ValidationFeedback fieldName="title" fieldErrors={fieldErrors} />
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    className={getFieldClass('description', fieldErrors, touchedFields.description)}
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    placeholder="Provide additional context or instructions (optional)"
                  ></textarea>
                  <ValidationFeedback fieldName="description" fieldErrors={fieldErrors} />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Poll Options <span className="text-danger">*</span>
                  </label>
                  <PollOptionsValidation 
                    errors={optionErrors} 
                    showRequirements={optionErrors.length === 0}
                  />

                  {options.map((option, index) => (
                    <div key={index} className="input-group mb-2">
                      <span className="input-group-text">
                        {index + 1}
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                      />
                      {options.length > 2 && (
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => removeOption(index)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                  ))}

                  {options.length < 10 && (
                    <button
                      type="button"
                      className="btn btn-outline-success btn-sm"
                      onClick={addOption}
                    >
                      <i className="bi bi-plus me-1"></i>
                      Add Option
                    </button>
                  )}
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <button
                      type="button"
                      className="btn btn-secondary w-100"
                      onClick={() => navigate('/admin/dashboard')}
                      disabled={loading}
                    >
                      <i className="bi bi-x-circle me-2"></i>
                      Cancel
                    </button>
                  </div>
                  <div className="col-md-6">
                    <button
                      type="submit"
                      className="btn btn-success w-100"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Create Poll
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="card mt-4">
            <div className="card-header">
              <h6 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Preview
              </h6>
            </div>
            <div className="card-body">
              <h5>{formData.title || 'Poll Title'}</h5>
              {formData.description && (
                <p className="text-muted">{formData.description}</p>
              )}
              <div className="mt-3">
                {options.map((option, index) => (
                  option.trim() && (
                    <div key={index} className="form-check mb-2">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="preview"
                        id={`preview-${index}`}
                        disabled
                      />
                      <label className="form-check-label" htmlFor={`preview-${index}`}>
                        {option}
                      </label>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
