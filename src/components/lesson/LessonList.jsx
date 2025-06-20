import { useState, useEffect } from 'react';
import { getLessonsByModule } from '../../services/lessonService';
import LessonCard from './LessonCard';
import './LessonList.css';

const LessonList = ({ moduleId, onEdit, onDelete, onView, refreshTrigger }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLessons = async () => {
      if (!moduleId) return;
      
      setLoading(true);
      try {
        const response = await getLessonsByModule(moduleId);
        setLessons(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch lessons');
      } finally {
        setLoading(false);
      }
    };

    fetchLessons();
  }, [moduleId, refreshTrigger]);

  if (loading) {
    return (
      <div className="lesson-list-container">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading lessons...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-list-container">
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="lesson-list-container">
      <div className="section-header">
        <h3 className="section-title">Module Lessons</h3>
        <div className="lesson-count">
          <span className="count-badge">{lessons.length} lessons</span>
        </div>
      </div>
      
      <div className="lesson-grid">
        {lessons.map(lesson => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>

      {lessons.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No lessons found</h3>
          <p>There are no lessons in this module yet.</p>
        </div>
      )}
    </div>
  );
};

// LessonCard Component
const LessonCardComponent = ({ lesson, onEdit, onDelete, onView }) => {
  const getContentTypeBadgeClass = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return 'badge-video';
      case 'audio': return 'badge-audio';
      case 'document': return 'badge-document';
      case 'quiz': return 'badge-quiz';
      default: return 'badge-default';
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'video': return '🎬';
      case 'audio': return '🎵';
      case 'document': return '📄';
      case 'quiz': return '❓';
      default: return '📚';
    }
  };

  return (
    <div className="lesson-card">
      <div className="lesson-card-header">
        <div className="lesson-icon">
          {getContentTypeIcon(lesson.content_type)}
        </div>
        <div className="lesson-badges">
          <span className={`content-type-badge ${getContentTypeBadgeClass(lesson.content_type)}`}>
            {lesson.content_type}
          </span>
          <span className={`free-badge ${lesson.is_free ? 'badge-free' : 'badge-premium'}`}>
            <span className="badge-dot"></span>
            {lesson.is_free ? 'Free' : 'Premium'}
          </span>
        </div>
      </div>

      <div className="lesson-card-content">
        <h4 className="lesson-title">{lesson.title}</h4>
        
        <div className="lesson-meta">
          <div className="meta-item">
            <span className="meta-icon">⏱️</span>
            <span className="meta-text">{lesson.duration} min</span>
          </div>
          <div className="meta-item">
            <span className="meta-icon">📋</span>
            <span className="meta-text">Lesson {lesson.order}</span>
          </div>
        </div>

        {lesson.description && (
          <p className="lesson-description">{lesson.description}</p>
        )}
      </div>

      <div className="lesson-card-footer">
        <div className="action-buttons">
          <button 
            className="action-btn view-btn"
            onClick={() => onView(lesson)}
            title="View Lesson"
          >
            <span className="btn-icon">👁️</span>
            View
          </button>
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(lesson)}
            title="Edit Lesson"
          >
            <span className="btn-icon">✏️</span>
            Edit
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(lesson)}
            title="Delete Lesson"
          >
            <span className="btn-icon">🗑️</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonList;