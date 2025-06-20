import { useState, useEffect } from 'react';
import { getCourseProgress } from '../../services/enrollmentService';
import './ProgressTracker.css';

const ProgressTracker = ({ userId, courseId, variant = 'default' }) => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const response = await getCourseProgress(userId, courseId);
        setProgress(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch progress');
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
      <div className={`progress-tracker loading ${variant}`}>
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
          <p>Loading progress...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`progress-tracker error ${variant}`}>
        <div className="error-content">
          <span className="error-icon">⚠️</span>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (progress === null || progress === undefined) {
    return (
      <div className={`progress-tracker empty ${variant}`}>
        <div className="empty-content">
          <span className="empty-icon">📊</span>
          <p>No progress data</p>
        </div>
      </div>
    );
  }

  const getProgressStatus = (percentage) => {
    if (percentage === 0) return { status: 'not-started', label: 'Not Started', icon: '⏳' };
    if (percentage < 25) return { status: 'beginner', label: 'Getting Started', icon: '🚀' };
    if (percentage < 50) return { status: 'intermediate', label: 'Making Progress', icon: '📈' };
    if (percentage < 75) return { status: 'advanced', label: 'Halfway There', icon: '🎯' };
    if (percentage < 100) return { status: 'expert', label: 'Almost Done', icon: '🔥' };
    return { status: 'completed', label: 'Completed', icon: '🎉' };
  };

  const progressInfo = getProgressStatus(progress);

  return (
    <div className={`progress-tracker ${variant} ${progressInfo.status}`}>
      <div className="progress-header">
        <h3 className="progress-title">Course Progress</h3>
        <div className="progress-status">
          <span className="status-icon">{progressInfo.icon}</span>
          <span className="status-label">{progressInfo.label}</span>
        </div>
      </div>
      
      <div className="progress-content">
        <div className="progress-visual">
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progressInfo.status}`}
              style={{ width: `${progress}%` }}
            >
              <div className="progress-shine"></div>
            </div>
          </div>
          
          <div className="progress-percentage">
            <span className="percentage-value">{progress}%</span>
            <span className="percentage-label">Complete</span>
          </div>
        </div>

        {variant === 'detailed' && (
          <div className="progress-milestones">
            <div className={`milestone ${progress >= 25 ? 'reached' : ''}`}>
              <div className="milestone-marker">25%</div>
              <div className="milestone-label">Quarter</div>
            </div>
            <div className={`milestone ${progress >= 50 ? 'reached' : ''}`}>
              <div className="milestone-marker">50%</div>
              <div className="milestone-label">Half</div>
            </div>
            <div className={`milestone ${progress >= 75 ? 'reached' : ''}`}>
              <div className="milestone-marker">75%</div>
              <div className="milestone-label">Three-quarters</div>
            </div>
            <div className={`milestone ${progress >= 100 ? 'reached' : ''}`}>
              <div className="milestone-marker">100%</div>
              <div className="milestone-label">Complete</div>
            </div>
          </div>
        )}

        {variant === 'detailed' && (
          <div className="progress-insights">
            <div className="insight-message">
              {progress === 100 
                ? "🎊 Congratulations! You've mastered this course!"
                : progress >= 75
                ? "🔥 You're on fire! Just a little more to go."
                : progress >= 50
                ? "💪 Great momentum! Keep pushing forward."
                : progress >= 25
                ? "👍 Good start! You're building great habits."
                : "🌟 Ready to begin your learning journey?"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;