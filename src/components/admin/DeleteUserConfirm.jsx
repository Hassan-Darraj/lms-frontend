import { useState } from 'react';
import { deleteUser } from '../../services/authService';
import './DeleteUserConfirm.css';

const DeleteUserConfirm = ({ user, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteUser(user.id);
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3 className="modal-title danger">Delete User</h3>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this user?</p>
          
          <div className="user-info-card">
            <div className="user-detail">
              <strong>Name:</strong> 
              <span className="user-value">{user.name}</span>
            </div>
            <div className="user-detail">
              <strong>Email:</strong> 
              <span className="user-value">{user.email}</span>
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
            className="btn btn-danger" 
            onClick={handleDelete} 
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserConfirm;