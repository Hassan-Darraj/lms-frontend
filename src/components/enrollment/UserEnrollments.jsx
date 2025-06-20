import { useState, useEffect } from 'react';
import { getUserEnrollmentsWithProgress } from '../../services/enrollmentService';
import './UserEnrollments.css';

const UserEnrollments = ({ userId }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await getUserEnrollmentsWithProgress(userId);
        setEnrollments(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch user enrollments');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchEnrollments();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading enrollments...</p>
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

  const getProgressStatus = (progress) => {
    if (progress === 0) return { status: 'not-started', label: 'Not Started', icon: '⏳', color: '#6b7280' };
    if (progress < 25) return { status: 'beginner', label: 'Getting Started', icon: '🚀', color: '#3b82f6' };
    if (progress < 50) return { status: 'intermediate', label: 'Making Progress', icon: '📈', color: '#f59e0b' };
    if (progress < 75) return { status: 'advanced', label: 'Halfway There', icon: '🎯', color: '#a855f7' };
    if (progress < 100) return { status: 'expert', label: 'Almost Done', icon: '🔥', color: '#ef4444' };
    return { status: 'completed', label: 'Completed', icon: '🎉', color: '#10b981' };
  };

  // Calculate stats
  const completedCount = enrollments.filter(e => e.completed_at).length;
  const inProgressCount = enrollments.filter(e => !e.completed_at && e.progress > 0).length;
  const notStartedCount = enrollments.filter(e => e.progress === 0).length;

  return (
    <div className="user-enrollments-container">
      <div className="section-header">
        <h3 className="section-title">My Enrollments</h3>
        <div className="enrollment-count">
          <span className="count-badge">{enrollments.length} courses</span>
        </div>
      </div>

      <div className="enrollment-stats">
        <div className="stat-item completed">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <span className="stat-number">{completedCount}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-item in-progress">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <span className="stat-number">{inProgressCount}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-item not-started">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <span className="stat-number">{notStartedCount}</span>
            <span className="stat-label">Not Started</span>
          </div>
        </div>
      </div>
      
      <div className="enrollments-grid">
        {enrollments.map(enrollment => {
          const progressInfo = getProgressStatus(enrollment.progress);
          const isCompleted = enrollment.completed_at;
          
          return (
            <div 
              key={enrollment.id} 
              className={`enrollment-item ${progressInfo.status} ${isCompleted ? 'completed' : ''}`}
            >
              <div className="enrollment-header">
                <div className="course-info">
                  <h4 className="course-title">Course #{enrollment.course_id}</h4>
                  <div className="progress-badge" style={{ backgroundColor: progressInfo.color }}>
                    <span className="badge-icon">{progressInfo.icon}</span>
                    <span className="badge-text">{progressInfo.label}</span>
                  </div>
                </div>
                {isCompleted && (
                  <div className="completion-stamp">
                    <span className="stamp-icon">🏆</span>
                    <span className="stamp-text">Completed</span>
                  </div>
                )}
              </div>

              <div className="progress-section">
                <div className="progress-header">
                  <span className="progress-label">Progress</span>
                  <span className="progress-percentage">{enrollment.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${progressInfo.status}`}
                    style={{ 
                      width: `${enrollment.progress}%`,
                      backgroundColor: progressInfo.color 
                    }}
                  >
                    <div className="progress-shine"></div>
                  </div>
                </div>
              </div>

              <div className="enrollment-details">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Enrolled</span>
                    <span className="detail-value">
                      {new Date(enrollment.enrolled_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {enrollment.completed_at && (
                  <div className="detail-item completed">
                    <span className="detail-icon">✅</span>
                    <div className="detail-content">
                      <span className="detail-label">Completed</span>
                      <span className="detail-value">
                        {new Date(enrollment.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="enrollment-actions">
                <button className="action-btn continue-btn">
                  <span className="btn-icon">
                    {enrollment.progress === 0 ? '🚀' : enrollment.progress === 100 ? '🔄' : '▶️'}
                  </span>
                  <span className="btn-text">
                    {enrollment.progress === 0 ? 'Start Course' : enrollment.progress === 100 ? 'Review' : 'Continue'}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
        
        {enrollments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No Enrollments Yet</h3>
            <p>Start your learning journey by enrolling in a course!</p>
            <button className="browse-btn">
              <span className="btn-icon">🔍</span>
              Browse Courses
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEnrollments;