import { useState } from 'react';
import { deleteCourse } from '../../services/courseService';
import './DeleteCourseConfirm.css';

const DeleteCourseConfirm = ({ course, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteCourse(course.id);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Delete Course</h3>
          <div className="warning-icon">⚠️</div>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this course?</p>
          <p className="warning-note">This action cannot be undone and will permanently remove all course data.</p>
          
          <div className="course-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{course.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{course.description}</span>
            </div>
          </div>
          
          {error && (
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button 
            className="action-btn cancel-btn" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="action-btn delete-btn" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Deleting...
              </>
            ) : (
              <>
                <span className="btn-icon">🗑️</span>
                Delete Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCourseConfirm;