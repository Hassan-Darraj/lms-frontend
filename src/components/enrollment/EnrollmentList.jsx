import { useState, useEffect } from 'react';
import { getAllEnrollments } from '../../services/enrollmentService';
import { getCurrentUser } from '../../services/authService';
import EnrollmentCard from './EnrollmentCard';
import './EnrollmentList.css';

const EnrollmentList = ({ onDelete, refreshTrigger }) => {
  const [enrollments, setEnrollments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [enrollmentsResponse, userResponse] = await Promise.all([
          getAllEnrollments(), // This endpoint is admin-only in backend
          getCurrentUser()
        ]);
        
        // Double-check user is admin
        if (userResponse.data.user.role !== 'admin') {
          setError('Access denied. Admin privileges required.');
          return;
        }
        
        setEnrollments(enrollmentsResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch enrollments');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading enrollments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          Error: {error}
        </div>
      </div>
    );
  }

  // Only admins can delete enrollments
  const canDeleteEnrollments = user && user.role === 'admin';

  // Calculate stats
  const completedEnrollments = enrollments.filter(e => e.completed_at).length;
  const activeEnrollments = enrollments.filter(e => !e.completed_at && e.progress > 0).length;
  const notStartedEnrollments = enrollments.filter(e => e.progress === 0).length;

  return (
    <div className="enrollment-list-container">
      <div className="section-header">
        <div className="header-content">
          <h3 className="section-title">All Enrollments</h3>
          <div className="admin-badge">
            <span className="admin-icon">👑</span>
            <span className="admin-text">Admin View</span>
          </div>
        </div>
        <div className="enrollment-count">
          <span className="count-badge">{enrollments.length} total enrollments</span>
        </div>
      </div>

      <div className="enrollment-stats">
        <div className="stat-card completed">
          <div className="stat-icon">🎉</div>
          <div className="stat-content">
            <div className="stat-number">{completedEnrollments}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="stat-card active">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <div className="stat-number">{activeEnrollments}</div>
            <div className="stat-label">In Progress</div>
          </div>
        </div>
        <div className="stat-card not-started">
          <div className="stat-icon">⏳</div>
          <div className="stat-content">
            <div className="stat-number">{notStartedEnrollments}</div>
            <div className="stat-label">Not Started</div>
          </div>
        </div>
        <div className="stat-card total">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <div className="stat-number">{enrollments.length}</div>
            <div className="stat-label">Total</div>
          </div>
        </div>
      </div>
      
      <div className="enrollments-grid">
        {enrollments.map(enrollment => (
          <EnrollmentCard
            key={enrollment.id}
            enrollment={enrollment}
            onDelete={canDeleteEnrollments ? onDelete : null}
            canDelete={canDeleteEnrollments}
          />
        ))}
        
        {enrollments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No enrollments found</h3>
            <p>There are no course enrollments in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrollmentList;