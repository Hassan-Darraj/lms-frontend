import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import LessonList from '../../components/lesson/LessonList';
import LessonForm from '../../components/lesson/LessonForm';
import DeleteLessonConfirm from '../../components/lesson/DeleteLessonConfirm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const LessonManagement = () => {
  const [searchParams] = useSearchParams();
  const moduleId = searchParams.get('moduleId');
  
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateLesson = () => {
    setShowCreateForm(true);
    setSelectedLesson(null);
  };

  const handleEditLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowEditForm(true);
  };

  const handleViewLesson = (lesson) => {
    window.location.href = `/lessons/${lesson.id}`;
  };

  const handleDeleteLesson = (lesson) => {
    setSelectedLesson(lesson);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Lesson ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setSelectedLesson(null);
  };

  return (
    <Layout showSidebar={true}>
      <div className="lesson-management">
        <div className="page-header">
          <h1>Lesson Management</h1>
          <button onClick={handleCreateLesson} className="primary-button">
            Add New Lesson
          </button>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <LessonList
          moduleId={moduleId}
          onEdit={handleEditLesson}
          onDelete={handleDeleteLesson}
          onView={handleViewLesson}
          refreshTrigger={refreshTrigger}
        />

        {showCreateForm && (
          <LessonForm
            moduleId={moduleId}
            onSuccess={() => handleSuccess('created')}
            onCancel={closeAllModals}
          />
        )}

        {showEditForm && selectedLesson && (
          <LessonForm
            lessonId={selectedLesson.id}
            moduleId={moduleId}
            onSuccess={() => handleSuccess('updated')}
            onCancel={closeAllModals}
          />
        )}

        {showDeleteConfirm && selectedLesson && (
          <DeleteLessonConfirm
            lesson={selectedLesson}
            onSuccess={() => handleSuccess('deleted')}
            onCancel={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default LessonManagement;
