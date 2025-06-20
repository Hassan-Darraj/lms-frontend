import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import EnrollmentList from '../../components/enrollment/EnrollmentList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const EnrollmentManagement = () => {
  const [user, setUser] = useState(null);
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

  const handleDeleteEnrollment = () => {
    setMessage('Enrollment deleted successfully!');
    setError('');
    setRefreshTrigger(prev => prev + 1);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <LoadingSpinner message="Loading enrollments..." />;
  if (error) return <ErrorMessage message={error} />;

  // Only admins can access enrollment management
  if (user && user.role !== 'admin') {
    return (
      <Layout showSidebar={true}>
        <ErrorMessage message="Access denied. Admin privileges required." />
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="enrollment-management">
        <div className="page-header">
          <h1>Enrollment Management</h1>
          <p>Manage all course enrollments across the system</p>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <EnrollmentList
          onDelete={handleDeleteEnrollment}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </Layout>
  );
};

export default EnrollmentManagement;
