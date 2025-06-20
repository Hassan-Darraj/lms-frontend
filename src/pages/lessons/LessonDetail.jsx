import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getLessonById } from '../../services/lessonService';
import { getQuizzesByLesson } from '../../services/quizService';
import { getAssignmentsByLesson } from '../../services/assignmentService';
import Layout from '../../components/common/Layout';
import LessonDetail from '../../components/lesson/LessonDetail';
import QuizList from '../../components/quiz/QuizList';
import AssignmentList from '../../components/assignment/AssignmentList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const LessonDetailPage = () => {
  const { id } = useParams();
  const [lesson, setLesson] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [lessonResponse, quizzesResponse, assignmentsResponse] = await Promise.all([
          getLessonById(id),
          getQuizzesByLesson(id).catch(() => ({ data: { data: [] } })),
          getAssignmentsByLesson(id).catch(() => ({ data: { data: [] } }))
        ]);

        setLesson(lessonResponse.data.data);
        setQuizzes(quizzesResponse.data.data);
        setAssignments(assignmentsResponse.data.data);
      } catch (error) {
        setError('Failed to load lesson details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading lesson..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!lesson) return <ErrorMessage message="Lesson not found" />;

  return (
    <Layout showSidebar={true}>
      <div className="lesson-detail-page">
        <div className="lesson-content">
          <h1>{lesson.title}</h1>
          <div className="lesson-meta">
            <span>Type: {lesson.content_type}</span>
            <span>Duration: {lesson.duration} minutes</span>
            <span>{lesson.is_free ? 'Free' : 'Premium'}</span>
          </div>

          {lesson.content_url && (
            <div className="lesson-media">
              {lesson.content_type === 'video' ? (
                <video controls style={{ width: '100%', maxWidth: '800px' }}>
                  <source src={lesson.content_url} />
                  Your browser does not support video playback.
                </video>
              ) : (
                <a href={lesson.content_url} target="_blank" rel="noopener noreferrer">
                  View Lesson Content
                </a>
              )}
            </div>
          )}
        </div>

        {quizzes.length > 0 && (
          <div className="lesson-quizzes">
            <h2>Lesson Quizzes</h2>
            <QuizList
              lessonId={id}
              onTake={(quiz) => window.location.href = `/quizzes/take/${quiz.id}`}
            />
          </div>
        )}

        {assignments.length > 0 && (
          <div className="lesson-assignments">
            <h2>Lesson Assignments</h2>
            <AssignmentList
              lessonId={id}
              onView={(assignment) => window.location.href = `/assignments/${assignment.id}`}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LessonDetailPage;
