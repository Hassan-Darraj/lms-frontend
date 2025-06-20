import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import QuizList from '../../components/quiz/QuizList';
import QuizForm from '../../components/quiz/QuizForm';
import DeleteQuizConfirm from '../../components/quiz/DeleteQuizConfirm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const QuizManagement = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateQuiz = () => {
    setShowCreateForm(true);
    setSelectedQuiz(null);
  };

  const handleEditQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowEditForm(true);
  };

  const handleTakeQuiz = (quiz) => {
    window.location.href = `/quizzes/take/${quiz.id}`;
  };

  const handleDeleteQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Quiz ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setSelectedQuiz(null);
  };

  return (
    <Layout showSidebar={true}>
      <div className="quiz-management">
        <div className="page-header">
          <h1>Quiz Management</h1>
          <button onClick={handleCreateQuiz} className="primary-button">
            Create New Quiz
          </button>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <QuizList
          lessonId={lessonId}
          onEdit={handleEditQuiz}
          onDelete={handleDeleteQuiz}
          onTake={handleTakeQuiz}
          refreshTrigger={refreshTrigger}
        />

        {showCreateForm && (
          <QuizForm
            lessonId={lessonId}
            onSuccess={() => handleSuccess('created')}
            onCancel={closeAllModals}
          />
        )}

        {showEditForm && selectedQuiz && (
          <QuizForm
            quizId={selectedQuiz.id}
            lessonId={lessonId}
            onSuccess={() => handleSuccess('updated')}
            onCancel={closeAllModals}
          />
        )}

        {showDeleteConfirm && selectedQuiz && (
          <DeleteQuizConfirm
            quiz={selectedQuiz}
            onSuccess={() => handleSuccess('deleted')}
            onCancel={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default QuizManagement;
