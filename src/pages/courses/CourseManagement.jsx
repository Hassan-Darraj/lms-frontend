import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import CourseList from '../../components/course/CourseList';
import CourseForm from '../../components/course/CourseForm';
import CourseDetail from '../../components/course/CourseDetail';
import DeleteCourseConfirm from '../../components/course/DeleteCourseConfirm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import SuccessMessage from '../../components/common/SuccessMessage';

const CourseManagement = () => {
  const [user, setUser] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

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

  const canManageCourses = user && (user.role === 'admin' || user.role === 'instructor');

  const handleCreateCourse = () => {
    if (!canManageCourses) return;
    setShowCreateForm(true);
    setSelectedCourse(null);
  };

  const handleEditCourse = (course) => {
    if (!canManageCourses) return;
    setSelectedCourse(course);
    setShowEditForm(true);
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowDetailView(true);
  };

  const handleDeleteCourse = (course) => {
    if (!canManageCourses) return;
    setSelectedCourse(course);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Course ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDetailView(false);
    setShowDeleteConfirm(false);
    setSelectedCourse(null);
  };

  if (loading) return <LoadingSpinner message="Loading course management..." />;

  return (
    <Layout showSidebar={true}>
      <div className="course-management">
        <div className="page-header">
          <h1>Course Management</h1>
          {/* Only show create button for admin/instructor */}
          {canManageCourses && (
            <button onClick={handleCreateCourse} className="primary-button">
              Create New Course
            </button>
          )}
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <CourseList
          onEdit={canManageCourses ? handleEditCourse : null}
          onDelete={canManageCourses ? handleDeleteCourse : null}
          onView={handleViewCourse}
          refreshTrigger={refreshTrigger}
        />

        {/* Forms only show for admin/instructor */}
        {showCreateForm && canManageCourses && (
          <CourseForm
            onSuccess={() => handleSuccess('created')}
            onCancel={closeAllModals}
          />
        )}

        {showEditForm && selectedCourse && canManageCourses && (
          <CourseForm
            courseId={selectedCourse.id}
            onSuccess={() => handleSuccess('updated')}
            onCancel={closeAllModals}
          />
        )}

        {showDetailView && selectedCourse && (
          <CourseDetail
            courseId={selectedCourse.id}
            onClose={closeAllModals}
          />
        )}

        {showDeleteConfirm && selectedCourse && canManageCourses && (
          <DeleteCourseConfirm
            course={selectedCourse}
            onSuccess={() => handleSuccess('deleted')}
            onCancel={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default CourseManagement;
