import { useState } from 'react';
import { deleteAssignment } from '../../services/assignmentService';
import './DeleteAssignmentConfirm.css';

const DeleteAssignmentConfirm = ({ assignment, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteAssignment(assignment.id);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Delete Assignment</h3>
          <div className="warning-icon">⚠️</div>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this assignment?</p>
          
          <div className="assignment-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{assignment.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Deadline:</span>
              <span className="detail-value">{new Date(assignment.deadline).toLocaleString()}</span>
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
                Delete Assignment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteAssignmentConfirm;