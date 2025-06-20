import { useState, useEffect } from 'react';
import { getEnrollmentStats } from '../../services/enrollmentService';
import './ReportComponents.css';

const EnrollmentStatsChart = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    groupBy: 'day'
  });

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getEnrollmentStats(filters);
      setStatsData(response.data.data); // Backend: { success: true, data: [...] }
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch enrollment stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilterChange = (e) => {
    setFilters(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStats();
  };

  if (loading) return <div>Loading enrollment stats...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="enrollment-stats-chart">
      <h2>Enrollment Statistics</h2>
      
      <form onSubmit={handleSubmit} className="chart-filters">
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
        
        <div>
          <label>Group By:</label>
          <select
            name="groupBy"
            value={filters.groupBy}
            onChange={handleFilterChange}
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>
        
        <button type="submit">Update Chart</button>
      </form>

      {statsData && statsData.length > 0 ? (
        <div className="chart-container">
          <div className="simple-bar-chart">
            {statsData.map((item, index) => (
              <div key={index} className="chart-bar">
                <div 
                  className="bar" 
                  style={{ 
                    height: `${(item.count / Math.max(...statsData.map(d => d.count))) * 200}px` 
                  }}
                ></div>
                <div className="bar-label">
                  <div>{new Date(item.date).toLocaleDateString()}</div>
                  <div>{item.count} enrollments</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="stats-summary">
            <h3>Summary</h3>
            <p><strong>Total Data Points:</strong> {statsData.length}</p>
            <p><strong>Total Enrollments:</strong> {statsData.reduce((sum, item) => sum + item.count, 0)}</p>
            <p><strong>Average per {filters.groupBy}:</strong> {Math.round(statsData.reduce((sum, item) => sum + item.count, 0) / statsData.length)}</p>
            <p><strong>Peak Enrollments:</strong> {Math.max(...statsData.map(d => d.count))}</p>
          </div>
        </div>
      ) : (
        <div>No enrollment data available for the selected period</div>
      )}
    </div>
  );
};

export default EnrollmentStatsChart;