import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentById } from '../../services/assignmentService';
import { getSubmissionsByAssignment } from '../../services/submissionService';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import AssignmentDetail from '../../components/assignment/AssignmentDetail';
import SubmissionUpload from '../../components/submission/SubmissionUpload';
import SubmissionList from '../../components/submission/SubmissionList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AssignmentDetailPage = () => {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshSubmissions, setRefreshSubmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentResponse, userResponse] = await Promise.all([
          getAssignmentById(id),
          getCurrentUser()
        ]);
        setAssignment(assignmentResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError('Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setRefreshSubmissions(prev => prev + 1);
    alert('Assignment submitted successfully!');
  };

  if (loading) return <LoadingSpinner message="Loading assignment..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!assignment) return <ErrorMessage message="Assignment not found" />;

  const isOverdue = new Date(assignment.deadline) < new Date();

  return (
    <Layout showSidebar={true}>
      <div className="assignment-detail-page">
        <div className="assignment-content">
          <h1>{assignment.title}</h1>
          <p>{assignment.description}</p>
          
          <div className="assignment-meta">
            <span>Deadline: {new Date(assignment.deadline).toLocaleString()}</span>
            <span>Max Score: {assignment.max_score}</span>
            {isOverdue && <span className="overdue">Overdue</span>}
          </div>

          {user && user.role === 'student' && !isOverdue && (
            <div className="assignment-actions">
              <button 
                onClick={() => setShowUpload(true)}
                className="primary-button"
              >
                Submit Assignment
              </button>
            </div>
          )}
        </div>

        {user && (user.role === 'instructor' || user.role === 'admin') && (
          <div className="assignment-submissions">
            <h2>Student Submissions</h2>
            <SubmissionList
              assignmentId={assignment.id}
              refreshTrigger={refreshSubmissions}
              onView={(submission) => window.location.href = `/submissions/${submission.id}`}
              onGrade={(submission) => window.location.href = `/submissions/${submission.id}/grade`}
            />
          </div>
        )}

        {showUpload && (
          <SubmissionUpload
            assignmentId={assignment.id}
            userId={user.id}
            onSuccess={handleUploadSuccess}
            onCancel={() => setShowUpload(false)}
          />
        )}
      </div>
    </Layout>
  );
};

export default AssignmentDetailPage;
