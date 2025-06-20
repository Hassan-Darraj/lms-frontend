import { useState, useEffect } from 'react';
import { getSubmissionsByAssignment, getSubmissionsByUser } from '../../services/submissionService';
import { getCurrentUser } from '../../services/authService';
import SubmissionCard from './SubmissionCard';
import './SubmissionComponents.css';

const SubmissionList = ({ assignmentId, userId, onGrade, onView, refreshTrigger }) => {
  const [submissions, setSubmissions] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userResponse = await getCurrentUser();
        setUser(userResponse.data.user);
        
        let submissionsResponse;
        
        // Role-based data fetching
        if (userResponse.data.user.role === 'student') {
          // Students can only see their own submissions
          submissionsResponse = await getSubmissionsByUser(userId || userResponse.data.user.id);
        } else if (assignmentId && (userResponse.data.user.role === 'admin' || userResponse.data.user.role === 'instructor')) {
          // Instructors/Admins can see submissions for specific assignments
          submissionsResponse = await getSubmissionsByAssignment(assignmentId);
        } else if (userId && (userResponse.data.user.role === 'admin')) {
          // Only admins can see other users' submissions
          submissionsResponse = await getSubmissionsByUser(userId);
        }
        
        setSubmissions(submissionsResponse?.data?.data || []);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch submissions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assignmentId, userId, refreshTrigger]);

  if (loading) return <div>Loading submissions...</div>;
  if (error) return <div>Error: {error}</div>;

  const canGrade = user && (user.role === 'admin' || user.role === 'instructor');

  return (
    <div>
      <h3>Submissions</h3>
      <div className="submission-list">
        {submissions.map(submission => (
          <SubmissionCard
            key={submission.id}
            submission={submission}
            onGrade={canGrade ? onGrade : null}
            onView={onView}
            canGrade={canGrade}
            userRole={user?.role}
          />
        ))}
      </div>
    </div>
  );
};

export default SubmissionList;