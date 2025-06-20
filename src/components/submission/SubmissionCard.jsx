import './SubmissionCard.css'

const SubmissionCard = ({ submission, onGrade, onView, canGrade }) => {
  return (
    <div className="submission-card">
      <p><strong>User ID:</strong> {submission.user_id}</p>
      <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
      <p><strong>Grade:</strong> {submission.grade || 'Not graded'}</p>
      
      <div className="submission-actions">
        {/* All can view */}
        <button onClick={() => onView(submission)}>
          View
        </button>
        
        {/* Only instructors/admins can grade */}
        {canGrade && onGrade && (
          <button onClick={() => onGrade(submission)}>
            Grade
          </button>
        )}
      </div>
    </div>
  );
};

export default SubmissionCard;
