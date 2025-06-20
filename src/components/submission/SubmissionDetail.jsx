import { useState, useEffect } from 'react';
import { getSubmissionById } from '../../services/submissionService';
import './SubmissionComponents.css';

const SubmissionDetail = ({ submissionId, onClose }) => {
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        const response = await getSubmissionById(submissionId);
        setSubmission(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch submission');
      } finally {
        setLoading(false);
      }
    };

    if (submissionId) {
      fetchSubmission();
    }
  }, [submissionId]);

  if (loading) return <div>Loading submission...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!submission) return <div>Submission not found</div>;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Submission Details</h2>
        
        <div className="submission-details">
          <p><strong>User ID:</strong> {submission.user_id}</p>
          <p><strong>Assignment ID:</strong> {submission.assignment_id}</p>
          <p><strong>Submitted:</strong> {new Date(submission.submitted_at).toLocaleString()}</p>
          <p><strong>Grade:</strong> {submission.grade || 'Not graded'}</p>
          <p><strong>Feedback:</strong> {submission.feedback || 'No feedback'}</p>
          
          {submission.submission_url && (
            <div>
              <strong>Submission:</strong>
              <a href={submission.submission_url} target="_blank" rel="noopener noreferrer">
                View Submission
              </a>
            </div>
          )}
        </div>
        
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default SubmissionDetail;