import { useState, useEffect } from 'react';
import { createLesson, updateLesson, getLessonById } from '../../services/lessonService';
import LessonContentUpload from './LessonContentUpload';
import './LessonForm.css';

const LessonForm = ({ lessonId, moduleId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    module_id: moduleId || '',
    title: '',
    content_type: 'text',
    content_url: '',
    duration: 0,
    order: 1,
    is_free: false
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (lessonId) {
      const fetchLesson = async () => {
        try {
          const response = await getLessonById(lessonId);
          const lesson = response.data.data;
          setFormData({
            module_id: lesson.module_id,
            title: lesson.title,
            content_type: lesson.content_type,
            content_url: lesson.content_url,
            duration: lesson.duration,
            order: lesson.order,
            is_free: lesson.is_free
          });
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch lesson');
        }
      };
      fetchLesson();
    }
  }, [lessonId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Append all form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      // Append file if selected (backend expects "content" field name)
      if (selectedFile) {
        submitData.append('content', selectedFile);
      }

      if (lessonId) {
        await updateLesson(lessonId, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await createLesson(submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              (name === 'duration' || name === 'order') ? parseInt(value) : value
    }));
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{lessonId ? 'Edit Lesson' : 'Create Lesson'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Title:</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Content Type:</label>
            <select
              name="content_type"
              value={formData.content_type}
              onChange={handleChange}
              required
            >
              <option value="text">Text</option>
              <option value="video">Video</option>
              <option value="quiz">Quiz</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>

          <div>
            <label>Content URL (optional):</label>
            <input
              type="url"
              name="content_url"
              value={formData.content_url}
              onChange={handleChange}
              placeholder="External content URL"
            />
          </div>

          <div>
            <label>Duration (minutes):</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="0"
              required
            />
          </div>

          <div>
            <label>Order:</label>
            <input
              type="number"
              name="order"
              value={formData.order}
              onChange={handleChange}
              min="1"
              required
            />
          </div>

          <div>
            <label>
              <input
                type="checkbox"
                name="is_free"
                checked={formData.is_free}
                onChange={handleChange}
              />
              Free Lesson
            </label>
          </div>

          <LessonContentUpload 
            onFileSelect={handleFileSelect}
            currentContent={lessonId ? formData.content_url : null}
          />
          
          {error && <div className="error">{error}</div>}
          
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (lessonId ? 'Update' : 'Create')}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonForm;
