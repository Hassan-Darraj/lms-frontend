import './CategoryCard.css';

const CategoryCard = ({ category, onEdit, onDelete }) => {
  return (
    <div className="category-card">
      <div className="category-header">
        <div className="category-icon">📁</div>
        <h4 className="category-name">{category.name}</h4>
      </div>
      
      <div className="category-details">
        <div className="detail-item">
          <span className="detail-label">Created:</span>
          <span className="detail-value">{new Date(category.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      <div className="category-actions">
        <button 
          className="action-btn edit-btn"
          onClick={() => onEdit(category)}
          title="Edit Category"
        >
          <span className="btn-icon">✏️</span>
          Edit
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(category)}
          title="Delete Category"
        >
          <span className="btn-icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;