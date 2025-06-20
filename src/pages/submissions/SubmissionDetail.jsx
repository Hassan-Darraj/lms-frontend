import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSubmissionById } from '../../services/submissionService';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import SubmissionDetail from '../../components/submission/SubmissionDetail';
import GradeSubmissionForm from '../../components/submission/GradeSubmissionForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const SubmissionDetailPage = () => {
  const { id } = useParams();
  const [submission, setSubmission] = useState(null);
  const [user, setUser] = useState(null);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [submissionResponse, userResponse] = await Promise.all([
          getSubmissionById(id),
          getCurrentUser()
        ]);
        setSubmission(submissionResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError('Failed to load submission details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleGradeSuccess = () => {
    setMessage('Submission graded successfully!');
    setShowGradeForm(false);
    // Refresh submission data
    window.location.reload();
  };

  const handleGradeClick = () => {
    setShowGradeForm(true);
  };

  if (loading) return <LoadingSpinner message="Loading submission..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!submission) return <ErrorMessage message="Submission not found" />;

  const canGrade = user && (user.role === 'instructor' || user.role === 'admin');

  return (
    <Layout showSidebar={true}>
      <div className="submission-detail-page">
        {message && <SuccessMessage message={message} />}
        
        <div className="page-header">
          <h1>Submission Details</h1>
          {canGrade && !showGradeForm && (
            <button onClick={handleGradeClick} className="primary-button">
              Grade Submission
            </button>
          )}
        </div>

        <SubmissionDetail
          submissionId={submission.id}
          onClose={() => window.history.back()}
        />

        {showGradeForm && canGrade && (
          <div className="grade-section">
            <h2>Grade This Submission</h2>
            <GradeSubmissionForm
              submission={submission}
              onSuccess={handleGradeSuccess}
              onCancel={() => setShowGradeForm(false)}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SubmissionDetailPage;
