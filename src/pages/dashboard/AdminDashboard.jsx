import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import { getSystemUsageReport } from '../../services/reportService';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SystemUsageReport from '../../components/report/SystemUsageReport';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, statsResponse] = await Promise.all([
          getCurrentUser(),
          getSystemUsageReport()
        ]);
        
        setUser(userResponse.data.user);
        setSystemStats(statsResponse.data.data);
      } catch (error) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading admin dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout showSidebar={true}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-stats">
            {systemStats && (
              <>
                <div className="stat-card">
                  <h3>Total Users</h3>
                  <p className="stat-number">{systemStats.totalUsers}</p>
                </div>
                
                <div className="stat-card">
                  <h3>Total Courses</h3>
                  <p className="stat-number">{systemStats.totalCourses}</p>
                </div>
                
                <div className="stat-card">
                  <h3>Total Enrollments</h3>
                  <p className="stat-number">{systemStats.totalEnrollments}</p>
                </div>
                
                <div className="stat-card">
                  <h3>Active This Month</h3>
                  <p className="stat-number">{systemStats.activeUsersThisMonth}</p>
                </div>
              </>
            )}
          </div>

          <div className="dashboard-actions">
            <h2>Quick Actions</h2>
            <div className="admin-actions">
              <a href="/admin/users" className="action-button">
                Manage Users
              </a>
              <a href="/courses" className="action-button">
                Manage Courses
              </a>
              <a href="/admin/categories" className="action-button">
                Manage Categories
              </a>
              <a href="/admin/reports" className="action-button">
                View Reports
              </a>
              <a href="/admin/enrollments" className="action-button">
                Manage Enrollments
              </a>
            </div>
          </div>

          <div className="dashboard-section">
            <SystemUsageReport />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
