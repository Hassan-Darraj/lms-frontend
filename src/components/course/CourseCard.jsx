import './CourseCard.css';

const CourseCard = ({ course, onEdit, onDelete, onView, userRole, canManage }) => {
  const getPriceDisplay = (price) => {
    return price === 0 ? 'Free' : `$${price}`;
  };

  const getStatusBadge = (isPublished, isApproved) => {
    if (!isPublished) {
      return { text: 'Draft', className: 'status-draft' };
    } else if (!isApproved) {
      return { text: 'Pending Review', className: 'status-pending' };
    } else {
      return { text: 'Published', className: 'status-published' };
    }
  };

  const status = getStatusBadge(course.is_published, course.is_approved);
  const isFree = course.price === 0;
  const isAvailable = course.is_published && course.is_approved;

  return (
    <div className={`course-card ${!isAvailable ? 'unavailable' : ''}`}>
      <div className="course-image-container">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="course-thumbnail"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div className={`course-placeholder ${course.thumbnail_url ? 'hidden' : ''}`}>
          <span className="placeholder-icon">📚</span>
          <span className="placeholder-text">Course</span>
        </div>
        
        <div className="course-badges">
          {isFree && (
            <div className="price-badge free">
              <span className="badge-icon">{isFree ? '🎁' : '💰'}</span>
                {getPriceDisplay(course.price)}
            </div>
          )}
          <div className={`status-badge ${status.className}`}>
            {status.text}
          </div>
        </div>

      </div>

      <div className="course-content">
        <div className="course-header">
          <h4 className="course-title">{course.title}</h4>
          {!isFree && (
            <div className="price-tag">
              <span className="price-currency">$</span>
              <span className="price-amount">{course.price}</span>
            </div>
          )}
        </div>

        <p className="course-description">{course.description}</p>



      </div>
      
      <div className="course-actions">
        {/* All users can view */}
        <button 
          className="action-btn view-btn"
          onClick={() => onView(course)}
          title="View Course"
        >
          <span className="btn-icon">👁️</span>
          View
        </button>
        
        {/* Only admin/instructor can edit/delete */}
        {canManage && onEdit && (
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(course)}
            title="Edit Course"
          >
            <span className="btn-icon">✏️</span>
            Edit
          </button>
        )}
        
        {canManage && onDelete && (
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(course)}
            title="Delete Course"
          >
            <span className="btn-icon">🗑️</span>
            Delete
          </button>
        )}
        
        {/* Students see enroll button */}
        {userRole === 'student' && isAvailable && (
          <button 
            className="action-btn enroll-btn"
            onClick={() => window.location.href = `/courses/${course.id}`}
            title="Enroll in Course"
          >
            <span className="btn-icon">🎓</span>
            Enroll
          </button>
        )}

        {/* If course is not available */}
        {userRole === 'student' && !isAvailable && (
          <button 
            className="action-btn unavailable-btn"
            disabled
            title="Course not available"
          >
            <span className="btn-icon">🚫</span>
            Unavailable
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCard;