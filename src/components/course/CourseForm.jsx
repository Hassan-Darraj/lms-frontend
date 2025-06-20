import { useState, useEffect } from 'react';
import { createCourse, updateCourse, getCourseById } from '../../services/courseService';
import { getCategories } from '../../services/categoryService';
import { getAllUsers } from '../../services/authService';
import CourseThumbnailUpload from './CourseThumbnailUpload';
import './CourseForm.css';

const CourseForm = ({ courseId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructor_id: '',
    category_id: '',
    price: 0,
    is_published: false,
    is_approved: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await getCategories();
        setCategories(categoriesResponse.data.data);
        
        // Fetch all users and filter for instructors
        console.log('Fetching instructors...');
        const usersResponse = await getAllUsers({ role: 'instructor' });
        console.log('Instructors response:', usersResponse);
        
        // Extract and filter users to only include instructors
        const allUsers = usersResponse?.data?.users || [];
        const instructorsData = allUsers.filter(user => user.role === 'instructor');
        console.log('Filtered instructors data:', instructorsData);
        
        setInstructors(instructorsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        console.error('Error details:', error.response?.data || error.message);
        setError('Failed to load required data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (courseId) {
      const fetchCourse = async () => {
        try {
          const response = await getCourseById(courseId);
          const course = response.data.data;
          setFormData({
            title: course.title,
            description: course.description,
            instructor_id: course.instructor_id,
            category_id: course.category_id,
            price: course.price,
            is_published: course.is_published,
            is_approved: course.is_approved
          });
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch course');
        }
      };
      fetchCourse();
    }
  }, [courseId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Prepare the data object with all required fields
      const courseData = {
        title: formData.title || '',
        description: formData.description || '',
        category: formData.category_id || '',
        instructor_id: formData.instructor_id ? Number(formData.instructor_id) : null,
        price: Number(formData.price) || 0,
        is_published: Boolean(formData.is_published),
        is_approved: Boolean(formData.is_approved),
        thumbnail_url: formData.thumbnail_url || ''
      };
      
      // Log the data being sent
      console.log('Prepared course data:', courseData);
      
      // Append all fields to FormData
      Object.entries(courseData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          // Convert boolean values to 'true'/'false' strings if needed
          const valueToAppend = typeof value === 'boolean' ? String(value) : value;
          submitData.append(key, valueToAppend);
        }
      });

      // Handle thumbnail file upload
      if (selectedFile) {
        submitData.append('thumbnail', selectedFile);
      }
      
      // Log FormData contents for debugging
      for (let pair of submitData.entries()) {
        console.log(pair[0] + ': ', pair[1]);
      }



      // Add headers for file upload
      const config = {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      };

      let response;
      if (courseId) {
        console.log('Updating course with ID:', courseId);
        response = await updateCourse(courseId, submitData, config);
      } else {
        console.log('Creating new course');
        response = await createCourse(submitData, config);
      }
      
      console.log('API Response:', response.data);
      onSuccess();
    } catch (error) {
      // Enhanced error handling with more detailed logging
      console.error('API Error:', error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
        console.error('Error headers:', error.response.headers);
        
        // Handle validation errors
        if (error.response.data.errors) {
          const errors = Object.entries(error.response.data.errors)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          setError(`Validation failed:\n${errors}`);
        } else {
          setError(error.response.data.message || 
                  error.response.data.error || 
                  `Request failed with status ${error.response.status}`);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
        setError(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{courseId ? 'Edit Course' : 'Create Course'}</h3>
          <div className="form-icon">📚</div>
        </div>
        
        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-section">
            <h4 className="section-title">Course Information</h4>
            
            <div className="form-group">
              <label className="form-label">Course Title</label>
              <div className="input-wrapper">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Enter course title..."
                  required
                />
                <span className="input-icon">📝</span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <div className="textarea-wrapper">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="form-textarea"
                  placeholder="Describe your course..."
                  rows="4"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Course Details</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Instructor</label>
                <div className="select-wrapper">
                  <select
                    name="instructor_id"
                    value={formData.instructor_id || ''}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Instructor</option>
                    {instructors.map(instructor => (
                      <option key={instructor.id} value={instructor.id}>
                        {instructor.name} ({instructor.email})
                      </option>
                    ))}
                  </select>
                  <span className="select-icon">▼</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <div className="select-wrapper">
                  <select
                    name="category_id"
                    value={formData.category_id}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <span className="select-icon">▼</span>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Price (USD)</label>
              <div className="input-wrapper">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
                <span className="input-icon">💰</span>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Course Settings</h4>
            
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_published"
                  checked={formData.is_published}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  <strong>Published</strong>
                  <small>Make this course visible to students</small>
                </span>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="is_approved"
                  checked={formData.is_approved}
                  onChange={handleChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  <strong>Approved</strong>
                  <small>Course has been reviewed and approved</small>
                </span>
              </label>
            </div>
          </div>

          <div className="form-section">
            <h4 className="section-title">Course Thumbnail</h4>
            <CourseThumbnailUpload 
              onFileSelect={handleFileSelect}
              currentThumbnail={formData.thumbnail_url || null}
            />
          </div>
          
          {error && (
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="action-btn cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="action-btn submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">{courseId ? '✏️' : '➕'}</span>
                  {courseId ? 'Update Course' : 'Create Course'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;