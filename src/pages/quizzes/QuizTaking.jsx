import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getQuizById } from '../../services/quizService';
import { markQuizCompleted } from '../../services/enrollmentService';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import QuizTaker from '../../components/quiz/QuizTaker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const QuizTaking = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizResponse, userResponse] = await Promise.all([
          getQuizById(id),
          getCurrentUser()
        ]);
        setQuiz(quizResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleQuizSubmit = async (result) => {
    try {
      await markQuizCompleted(user.id, {
        quizId: result.quizId,
        score: result.score
      });
    } catch (error) {
      console.error('Failed to save quiz completion:', error);
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  if (loading) return <LoadingSpinner message="Loading quiz..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!quiz) return <ErrorMessage message="Quiz not found" />;

  return (
    <Layout showSidebar={true}>
      <div className="quiz-taking">
        <QuizTaker
          quiz={quiz}
          onSubmit={handleQuizSubmit}
          onCancel={handleCancel}
        />
      </div>
    </Layout>
  );
};

export default QuizTaking;
