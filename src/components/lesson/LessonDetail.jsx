import { useState, useEffect } from 'react';
import { getLessonById } from '../../services/lessonService';
import './LessonDetail.css';

const LessonDetail = ({ lessonId, onClose }) => {
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true);
      try {
        const response = await getLessonById(lessonId);
        setLesson(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch lesson');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
    }
  }, [lessonId]);

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading lesson...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="error-container">
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              Error: {error}
            </div>
            <button className="action-btn close-btn" onClick={onClose}>
              <span className="btn-icon">✕</span>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Lesson not found</h3>
            <p>The requested lesson could not be found.</p>
            <button className="action-btn close-btn" onClick={onClose}>
              <span className="btn-icon">✕</span>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const getContentTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'badge-video';
      case 'audio': return 'badge-audio';
      case 'document': return 'badge-document';
      case 'quiz': return 'badge-quiz';
      default: return 'badge-default';
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content lesson-detail-modal">
        <div className="modal-header">
          <div className="header-content">
            <h2 className="lesson-title">{lesson.title}</h2>
            <button className="close-button" onClick={onClose} title="Close">
              <span className="btn-icon">✕</span>
            </button>
          </div>
          <div className="lesson-meta">
            <span className={`content-type-badge ${getContentTypeBadgeClass(lesson.content_type)}`}>
              {lesson.content_type}
            </span>
            <span className={`free-badge ${lesson.is_free ? 'badge-free' : 'badge-premium'}`}>
              <span className="badge-dot"></span>
              {lesson.is_free ? 'Free' : 'Premium'}
            </span>
          </div>
        </div>

        <div className="modal-body">
          <div className="lesson-details-grid">
            <div className="detail-card">
              <div className="detail-icon">⏱️</div>
              <div className="detail-content">
                <span className="detail-label">Duration</span>
                <span className="detail-value">{lesson.duration} minutes</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">📋</div>
              <div className="detail-content">
                <span className="detail-label">Order</span>
                <span className="detail-value">Lesson {lesson.order}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">🎯</div>
              <div className="detail-content">
                <span className="detail-label">Type</span>
                <span className="detail-value">{lesson.content_type}</span>
              </div>
            </div>

            <div className="detail-card">
              <div className="detail-icon">💎</div>
              <div className="detail-content">
                <span className="detail-label">Access</span>
                <span className="detail-value">{lesson.is_free ? 'Free Access' : 'Premium Only'}</span>
              </div>
            </div>
          </div>

          {lesson.content_url && (
            <div className="content-section">
              <div className="content-header">
                <h3 className="content-title">
                  <span className="content-icon">🎬</span>
                  Lesson Content
                </h3>
              </div>
              
              <div className="content-container">
                {lesson.content_type === 'video' ? (
                  <div className="video-container">
                    <video controls className="lesson-video">
                      <source src={lesson.content_url} />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <div className="content-link-container">
                    <a 
                      href={lesson.content_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="content-link"
                    >
                      <span className="link-icon">🔗</span>
                      <span className="link-text">View Content</span>
                      <span className="link-arrow">→</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="action-btn close-btn" onClick={onClose}>
            <span className="btn-icon">✕</span>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonDetail;