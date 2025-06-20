import { useState, useEffect } from 'react';
import { createAssignment, updateAssignment, getAssignmentById } from '../../services/assignmentService';
import './AssignmentForm.css';

const AssignmentForm = ({ assignmentId, lessonId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lesson_id: lessonId || '',
    title: '',
    description: '',
    deadline: '',
    max_score: 100
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (assignmentId) {
      const fetchAssignment = async () => {
        try {
          const response = await getAssignmentById(assignmentId);
          const assignment = response.data.data;
          setFormData({
            ...assignment,
            deadline: assignment.deadline ? new Date(assignment.deadline).toISOString().slice(0, 16) : ''
          });
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch assignment');
        }
      };
      fetchAssignment();
    }
  }, [assignmentId]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.deadline) {
      errors.deadline = 'Deadline is required';
    } else {
      const deadlineDate = new Date(formData.deadline);
      const now = new Date();
      if (deadlineDate <= now) {
        errors.deadline = 'Deadline must be in the future';
      }
    }
    
    if (!formData.max_score || formData.max_score <= 0) {
      errors.max_score = 'Max score must be greater than 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const submitData = {
        ...formData,
        deadline: new Date(formData.deadline).toISOString()
      };

      if (assignmentId) {
        await updateAssignment(assignmentId, submitData);
      } else {
        await createAssignment(submitData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_score' ? parseInt(value) : value
    }));
    
    // Clear field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30); // At least 30 minutes from now
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="modal-overlay">
      <div className="assignment-form-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="title-icon">
              {assignmentId ? '✏️' : '➕'}
            </span>
            {assignmentId ? 'Edit Assignment' : 'Create Assignment'}
          </h3>
          <button className="close-button" onClick={onCancel} type="button">
            ✕
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-body">
            <div className="form-section">
              <h4 className="section-title">Assignment Details</h4>
              
              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Title</span>
                  <span className="required">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`form-input ${formErrors.title ? 'error' : ''}`}
                  placeholder="Enter assignment title"
                  maxLength={100}
                />
                {formErrors.title && (
                  <span className="error-text">{formErrors.title}</span>
                )}
                <div className="char-count">
                  {formData.title.length}/100
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span className="label-text">Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Provide detailed instructions for the assignment"
                  rows="4"
                  maxLength={1000}
                />
                <div className="char-count">
                  {formData.description.length}/1000
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4 className="section-title">Assignment Settings</h4>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Deadline</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className={`form-input ${formErrors.deadline ? 'error' : ''}`}
                    min={getMinDateTime()}
                  />
                  {formErrors.deadline && (
                    <span className="error-text">{formErrors.deadline}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <span className="label-text">Max Score</span>
                    <span className="required">*</span>
                  </label>
                  <input
                    type="number"
                    name="max_score"
                    value={formData.max_score}
                    onChange={handleChange}
                    className={`form-input ${formErrors.max_score ? 'error' : ''}`}
                    min="1"
                    max="1000"
                    placeholder="100"
                  />
                  {formErrors.max_score && (
                    <span className="error-text">{formErrors.max_score}</span>
                  )}
                </div>
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
          </div>
          
          <div className="modal-footer">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {assignmentId ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <span className="btn-icon">
                    {assignmentId ? '💾' : '➕'}
                  </span>
                  {assignmentId ? 'Update Assignment' : 'Create Assignment'}
                </>
              )}
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;