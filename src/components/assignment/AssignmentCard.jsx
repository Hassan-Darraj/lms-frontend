import './AssignmentCard.css';

const AssignmentCard = ({ assignment, onEdit, onDelete, onView }) => {
  const isOverdue = new Date(assignment.deadline) < new Date();
  const timeLeft = new Date(assignment.deadline) - new Date();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  const getTimeLeftInfo = () => {
    if (isOverdue) {
      const daysOverdue = Math.abs(daysLeft);
      return {
        text: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
        className: 'overdue'
      };
    } else if (daysLeft <= 1) {
      return {
        text: 'Due today',
        className: 'due-today'
      };
    } else if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        className: 'due-soon'
      };
    } else {
      return {
        text: `${daysLeft} days left`,
        className: 'due-normal'
      };
    }
  };

  const timeInfo = getTimeLeftInfo();

  return (
    <div className={`assignment-card ${isOverdue ? 'overdue' : ''}`}>
      <div className="card-header">
        <div className="assignment-type-badge">
          📝 Assignment
        </div>
        <div className={`time-status ${timeInfo.className}`}>
          {timeInfo.text}
        </div>
      </div>

      <div className="card-content">
        <h4 className="assignment-title">{assignment.title}</h4>
        <p className="assignment-description">{assignment.description}</p>
        
        <div className="assignment-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <div className="meta-content">
              <span className="meta-label">Deadline</span>
              <span className="meta-value">
                {new Date(assignment.deadline).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="meta-item">
            <span className="meta-icon">🎯</span>
            <div className="meta-content">
              <span className="meta-label">Max Score</span>
              <span className="meta-value">{assignment.max_score} points</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="card-footer">
        <div className="assignment-actions">
          <button 
            className="action-btn view-btn"
            onClick={() => onView(assignment)}
            title="View Assignment"
          >
            <span className="btn-icon">👁️</span>
            View
          </button>
          <button 
            className="action-btn edit-btn"
            onClick={() => onEdit(assignment)}
            title="Edit Assignment"
          >
            <span className="btn-icon">✏️</span>
            Edit
          </button>
          <button 
            className="action-btn delete-btn"
            onClick={() => onDelete(assignment)}
            title="Delete Assignment"
          >
            <span className="btn-icon">🗑️</span>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;