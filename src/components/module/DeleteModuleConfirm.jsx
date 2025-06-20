import { useState } from 'react';
import { deleteModule } from '../../services/moduleService';
import './DeleteModuleConfirm.css';

const DeleteModuleConfirm = ({ module, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteModule(module.id);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete module');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Delete Module</h3>
          <div className="warning-icon">⚠️</div>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this module?</p>
          
          <div className="module-details">
            <div className="detail-item">
              <span className="detail-label">Title:</span>
              <span className="detail-value">{module.title}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Description:</span>
              <span className="detail-value">{module.description}</span>
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
                Delete Module
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModuleConfirm;