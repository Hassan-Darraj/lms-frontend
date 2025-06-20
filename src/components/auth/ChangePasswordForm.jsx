import { useState } from 'react';
import { changePassword } from '../../services/authService';
import './ChangePasswordForm.css';

const ChangePasswordForm = ({ onSuccess, onError }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await changePassword(formData);
      onSuccess?.(response.data.message);
      setFormData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      onError?.(error.response?.data?.error || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="password-form-container">
      <div className="form-header">
        <h3 className="form-title">Change Password</h3>
        <div className="form-icon">🔐</div>
      </div>
      
      <form onSubmit={handleSubmit} className="password-form">
        <div className="form-group">
          <label className="form-label">Current Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your current password"
              required
            />
            <span className="input-icon">🔒</span>
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">New Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your new password"
              required
            />
            <span className="input-icon">🔑</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="btn-spinner"></div>
                Changing...
              </>
            ) : (
              <>
                <span className="btn-icon">🔄</span>
                Change Password
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;