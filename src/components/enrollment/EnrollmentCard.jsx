import './EnrollmentCard.css';

const EnrollmentCard = ({ enrollment, onDelete, canDelete }) => {
  const getProgressStatus = (progress) => {
    if (progress === 0) return { status: 'not-started', label: 'Not Started', color: '#6b7280' };
    if (progress < 25) return { status: 'beginner', label: 'Beginner', color: '#3b82f6' };
    if (progress < 50) return { status: 'intermediate', label: 'Intermediate', color: '#f59e0b' };
    if (progress < 75) return { status: 'advanced', label: 'Advanced', color: '#a855f7' };
    if (progress < 100) return { status: 'expert', label: 'Expert', color: '#ef4444' };
    return { status: 'completed', label: 'Completed', color: '#10b981' };
  };

  const progressInfo = getProgressStatus(enrollment.progress);
  const isCompleted = enrollment.completed_at;

  return (
    <div className={`enrollment-card ${isCompleted ? 'completed' : ''}`}>
      <div className="enrollment-header">
        <div className="enrollment-status">
          <div 
            className={`status-indicator ${progressInfo.status}`}
            style={{ backgroundColor: progressInfo.color }}
          ></div>
          <span className="status-label">{progressInfo.label}</span>
        </div>
        {isCompleted && (
          <div className="completion-badge">
            <span className="badge-icon">🎉</span>
            <span className="badge-text">Completed</span>
          </div>
        )}
      </div>

      <div className="enrollment-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">User ID:</span>
            <span className="detail-value user-id">{enrollment.user_id}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Course ID:</span>
            <span className="detail-value course-id">{enrollment.course_id}</span>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-label">Enrolled:</span>
            <span className="detail-value date">
              {new Date(enrollment.enrolled_at).toLocaleDateString()}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Completed:</span>
            <span className="detail-value date">
              {enrollment.completed_at 
                ? new Date(enrollment.completed_at).toLocaleDateString() 
                : 'Not completed'
              }
            </span>
          </div>
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
      </div>
      
      {canDelete && onDelete && (
        <div className="enrollment-actions">
          <button 
            className="delete-btn"
            onClick={() => onDelete(enrollment)}
            title="Delete enrollment"
          >
            <span className="btn-icon">🗑️</span>
            <span className="btn-text">Delete Enrollment</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrollmentCard;