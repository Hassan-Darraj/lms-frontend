import { useState, useEffect } from 'react';
import { getModulesByCourse } from '../../services/moduleService';
import ModuleCard from './ModuleCard';
import './ModuleList.css';

const ModuleList = ({ courseId, onEdit, onDelete, onView, refreshTrigger }) => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      if (!courseId) return;
      
      setLoading(true);
      try {
        const response = await getModulesByCourse(courseId);
        setModules(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch modules');
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, [courseId, refreshTrigger]);

  if (loading) {
    return <LoadingSpinner message="Loading modules..." />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="module-list">
      <div className="modules-header">
        <h2 className="modules-title">Course Modules</h2>
        <div className="modules-actions">
          <Button 
            variant="primary"
            onClick={() => onEdit && onEdit({ courseId })}
            icon="➕"
          >
            Add Module
          </Button>
        </div>
      </div>
      
      {modules.length > 0 ? (
        <div className="modules-grid">
          {modules
            .sort((a, b) => a.order - b.order)
            .map((module) => (
              <ModuleCard
                key={module.id}
                module={module}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))}
        </div>
      ) : (
        <EmptyState 
          title="No Modules Found"
          message="This course doesn't have any modules yet. Create your first module to get started."
          action={onEdit && {
            label: 'Create Module',
            onClick: () => onEdit({ courseId }),
            icon: '➕'
          }}
        />
      )}
    </div>
  );
};

export default ModuleList;