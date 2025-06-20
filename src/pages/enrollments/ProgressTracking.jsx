import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import ProgressTracker from '../../components/enrollment/ProgressTracker';
import CourseProgress from '../../components/enrollment/CourseProgress';
import UserEnrollments from '../../components/enrollment/UserEnrollments';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProgressTracking = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');
  const userId = searchParams.get('userId');
  
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

  if (loading) return <LoadingSpinner message="Loading progress..." />;
  if (error) return <ErrorMessage message={error} />;

  const targetUserId = userId || user?.id;

  return (
    <Layout showSidebar={true}>
      <div className="progress-tracking">
        <div className="page-header">
          <h1>Learning Progress</h1>
          <p>Track your progress across all enrolled courses</p>
        </div>

        <div className="progress-content">
          {courseId && targetUserId ? (
            <div className="specific-course-progress">
              <h2>Course Progress</h2>
              <ProgressTracker userId={targetUserId} courseId={courseId} />
              <CourseProgress userId={targetUserId} courseId={courseId} />
            </div>
          ) : (
            <div className="all-enrollments-progress">
              <h2>All Enrollments</h2>
              <UserEnrollments userId={targetUserId} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProgressTracking;
