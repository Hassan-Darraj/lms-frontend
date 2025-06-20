import { useState, useEffect } from 'react';
import { getSystemUsageReport } from '../../services/reportService';
import './ReportComponents.css';

const SystemUsageReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await getSystemUsageReport();
        setReportData(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch system usage report');
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <div>Loading system usage report...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!reportData) return <div>No report data available</div>;

  return (
    <div>
      <h2>System Usage Report</h2>
      
      <div className="report-content">
        <div className="usage-stats">
          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{reportData.totalUsers}</p>
          </div>
          
          <div className="stat-card">
            <h3>Total Courses</h3>
            <p className="stat-number">{reportData.totalCourses}</p>
          </div>
          
          <div className="stat-card">
            <h3>Total Enrollments</h3>
            <p className="stat-number">{reportData.totalEnrollments}</p>
          </div>
          
          <div className="stat-card">
            <h3>Active Users This Month</h3>
            <p className="stat-number">{reportData.activeUsersThisMonth}</p>
          </div>
        </div>
        
        <p className="stat-card"><strong>Report Generated:</strong> {new Date(reportData.reportGeneratedAt).toLocaleString()}</p>
      </div>
    </div>
  );
};

export default SystemUsageReport;