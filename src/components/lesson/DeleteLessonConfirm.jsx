import { useState } from 'react';
import { deleteLesson } from '../../services/lessonService';
import './DeleteLessonConfirm.css';

const DeleteLessonConfirm = ({ lesson, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteLesson(lesson.id);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete lesson');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Delete Lesson</h3>
          <div className="warning-icon">⚠️</div>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this lesson?</p>
          <p className="warning-note">This action cannot be undone and will permanently remove the lesson content.</p>
          
          <div className="lesson-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{lesson.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className="detail-value content-type">{lesson.content_type}</span>
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
                Delete Lesson
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLessonConfirm;