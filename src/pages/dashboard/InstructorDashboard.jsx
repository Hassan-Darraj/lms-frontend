import { useState, useEffect } from "react";
import { getCurrentUser } from "../../services/authService";
import { getCourses } from "../../services/courseService";
import Layout from "../../components/common/Layout";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import ErrorMessage from "../../components/common/ErrorMessage";
import CourseList from "../../components/course/CourseList";

const InstructorDashboard = () => {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, coursesResponse] = await Promise.all([
          getCurrentUser(),
          getCourses(),
        ]);

        setUser(userResponse.data.user);
        const instructorCourses = coursesResponse.data.data.filter(
          (course) => course.instructor_id === userResponse.data.user.id
        );
        setCourses(instructorCourses);
      } catch (error) {
        console.log("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCourseView = (course) => {
    window.location.href = `/courses/${course.id}`;
  };

  const handleCourseEdit = (course) => {
    window.location.href = `/courses/edit/${course.id}`;
  };

  const handleManageContent = (courseId) => {
    window.location.href = `/modules?courseId=${courseId}`;
  };

  const handleViewCourse = (course) => {
    window.location.href = `/courses/${course.id}`;
  };

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <Layout showSidebar={true}>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Instructor Dashboard</h1>
          <p>Welcome back, {user?.name}!</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>My Courses</h3>
              <p className="stat-number">{courses.length}</p>
            </div>

            <div className="stat-card">
              <h3>Quick Actions</h3>
              <div className="quick-actions">
                <a href="/courses/create" className="action-button">
                  Create New Course
                </a>
                <a href="/modules" className="action-button">
                  Manage Content
                </a>
                <a href="/submissions" className="action-button">
                  Review Submissions
                </a>
              </div>
            </div>
          </div>

          <div className="dashboard-section">
            <h2>My Courses</h2>
            {courses.length > 0 ? (
              <div className="course-actions-container">
                <CourseList
                  courses={courses}
                  onView={handleViewCourse}
                  onEdit={handleCourseEdit}
                  additionalActions={[
                    {
                      label: 'Manage Content',
                      onClick: handleManageContent,
                      className: 'manage-content-btn',
                      icon: '📚'
                    }
                  ]}
                />
              </div>
            ) : (
              <div className="empty-state">
                <p>You haven't created any courses yet.</p>
                <a href="/courses/create" className="action-button">
                  Create Your First Course
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InstructorDashboard;
