import { useState, useEffect } from 'react';
import { getCoursePopularityReport } from '../../services/reportService';
import './ReportComponents.css';

const CoursePopularityReport = () => {
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
      const response = await getCoursePopularityReport(filters);
      setReportData(response.data.data);
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to fetch course popularity report');
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
      <h2>Course Popularity Report</h2>
      
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
          <p><strong>Total Courses:</strong> {reportData.totalCourses}</p>
          <p><strong>Total Enrollments:</strong> {reportData.totalEnrollments}</p>
          <p><strong>Generated At:</strong> {new Date(reportData.generatedAt).toLocaleString()}</p>
          
          <h4>Popular Courses</h4>
          <table>
            <thead>
              <tr>
                <th>Course Title</th>
                <th>Instructor</th>
                <th>Enrollments</th>
                <th>Average Rating</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {reportData.courses.map(course => (
                <tr key={course.id}>
                  <td>{course.title}</td>
                  <td>{course.instructor_name}</td>
                  <td>{course.enrollment_count}</td>
                  <td>{course.average_rating || 'N/A'}</td>
                  <td>${course.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CoursePopularityReport;