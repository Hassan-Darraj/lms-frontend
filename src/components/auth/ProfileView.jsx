import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import './ProfileView.css';

const ProfileView = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user); // Backend: { success: true, user }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getRoleIcon = (role) => {
    switch (role) {
      case 'student': return '🎓';
      case 'instructor': return '👨‍🏫';
      case 'admin': return '👑';
      default: return '👤';
    }
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'instructor': return 'badge-instructor';
      case 'student': return 'badge-student';
      default: return 'badge-default';
    }
  };

  const getJoinedTimeAgo = (createdAt) => {
    if (!createdAt) return 'Recently';
    
    const now = new Date();
    const created = new Date(createdAt);
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months !== 1 ? 's' : ''} ago`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years !== 1 ? 's' : ''} ago`;
    }
  };

  if (loading) {
    return (
      <div className="profile-view-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-view-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Profile</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-view-container">
        <div className="no-data-state">
          <div className="no-data-icon">👤</div>
          <h3>No User Data</h3>
          <p>Unable to load profile information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-view-container">
      <div className="profile-header">
        <h2 className="section-title">
          <span className="title-icon">👤</span>
          My Profile
        </h2>
        <p className="section-subtitle">View and manage your account information</p>
      </div>

      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="avatar-status">
              <div className="status-dot active"></div>
              <span className="status-text">Online</span>
            </div>
          </div>

          <div className="profile-info">
            <div className="user-identity">
              <h3 className="user-name">{user.name}</h3>
              <div className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                <span className="role-icon">{getRoleIcon(user.role)}</span>
                <span className="role-text">{user.role}</span>
              </div>
            </div>

            <div className="user-details">
              <div className="detail-item">
                <div className="detail-icon">📧</div>
                <div className="detail-content">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{user.email}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">🎯</div>
                <div className="detail-content">
                  <span className="detail-label">Account Role</span>
                  <span className="detail-value">{user.role}</span>
                </div>
              </div>

              <div className="detail-item">
                <div className="detail-icon">📅</div>
                <div className="detail-content">
                  <span className="detail-label">Member Since</span>
                  <span className="detail-value">
                    {user.created_at ? getJoinedTimeAgo(user.created_at) : 'Recently'}
                  </span>
                </div>
              </div>

              {user.last_login && (
                <div className="detail-item">
                  <div className="detail-icon">🕒</div>
                  <div className="detail-content">
                    <span className="detail-label">Last Login</span>
                    <span className="detail-value">
                      {new Date(user.last_login).toLocaleString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">📚</div>
              <div className="stat-content">
                <span className="stat-value">
                  {user.courses_count || 0}
                </span>
                <span className="stat-label">
                  {user.role === 'instructor' ? 'Courses Created' : 'Courses Enrolled'}
                </span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">🎯</div>
              <div className="stat-content">
                <span className="stat-value">
                  {user.assignments_count || 0}
                </span>
                <span className="stat-label">
                  {user.role === 'instructor' ? 'Assignments Created' : 'Assignments Completed'}
                </span>
              </div>
            </div>

            {user.role === 'student' && (
              <div className="stat-card">
                <div className="stat-icon">⭐</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {user.average_grade || 'N/A'}
                  </span>
                  <span className="stat-label">Average Grade</span>
                </div>
              </div>
            )}

            {user.role === 'instructor' && (
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-content">
                  <span className="stat-value">
                    {user.students_count || 0}
                  </span>
                  <span className="stat-label">Total Students</span>
                </div>
              </div>
            )}

            {user.role === 'admin' && (
              <div className="stat-card">
                <div className="stat-icon">🔧</div>
                <div className="stat-content">
                  <span className="stat-value">Admin</span>
                  <span className="stat-label">System Access</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="profile-actions">
          <button className="btn btn-primary">
            <span className="btn-icon">✏️</span>
            Edit Profile
          </button>
          <button className="btn btn-secondary">
            <span className="btn-icon">🔒</span>
            Change Password
          </button>
          <button className="btn btn-secondary">
            <span className="btn-icon">⚙️</span>
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;