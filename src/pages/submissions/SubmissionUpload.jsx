import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentById } from '../../services/assignmentService';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import SubmissionUpload from '../../components/submission/SubmissionUpload';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const SubmissionUploadPage = () => {
  const { assignmentId } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentResponse, userResponse] = await Promise.all([
          getAssignmentById(assignmentId),
          getCurrentUser()
        ]);
        setAssignment(assignmentResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError('Failed to load assignment data');
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const handleUploadSuccess = () => {
    alert('Assignment submitted successfully!');
    window.history.back();
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) return <LoadingSpinner message="Loading assignment..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!assignment) return <ErrorMessage message="Assignment not found" />;

  const isOverdue = new Date(assignment.deadline) < new Date();

  if (isOverdue) {
    return (
      <Layout showSidebar={true}>
        <div className="submission-upload-page">
          <ErrorMessage message="This assignment is overdue. Submissions are no longer accepted." />
          <button onClick={handleCancel}>Go Back</button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="submission-upload-page">
        <div className="page-header">
          <h1>Submit Assignment</h1>
          <h2>{assignment.title}</h2>
          <p>Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
        </div>

        <SubmissionUpload
          assignmentId={assignment.id}
          userId={user?.id}
          onSuccess={handleUploadSuccess}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default SubmissionUploadPage;
