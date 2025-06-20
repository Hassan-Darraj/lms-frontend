import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import UserEnrollments from '../../components/enrollment/UserEnrollments';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const MyEnrollments = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <LoadingSpinner message="Loading enrollments..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout showSidebar={true}>
      <div className="my-enrollments">
        <div className="page-header">
          <h1>My Course Enrollments</h1>
          <p>Track your learning progress across all enrolled courses</p>
        </div>

        <div className="enrollments-content">
          <UserEnrollments userId={user?.id} />
          
          <div className="enrollment-actions">
            <a href="/courses" className="action-button">
              Browse More Courses
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyEnrollments;
