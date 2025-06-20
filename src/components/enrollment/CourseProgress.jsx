import { useState, useEffect } from 'react';
import { getCourseProgress } from '../../services/enrollmentService';
import './CourseProgress.css';

const CourseProgress = ({ userId, courseId }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getCourseProgress(userId, courseId);
        setProgress(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch course progress');
      } finally {
        setLoading(false);
      }
    };

    if (userId && courseId) {
      fetchProgress();
    }
  }, [userId, courseId]);

  if (loading) {
    return (
      <div className="progress-loading">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading course progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="progress-error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          Error: {error}
        </div>
      </div>
    );
  }

  if (!progress && progress !== 0) {
    return (
      <div className="progress-empty">
        <div className="empty-message">
          <span className="empty-icon">📊</span>
          <p>No progress data available</p>
        </div>
      </div>
    );
  }

  const getProgressStatus = (percentage) => {
    if (percentage === 0) return { status: 'not-started', label: 'Not Started', icon: '⏳' };
    if (percentage < 25) return { status: 'just-started', label: 'Just Started', icon: '🚀' };
    if (percentage < 50) return { status: 'in-progress', label: 'In Progress', icon: '📈' };
    if (percentage < 75) return { status: 'halfway', label: 'Halfway There', icon: '🎯' };
    if (percentage < 100) return { status: 'almost-done', label: 'Almost Done', icon: '🔥' };
    return { status: 'completed', label: 'Completed', icon: '🎉' };
  };

  const progressInfo = getProgressStatus(progress);

  return (
    <div className="course-progress-container">
      <div className="progress-header">
        <h3 className="progress-title">Detailed Course Progress</h3>
        <div className={`progress-status ${progressInfo.status}`}>
          <span className="status-icon">{progressInfo.icon}</span>
          <span className="status-label">{progressInfo.label}</span>
        </div>
      </div>
      
      <div className="progress-content">
        <div className="progress-summary">
          <div className="progress-percentage">
            <span className="percentage-value">{progress}%</span>
            <span className="percentage-label">Complete</span>
          </div>
          
          <div className="progress-visual">
            <div className="progress-circle">
              <svg className="progress-ring" width="120" height="120">
                <circle
                  className="progress-ring-background"
                  stroke="var(--gray-light)"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                />
                <circle
                  className="progress-ring-progress"
                  stroke="url(#progressGradient)"
                  strokeWidth="8"
                  fill="transparent"
                  r="52"
                  cx="60"
                  cy="60"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--secondary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-center">
                <span className="center-percentage">{progress}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="progress-bar-section">
          <div className="progress-bar-header">
            <span className="bar-label">Overall Progress</span>
            <span className="bar-percentage">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progressInfo.status}`}
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          <div className="progress-milestones">
            <div className={`milestone ${progress >= 25 ? 'reached' : ''}`}>
              <div className="milestone-marker">25%</div>
              <div className="milestone-label">Beginner</div>
            </div>
            <div className={`milestone ${progress >= 50 ? 'reached' : ''}`}>
              <div className="milestone-marker">50%</div>
              <div className="milestone-label">Intermediate</div>
            </div>
            <div className={`milestone ${progress >= 75 ? 'reached' : ''}`}>
              <div className="milestone-marker">75%</div>
              <div className="milestone-label">Advanced</div>
            </div>
            <div className={`milestone ${progress >= 100 ? 'reached' : ''}`}>
              <div className="milestone-marker">100%</div>
              <div className="milestone-label">Expert</div>
            </div>
          </div>
        </div>

        <div className="progress-insights">
          <div className="insight-card">
            <div className="insight-icon">🎯</div>
            <div className="insight-content">
              <h4>Keep Going!</h4>
              <p>
                {progress === 100 
                  ? "Congratulations! You've completed this course."
                  : progress >= 75
                  ? "You're almost there! Just a little more to go."
                  : progress >= 50
                  ? "Great progress! You're halfway through the course."
                  : progress >= 25
                  ? "Good start! Keep up the momentum."
                  : "Every expert was once a beginner. Start your journey!"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;