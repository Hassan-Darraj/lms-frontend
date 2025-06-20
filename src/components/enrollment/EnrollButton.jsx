import { useState } from 'react';
import { enrollUser } from '../../services/enrollmentService';
import './EnrollButton.css';

const EnrollButton = ({ courseId, userId, onSuccess, disabled = false, variant = 'primary' }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [enrolled, setEnrolled] = useState(false);

  const handleEnroll = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await enrollUser({
        course_id: courseId,
        user_id: userId
      });
      setEnrolled(true);
      onSuccess?.();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to enroll in course');
    } finally {
      setLoading(false);
    }
  };

  if (enrolled) {
    return (
      <div className="enroll-success">
        <div className="success-message">
          <span className="success-icon">✅</span>
          <span className="success-text">Successfully Enrolled!</span>
        </div>
      </div>
    );
  }

  return (
    <div className="enroll-button-container">
      <button 
        className={`enroll-btn ${variant} ${loading ? 'loading' : ''}`}
        onClick={handleEnroll} 
        disabled={loading || disabled}
        title="Enroll in this course"
      >
        <div className="btn-content">
          {loading ? (
            <>
              <div className="btn-spinner"></div>
              <span className="btn-text">Enrolling...</span>
            </>
          ) : (
            <>
              <span className="btn-icon">🎓</span>
              <span className="btn-text">Enroll in Course</span>
            </>
          )}
        </div>
        <div className="btn-shine"></div>
      </button>
      
      {error && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            <span className="error-text">{error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollButton;