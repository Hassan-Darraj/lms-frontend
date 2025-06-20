import { useState, useEffect } from 'react';
import { getCategories } from '../../services/categoryService';
import CategoryCard from './CategoryCard';
import './CategoryList.css';

const CategoryList = ({ onEdit, onDelete, refreshTrigger }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const response = await getCategories();
        setCategories(response.data.data); // Backend: { success: true, data: categories }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading categories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="category-list-container">
      <div className="section-header">
        <h3 className="section-title">Categories</h3>
        <div className="category-count">
          <span className="count-badge">{categories.length} categories</span>
        </div>
      </div>
      
      <div className="category-grid">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
        
        {categories.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📁</div>
            <h3>No categories found</h3>
            <p>Create your first category to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;