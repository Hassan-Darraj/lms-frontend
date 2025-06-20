import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import UserActivityReport from '../../components/report/UserActivityReport';
import CoursePopularityReport from '../../components/report/CoursePopularityReport';
import SystemUsageReport from '../../components/report/SystemUsageReport';
import EnrollmentStatsChart from '../../components/report/EnrollmentStatsChart';
import EnrollmentTrendsChart from '../../components/report/EnrollmentTrendsChart';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Reports = () => {
  const [user, setUser] = useState(null);
  const [activeReport, setActiveReport] = useState('system');
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

  if (loading) return <LoadingSpinner message="Loading reports..." />;
  if (error) return <ErrorMessage message={error} />;

  // Only admins can access reports
  if (user && user.role !== 'admin') {
    return (
      <Layout showSidebar={true}>
        <ErrorMessage message="Access denied. Admin privileges required." />
      </Layout>
    );
  }

  const reports = [
    { key: 'system', label: 'System Usage' },
    { key: 'users', label: 'User Activity' },
    { key: 'courses', label: 'Course Popularity' },
    { key: 'enrollment-stats', label: 'Enrollment Statistics' },
    { key: 'enrollment-trends', label: 'Enrollment Trends' }
  ];

  return (
    <Layout showSidebar={true}>
      <div className="reports-page">
        <div className="page-header">
          <h1>System Reports</h1>
          <p>Analytics and insights for system administrators</p>
        </div>

        <div className="report-tabs">
          {reports.map(report => (
            <button
              key={report.key}
              className={`tab ${activeReport === report.key ? 'active' : ''}`}
              onClick={() => setActiveReport(report.key)}
            >
              {report.label}
            </button>
          ))}
        </div>

        <div className="report-content">
          {activeReport === 'system' && <SystemUsageReport />}
          {activeReport === 'users' && <UserActivityReport />}
          {activeReport === 'courses' && <CoursePopularityReport />}
          {activeReport === 'enrollment-stats' && <EnrollmentStatsChart />}
          {activeReport === 'enrollment-trends' && <EnrollmentTrendsChart />}
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
