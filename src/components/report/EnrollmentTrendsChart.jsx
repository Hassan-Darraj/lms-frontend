import { useState, useEffect } from 'react';
import { getEnrollmentTrends } from '../../services/enrollmentService';
import './ReportComponents.css';

const EnrollmentTrendsChart = () => {
  const [trendsData, setTrendsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    period: 'month',
    limit: 12
  });

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getEnrollmentTrends(filters);
      setTrendsData(response.data.data); // Backend: { success: true, data: trends }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch enrollment trends');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrends();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: name === 'limit' ? parseInt(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTrends();
  };

  if (loading) return <div>Loading enrollment trends...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="enrollment-trends-chart">
      <h2>Enrollment Trends</h2>
      
      <form onSubmit={handleSubmit} className="chart-filters">
        <div>
          <label>Period:</label>
          <select
            name="period"
            value={filters.period}
            onChange={handleFilterChange}
          >
            <option value="day">Daily</option>
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
          </select>
        </div>
        
        <div>
          <label>Limit:</label>
          <input
            type="number"
            name="limit"
            value={filters.limit}
            onChange={handleFilterChange}
            min="1"
            max="50"
          />
        </div>
        
        <button type="submit">Update Chart</button>
      </form>

      {trendsData ? (
        <div className="chart-container">
          <div className="trends-summary">
            <h3>Trends Summary</h3>
            <p><strong>Period:</strong> {trendsData.period}</p>
            <p><strong>Total Enrollments:</strong> {trendsData.totalEnrollments}</p>
            <p><strong>Total New Students:</strong> {trendsData.totalNewStudents}</p>
          </div>

          {trendsData.data && trendsData.data.length > 0 && (
            <div className="simple-line-chart">
              <h4>Enrollment Trends Over Time</h4>
              <div className="chart-area">
                {trendsData.data.map((item, index) => {
                  const maxEnrollments = Math.max(...trendsData.data.map(d => d.enrollment_count || 0));
                  const maxStudents = Math.max(...trendsData.data.map(d => d.new_students || 0));
                  const enrollmentHeight = maxEnrollments > 0 ? ((item.enrollment_count || 0) / maxEnrollments) * 150 : 0;
                  const studentsHeight = maxStudents > 0 ? ((item.new_students || 0) / maxStudents) * 150 : 0;
                  
                  return (
                    <div key={index} className="trend-point">
                      <div className="trend-bars">
                        <div 
                          className="enrollment-bar" 
                          style={{ height: `${enrollmentHeight}px` }}
                          title={`${item.enrollment_count || 0} enrollments`}
                        ></div>
                        <div 
                          className="students-bar" 
                          style={{ height: `${studentsHeight}px` }}
                          title={`${item.new_students || 0} new students`}
                        ></div>
                      </div>
                      <div className="trend-label">
                        <div>{new Date(item.date).toLocaleDateString()}</div>
                        <div className="trend-values">
                          <small>E: {item.enrollment_count || 0}</small>
                          <small>S: {item.new_students || 0}</small>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="chart-legend">
                <div className="legend-item">
                  <div className="legend-color enrollment-color"></div>
                  <span>Enrollments</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color students-color"></div>
                  <span>New Students</span>
                </div>
              </div>
            </div>
          )}

          {trendsData.data && trendsData.data.length > 0 && (
            <div className="trends-table">
              <h4>Detailed Data</h4>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Enrollments</th>
                    <th>New Students</th>
                  </tr>
                </thead>
                <tbody>
                  {trendsData.data.map((item, index) => (
                    <tr key={index}>
                      <td>{new Date(item.date).toLocaleDateString()}</td>
                      <td>{item.enrollment_count || 0}</td>
                      <td>{item.new_students || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div>No trends data available</div>
      )}
    </div>
  );
};

export default EnrollmentTrendsChart;