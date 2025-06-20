import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getCourseById } from '../../services/courseService';
import { getModulesByCourse } from '../../services/moduleService';
import Layout from '../../components/common/Layout';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ModuleList from '../../components/module/ModuleList';
import EnrollButton from '../../components/enrollment/EnrollButton';
import { getCurrentUser } from '../../services/authService';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseResponse, userResponse] = await Promise.all([
          getCourseById(id),
          getCurrentUser()
        ]);
        setCourse(courseResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError('Failed to load course details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleEnrollSuccess = () => {
    alert('Enrolled successfully!');
  };

  if (loading) return <LoadingSpinner message="Loading course details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!course) return <ErrorMessage message="Course not found" />;

  return (
    <Layout showSidebar={true}>
      <div className="course-detail">
        <div className="course-header">
          {course.thumbnail_url && (
            <img src={course.thumbnail_url} alt={course.title} className="course-thumbnail" />
          )}
          <div className="course-info">
            <h1>{course.title}</h1>
            <p className="course-description">{course.description}</p>
            <div className="course-meta">
              <span>Price: ${course.price}</span>
              <span>Status: {course.is_published ? 'Published' : 'Draft'}</span>
              <span>Approved: {course.is_approved ? 'Yes' : 'No'}</span>
            </div>
            
            {user && user.role === 'student' && course.is_published && course.is_approved && (
              <EnrollButton
                courseId={course.id}
                userId={user.id}
                onSuccess={handleEnrollSuccess}
              />
            )}
          </div>
        </div>

        <div className="course-content">
          <h2>Course Modules</h2>
          <ModuleList
            courseId={course.id}
            onView={(module) => window.location.href = `/modules/${module.id}`}
          />
        </div>
      </div>
    </Layout>
  );
};

export default CourseDetail;
