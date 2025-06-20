import { useState } from 'react';
import { format } from 'date-fns';
import Button from '../common/Button';
import './ModuleCard.css';

const ModuleCard = ({ module, onEdit, onDelete, onView }) => {
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this module? This action cannot be undone.')) {
      setIsDeleting(true);
      onDelete(module);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit(module);
  };

  const handleViewClick = (e) => {
    e.stopPropagation();
    onView(module);
  };

  return (
    <div 
      className={`module-card ${isDeleting ? 'deleting' : ''}`}
      onClick={handleViewClick}
    >
      <div className="module-header">
        <div className="module-order">
          <span className="order-badge">#{module.order}</span>
        </div>
        <h3 className="module-title">{module.title}</h3>
      </div>
      
      {module.description && (
        <p className="module-description">{module.description}</p>
      )}
      
      <div className="module-meta">
        <div className="meta-item">
          <span className="meta-label">Created:</span>
          <span className="meta-value">
            {module.created_at ? format(new Date(module.created_at), 'MMM d, yyyy') : 'N/A'}
          </span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Lessons:</span>
          <span className="meta-value">
            {module.lesson_count || 0}
          </span>
        </div>
      </div>
      
      <div className="module-actions">
        <Button
          variant="primary"
          size="small"
          onClick={handleViewClick}
          icon="📚"
          className="view-lessons-btn"
        >
          View Lessons
        </Button>
        
        <div className="action-buttons">
          <Button
            variant="icon"
            size="small"
            onClick={handleEditClick}
            title="Edit Module"
            className="edit-btn"
          >
            ✏️
          </Button>
          
          <Button
            variant="icon"
            size="small"
            onClick={handleDeleteClick}
            title="Delete Module"
            className="delete-btn"
            disabled={isDeleting}
          >
            {isDeleting ? '🗑️' : '🗑️'}
          </Button>
        </div>
      </div>
      
      {isDeleting && (
        <div className="deleting-overlay">
          <div className="spinner"></div>
          <span>Deleting...</span>
        </div>
      )}
    </div>
  );
};

export default ModuleCard;
