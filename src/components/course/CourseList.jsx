import { useState, useEffect } from 'react';
import { getCourses } from '../../services/courseService';
import { getCurrentUser } from '../../services/authService';
import CourseCard from './CourseCard';
import './CourseList.css';

const CourseList = ({ onEdit, onDelete, onView, refreshTrigger }) => {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [coursesResponse, userResponse] = await Promise.all([
          getCourses(),
          getCurrentUser()
        ]);
        setCourses(coursesResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch courses');
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
          <p>Loading courses...</p>
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

  // Check if user can manage courses (admin/instructor only)
  const canManageCourses = user && (user.role === 'admin' || user.role === 'instructor');

  const getRoleDisplay = () => {
    if (!user) return null;
    const roleConfig = {
      student: { label: 'Student View', icon: '👨‍🎓', color: '#3b82f6' },
      instructor: { label: 'Instructor View', icon: '👨‍🏫', color: '#10b981' },
      admin: { label: 'Admin View', icon: '👑', color: '#6712f2' }
    };
    return roleConfig[user.role] || roleConfig.student;
  };

  const roleInfo = getRoleDisplay();

  return (
    <div className="course-list-container">
      <div className="section-header">
        <div className="header-content">
          <h3 className="section-title">Courses</h3>
          {roleInfo && (
            <div className="role-indicator" style={{ backgroundColor: roleInfo.color }}>
              <span className="role-icon">{roleInfo.icon}</span>
              <span className="role-text">{roleInfo.label}</span>
            </div>
          )}
        </div>
        <div className="course-count">
          <span className="count-badge">{courses.length} courses</span>
        </div>
      </div>
      
      <div className="courses-grid">
        {courses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={canManageCourses ? onEdit : null}
            onDelete={canManageCourses ? onDelete : null}
            onView={onView}
            userRole={user?.role}
            canManage={canManageCourses}

          />
        ))}
        
        {courses.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No courses available</h3>
            <p>
              {canManageCourses 
                ? "Create your first course to get started teaching." 
                : "Check back later for new courses or browse our categories."
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;