import { useState, useEffect } from 'react';
import { createCategory, updateCategory, getCategoryById } from '../../services/categoryService';
import { getCoursesByCategory } from '../../services/courseService';
import { FiX, FiSave, FiTag, FiBook } from 'react-icons/fi';
import './CategoryForm.css';

const CategoryForm = ({ categoryId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
  });
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      if (!categoryId) return;
      
      setLoading(true);
      try {
        const response = await getCategoryById(categoryId);
        const { name } = response.data.data;
        setFormData({
          name: name || '',
        });
        await fetchCategoryCourses(categoryId);
      } catch (error) {
        console.error('Error fetching category:', error);
        setError(error.response?.data?.error || 'Failed to fetch category');
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoryCourses = async (categoryId) => {
      if (!categoryId) return;
      
      setLoadingCourses(true);
      try {
        const response = await getCoursesByCategory(categoryId);
        setCourses(response.data.data || []);
      } catch (error) {
        console.error('Error fetching category courses:', error);
        setError('Failed to load courses in this category');
      } finally {
        setLoadingCourses(false);
      }
    };
    
    fetchCategory();
  }, [categoryId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const categoryData = {
        name: formData.name.trim(),
      };
      
      if (categoryId) {
        await updateCategory(categoryId, categoryData);
      } else {
        await createCategory(categoryData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error saving category:', error);
      setError(error.response?.data?.error || 'Failed to save category. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            <FiTag className="title-icon" />
            {categoryId ? 'Edit Category' : 'Create New Category'}
          </h2>
          <button 
            type="button" 
            className="close-button" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="modal-body">
          {error && (
            <div className="error-message">
              <FiX className="error-icon" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="category-form">
            <div className="form-section">
              <h4 className="section-title">Basic Information</h4>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    Category Name <span className="required">*</span>
                  </label>
                  <div className="input-wrapper">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter category name"
                      required
                      disabled={isSubmitting}
                    />
                    <span className="input-icon">🏷️</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Courses in this category */}
            {categoryId && (
              <div className="courses-section">
                <h4 className="section-title">
                  <FiBook className="title-icon" />
                  Courses in this category
                </h4>
                {loadingCourses ? (
                  <div className="loading-text">Loading courses...</div>
                ) : courses.length > 0 ? (
                  <div className="courses-grid">
                    {courses.map((course, index) => (
                      <div key={`${course.title}-${index}`} className="course-card">
                        <div className="course-header">
                          <h5 className="course-title">{course.title}</h5>
                        </div>
                        {course.description && (
                          <p className="course-description">
                            {course.description.length > 150 
                              ? `${course.description.substring(0, 150)}...` 
                              : course.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-courses">
                    No courses found in this category.
                  </div>
                )}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                onClick={onCancel}
                className="btn btn-secondary"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isSubmitting || !formData.name.trim()}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner"></span>
                    {categoryId ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <FiSave className="btn-icon" />
                    {categoryId ? 'Update Category' : 'Create Category'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryForm;
