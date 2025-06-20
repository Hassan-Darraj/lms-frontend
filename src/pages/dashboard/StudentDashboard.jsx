import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import UserEnrollments from '../../components/enrollment/UserEnrollments';
import ProgressTracker from '../../components/enrollment/ProgressTracker';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout showSidebar={true}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>My Enrollments</h2>
            <UserEnrollments userId={user?.id} />
          </div>

          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <a href="/courses" className="action-button">
                  Browse Courses
                </a>
                <a href="/enrollments" className="action-button">
                  View Progress
                </a>
                <a href="/assignments" className="action-button">
                  My Assignments
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
