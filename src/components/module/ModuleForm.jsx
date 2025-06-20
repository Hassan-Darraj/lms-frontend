import { useState, useEffect } from 'react';
import { createModule, updateModule, getModuleById } from '../../services/moduleService';
import './ModuleForm.css';

const ModuleForm = ({ moduleId, courseId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    course_id: courseId || '',
    title: '',
    description: '',
    order: 1
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (moduleId) {
      const fetchModule = async () => {
        try {
          const response = await getModuleById(moduleId);
          setFormData(response.data.data);
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch module');
        }
      };
      fetchModule();
    }
  }, [moduleId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (moduleId) {
        await updateModule(moduleId, formData);
      } else {
        await createModule(formData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save module');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) : value
    }));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>{moduleId ? 'Edit Module' : 'Create Module'}</h3>
        
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
            <label>Description:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
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
          
          {error && <div className="error">{error}</div>}
          
          <div>
            <button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (moduleId ? 'Update' : 'Create')}
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

export default ModuleForm;
