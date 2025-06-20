import { useState, useEffect } from 'react';
import { getUserActivityReport } from '../../services/reportService';
import './ReportComponents.css';

const UserActivityReport = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserActivityReport(filters);
      setReportData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch user activity report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchReport();
  };

  if (loading) return <div>Loading report...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>User Activity Report</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            name="startDate"
            value={filters.startDate}
            onChange={handleFilterChange}
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            name="endDate"
            value={filters.endDate}
            onChange={handleFilterChange}
          />
        </div>
        <button type="submit">Generate Report</button>
      </form>

      {reportData && (
        <div className="report-content">
          <h3>Report Summary</h3>
          <p><strong>Total Users:</strong> {reportData.totalUsers}</p>
          <p><strong>Active Users:</strong> {reportData.activeUsers}</p>
          <p><strong>Generated At:</strong> {new Date(reportData.generatedAt).toLocaleString()}</p>
          
          <h4>User Details</h4>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Course Count</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {reportData.users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>{user.course_count}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserActivityReport;