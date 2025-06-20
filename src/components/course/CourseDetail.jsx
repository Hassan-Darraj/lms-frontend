import { useState, useEffect } from 'react';
import { getCourseById } from '../../services/courseService';
import './CourseDetail.css';

const CourseDetail = ({ courseId, onClose }) => {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await getCourseById(courseId);
        setCourse(response.data.data); // Backend: { success: true, data: course }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

  const getPriceDisplay = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getStatusInfo = (isPublished, isApproved) => {
    if (!isPublished) {
      return { text: 'Draft', className: 'status-draft', icon: '📝' };
    } else if (!isApproved) {
      return { text: 'Pending Review', className: 'status-pending', icon: '⏳' };
    } else {
      return { text: 'Published', className: 'status-published', icon: '✅' };
    }
  };

  if (loading) {
    return (
      <div className="modal-overlay">
        <div className="course-detail-modal">
          <div className="loading-container">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading course details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modal-overlay">
        <div className="course-detail-modal">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h3>Error Loading Course</h3>
            <p>{error}</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="modal-overlay">
        <div className="course-detail-modal">
          <div className="not-found-container">
            <div className="not-found-icon">📚</div>
            <h3>Course Not Found</h3>
            <p>The course you're looking for doesn't exist.</p>
            <button className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(course.is_published, course.is_approved);
  const isFree = course.price === 0;

  return (
    <div className="modal-overlay">
      <div className="course-detail-modal">
        <div className="modal-header">
          <div className="header-left">
            <h2 className="course-title">Course Details</h2>
            <div className="course-badges">
              <div className={`status-badge ${statusInfo.className}`}>
                <span className="badge-icon">{statusInfo.icon}</span>
                {statusInfo.text}
              </div>
              {isFree && (
                <div className="price-badge free">
                  <span className="badge-icon">🎁</span>
                  Free Course
                </div>
              )}
            </div>
          </div>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          <div className="course-hero">
            <div className="course-image-section">
              {course.thumbnail_url ? (
                <img 
                  src={course.thumbnail_url} 
                  alt={course.title}
                  className="course-image"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`course-placeholder ${course.thumbnail_url ? 'hidden' : ''}`}>
                <span className="placeholder-icon">📚</span>
                <span className="placeholder-text">Course Thumbnail</span>
              </div>
            </div>

            <div className="course-info-section">
              <h1 className="course-name">{course.title}</h1>
              
              <div className="course-price-section">
                {isFree ? (
                  <div className="free-price">
                    <span className="free-icon">🎁</span>
                    <span className="free-text">Free Course</span>
                  </div>
                ) : (
                  <div className="paid-price">
                    <span className="price-currency">$</span>
                    <span className="price-amount">{course.price}</span>
                  </div>
                )}
              </div>

              <p className="course-description">{course.description}</p>

                
            </div>
          </div>

          <div className="course-details-grid">
            <div className="detail-section">
              <h3 className="section-title">
                <span className="title-icon">ℹ️</span>
                Course Information
              </h3>
              
              <div className="detail-items">
                <div className="detail-item">
                  <div className="detail-icon">👨‍🏫</div>
                  <div className="detail-content">
                    <span className="detail-label">Instructor</span>
                    <span className="detail-value">
                      {course.instructor_name || 'N/A'}
                      {course.instructor_email && ` (${course.instructor_email})`}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📂</div>
                  <div className="detail-content">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">
                      {course.category_name || 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">💰</div>
                  <div className="detail-content">
                    <span className="detail-label">Price</span>
                    <span className="detail-value">{getPriceDisplay(course.price)}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📊</div>
                  <div className="detail-content">
                    <span className="detail-label">Status</span>
                    <span className={`detail-value ${statusInfo.className}`}>
                      {statusInfo.icon} {statusInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3 className="section-title">
                <span className="title-icon">🔍</span>
                Additional Details
              </h3>
              
              <div className="detail-items">
                <div className="detail-item">
                  <div className="detail-icon">✅</div>
                  <div className="detail-content">
                    <span className="detail-label">Approved</span>
                    <span className="detail-value">
                      {course.is_approved ? '✅ Yes' : '❌ No'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">📅</div>
                  <div className="detail-content">
                    <span className="detail-label">Created</span>
                    <span className="detail-value">
                      {course.created_at ? new Date(course.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🔄</div>
                  <div className="detail-content">
                    <span className="detail-label">Last Updated</span>
                    <span className="detail-value">
                      {course.updated_at ? new Date(course.updated_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <div className="detail-icon">🎯</div>
                  <div className="detail-content">
                    <span className="detail-label">Level</span>
                    <span className="detail-value">{course.level || 'Beginner'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {course.syllabus && (
            <div className="syllabus-section">
              <h3 className="section-title">
                <span className="title-icon">📋</span>
                Course Syllabus
              </h3>
              <div className="syllabus-content">
                <p>{course.syllabus}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <div className="footer-actions">
            <button className="btn btn-primary">
              <span className="btn-icon">📚</span>
              View Modules
            </button>
            <button className="btn btn-secondary">
              <span className="btn-icon">✏️</span>
              Edit Course
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              <span className="btn-icon">❌</span>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;