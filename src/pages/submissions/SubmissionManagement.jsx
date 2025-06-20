import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import SubmissionList from '../../components/submission/SubmissionList';
import GradeSubmissionForm from '../../components/submission/GradeSubmissionForm';
import SubmissionDetail from '../../components/submission/SubmissionDetail';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const SubmissionManagement = () => {
  const [user, setUser] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleGradeSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowGradeForm(true);
  };

  const handleViewSubmission = (submission) => {
    setSelectedSubmission(submission);
    setShowDetailView(true);
  };

  const handleGradeSuccess = () => {
    setMessage('Submission graded successfully!');
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const closeAllModals = () => {
    setShowGradeForm(false);
    setShowDetailView(false);
    setSelectedSubmission(null);
  };

  if (loading) return <LoadingSpinner message="Loading submissions..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout showSidebar={true}>
      <div className="submission-management">
        <div className="page-header">
          <h1>Submission Management</h1>
          <p>Review and grade student submissions</p>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <div className="submissions-content">
          {user && user.role === 'student' ? (
            <SubmissionList
              userId={user.id}
              onView={handleViewSubmission}
              refreshTrigger={refreshTrigger}
            />
          ) : (
            <div className="instructor-submissions">
              <p>Select an assignment to view submissions, or use the assignment management page.</p>
            </div>
          )}
        </div>

        {showGradeForm && selectedSubmission && (
          <GradeSubmissionForm
            submission={selectedSubmission}
            onSuccess={handleGradeSuccess}
            onCancel={closeAllModals}
          />
        )}

        {showDetailView && selectedSubmission && (
          <SubmissionDetail
            submissionId={selectedSubmission.id}
            onClose={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default SubmissionManagement;
