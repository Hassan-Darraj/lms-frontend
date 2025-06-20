import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import ModuleList from '../../components/module/ModuleList';
import ModuleForm from '../../components/module/ModuleForm';
import DeleteModuleConfirm from '../../components/module/DeleteModuleConfirm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const ModuleManagement = () => {
  const { courseId: paramCourseId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const courseId = paramCourseId || searchParams.get('courseId');
  
  const [selectedModule, setSelectedModule] = useState(null);
  const [course, setCourse] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(!!courseId);
  
  // Fetch course details when courseId changes
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const response = await getCourseById(courseId);
        setCourse(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [courseId]);

  const handleCreateModule = () => {
    setShowCreateForm(true);
    setSelectedModule(null);
  };

  const handleEditModule = (module) => {
    setSelectedModule(module);
    setShowEditForm(true);
  };

  const handleViewModule = (module) => {
    window.location.href = `/lessons?moduleId=${module.id}`;
  };

  const handleDeleteModule = (module) => {
    setSelectedModule(module);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Module ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    
    // Clear success message after 3 seconds
    const timer = setTimeout(() => {
      setMessage('');
    }, 3000);
    
    return () => clearTimeout(timer);
  };

  const handleError = (errorMsg) => {
    setError(errorMsg);
    setMessage('');
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setSelectedModule(null);
  };

  // Show loading state
  if (loading) {
    return (
      <Layout showSidebar={true}>
        <div className="module-management-loading">
          <LoadingSpinner message="Loading course details..." />
        </div>
      </Layout>
    );
  }

  // Show error if no courseId is provided or course not found
  if (!courseId || (course === null && !loading)) {
    return (
      <Layout showSidebar={true}>
        <div className="module-management-error">
          <div className="error-content">
            <div className="error-icon">❌</div>
            <h2>Course Not Found</h2>
            <p>No course was selected or the course could not be loaded. Please select a valid course to manage modules.</p>
            <div className="error-actions">
              <Button 
                variant="primary" 
                onClick={handleBackToCourses}
                className="back-to-courses-btn"
              >
                Back to My Courses
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="module-management">
        <div className="module-header">
          <div className="header-content">
            <h1>Course Modules</h1>
            {course && (
              <>
                <p className="course-title">{course.title}</p>
                <p className="course-id">Course ID: {courseId}</p>
              </>
            )}
          </div>
          <div className="header-actions">
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
              className="back-button"
              icon="←"
            >
              Back to Course
            </Button>
            <Button 
              variant="primary"
              onClick={handleCreateModule}
              className="create-module-button"
              icon="+"
            >
              Create New Module
            </Button>
          </div>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <div className="module-content">
          <ModuleList 
            courseId={courseId}
            onEdit={handleEditModule}
            onDelete={handleDeleteModule}
            onView={handleViewModule}
            refreshTrigger={refreshTrigger}
          />
        </div>

        {/* Modals */}
        {showCreateForm && (
          <div className="module-modal">
            <div className="module-modal-content">
              <div className="module-modal-header">
                <h2>Create New Module</h2>
              </div>
              <div className="module-modal-body">
                <ModuleForm
                  courseId={courseId}
                  onSuccess={() => handleSuccess('created')}
                  onCancel={closeAllModals}
                  onError={handleError}
                />
              </div>
            </div>
          </div>
        )}

        {showEditForm && selectedModule && (
          <div className="module-modal">
            <div className="module-modal-content">
              <div className="module-modal-header">
                <h2>Edit Module</h2>
              </div>
              <div className="module-modal-body">
                <ModuleForm
                  moduleId={selectedModule.id}
                  courseId={courseId}
                  moduleData={selectedModule}
                  onSuccess={() => handleSuccess('updated')}
                  onCancel={closeAllModals}
                  onError={handleError}
                />
              </div>
            </div>
          </div>
        )}

        {showDeleteConfirm && selectedModule && (
          <div className="module-modal">
            <div className="module-modal-content">
              <div className="module-modal-header">
                <h2>Delete Module</h2>
              </div>
              <div className="module-modal-body">
                <DeleteModuleConfirm
                  module={selectedModule}
                  onSuccess={() => handleSuccess('deleted')}
                  onCancel={closeAllModals}
                  onError={handleError}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ModuleManagement;
