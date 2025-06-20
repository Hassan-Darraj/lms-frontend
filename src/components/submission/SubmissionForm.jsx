import { useState } from 'react';
import { createSubmission } from '../../services/submissionService';
import './SubmissionComponents.css';

const SubmissionForm = ({ assignmentId, userId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    assignment_id: assignmentId,
    user_id: userId,
    submission_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await createSubmission(formData);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to submit assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Submit Assignment</h3>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Submission URL:</label>
            <input
              type="url"
              name="submission_url"
              value={formData.submission_url}
              onChange={handleChange}
              placeholder="https://..."
              required
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionForm;