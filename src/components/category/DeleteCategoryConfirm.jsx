import { useState } from 'react';
import { deleteCategory } from '../../services/categoryService';
import './DeleteCategoryConfirm.css';

const DeleteCategoryConfirm = ({ category, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await deleteCategory(category.id);
      onSuccess();
    } catch (error) {
      // Extract error message from response or use a default message
      const errorMessage = error.response?.data?.error || 
                          error.response?.data?.message || 
                          'Failed to delete category. Please try again.';
      setError(errorMessage);
      
      // If there's a specific error about associated courses, make it more visible
      if (errorMessage.includes('associated courses')) {
        setError(
          <>
            <strong>Cannot delete category "{category.name}"</strong>
            <div className="mt-2">This category has associated courses. Please remove or reassign these courses first.</div>
          </>
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Delete Category</h3>
          <div className="warning-icon">⚠️</div>
        </div>
        
        <div className="modal-body">
          <p className="confirmation-text">Are you sure you want to delete this category?</p>
          
          <div className="category-details">
            <div className="detail-item">
              <span className="detail-label">Name:</span>
              <span className="detail-value">{category.name}</span>
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
                Delete Category
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCategoryConfirm;