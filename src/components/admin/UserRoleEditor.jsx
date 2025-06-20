import { useState } from 'react';
import { updateUserRole } from '../../services/authService';
import './UserRoleEditor.css';

const UserRoleEditor = ({ user, onSuccess, onCancel }) => {
  const [role, setRole] = useState(user.role);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await updateUserRole(user.id, { role });
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  const getRoleDescription = (roleValue) => {
    switch (roleValue) {
      case 'student':
        return 'Can enroll in courses and submit assignments';
      case 'instructor':
        return 'Can create and manage courses, grade assignments';
      case 'admin':
        return 'Full system access including user management';
      default:
        return '';
    }
  };

  const getRoleIcon = (roleValue) => {
    switch (roleValue) {
      case 'student': return '🎓';
      case 'instructor': return '👨‍🏫';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="role-editor-modal">
        <div className="modal-header">
          <h3 className="modal-title">
            <span className="title-icon">✏️</span>
            Edit User Role
          </h3>
        </div>
        
        <div className="modal-body">
          <div className="user-info-section">
            <div className="user-avatar-large">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h4 className="user-name">{user.name}</h4>
              <p className="user-email">{user.email}</p>
              <span className={`current-role-badge role-${user.role}`}>
                Current: {user.role}
              </span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="role-form">
            <div className="form-group">
              <label className="form-label">Select New Role:</label>
              <div className="role-options">
                {['student', 'instructor', 'admin'].map((roleOption) => (
                  <label key={roleOption} className={`role-option ${role === roleOption ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="role"
                      value={roleOption}
                      checked={role === roleOption}
                      onChange={(e) => setRole(e.target.value)}
                      className="role-radio"
                    />
                    <div className="role-card">
                      <div className="role-header">
                        <span className="role-icon">{getRoleIcon(roleOption)}</span>
                        <span className="role-name">{roleOption}</span>
                      </div>
                      <p className="role-description">
                        {getRoleDescription(roleOption)}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}
            
            <div className="modal-footer">
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || role === user.role}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Updating...
                  </>
                ) : (
                  'Update Role'
                )}
              </button>
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserRoleEditor;