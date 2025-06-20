import { useState, useEffect } from 'react';
import { getQuizzesByLesson } from '../../services/quizService';
import QuizCard from './QuizCard';
import './QuizList.css';

const QuizList = ({ lessonId, onEdit, onDelete, onTake, refreshTrigger }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!lessonId) return;
      
      setLoading(true);
      try {
        const response = await getQuizzesByLesson(lessonId);
        setQuizzes(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch quizzes');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [lessonId, refreshTrigger]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading quizzes...</p>
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

  return (
    <div className="quiz-list-container">
      <div className="section-header">
        <h3 className="section-title">Lesson Quizzes</h3>
        <div className="quiz-count">
          <span className="count-badge">{quizzes.length} quizzes</span>
        </div>
      </div>
      
      <div className="quizzes-grid">
        {quizzes.map(quiz => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onEdit={onEdit}
            onDelete={onDelete}
            onTake={onTake}
          />
        ))}
        
        {quizzes.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">❓</div>
            <h3>No quizzes found</h3>
            <p>There are no quizzes for this lesson yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizList;