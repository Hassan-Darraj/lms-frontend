import { useState } from 'react';
import { gradeSubmission } from '../../services/submissionService';
import './SubmissionComponents.css';

const GradeSubmissionForm = ({ submission, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    grade: submission.grade || '',
    feedback: submission.feedback || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await gradeSubmission(submission.id, formData);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to grade submission');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'grade' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Grade Submission</h3>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Grade (0-100):</label>
            <input
              type="number"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              min="0"
              max="100"
              required
            />
          </div>

          <div>
            <label>Feedback:</label>
            <textarea
              name="feedback"
              value={formData.feedback}
              onChange={handleChange}
              rows="4"
              placeholder="Provide feedback for the student..."
            />
          </div>
          
          {error && <div className="error">{error}</div>}
          
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Save Grade'}
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

export default GradeSubmissionForm;