import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getModuleById } from '../../services/moduleService';
import Layout from '../../components/common/Layout';
import LessonList from '../../components/lesson/LessonList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const ModuleDetail = () => {
  const { id } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const response = await getModuleById(id);
        setModule(response.data.data);
      } catch (error) {
        setError('Failed to load module details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModule();
    }
  }, [id]);

  if (loading) return <LoadingSpinner message="Loading module..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!module) return <ErrorMessage message="Module not found" />;

  return (
    <Layout showSidebar={true}>
      <div className="module-detail">
        <div className="page-header">
          <h1>{module.title}</h1>
          <p>{module.description}</p>
        </div>

        <div className="module-content">
          <h2>Module Lessons</h2>
          <LessonList
            moduleId={module.id}
            onView={(lesson) => window.location.href = `/lessons/${lesson.id}`}
          />
        </div>
      </div>
    </Layout>
  );
};

export default ModuleDetail;
