import { useState, useEffect } from 'react';
import { getAssignmentsByLesson } from '../../services/assignmentService';
import AssignmentCard from './AssignmentCard';

const AssignmentList = ({ lessonId, onEdit, onDelete, onView, refreshTrigger }) => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      if (!lessonId) return;
      
      setLoading(true);
      try {
        const response = await getAssignmentsByLesson(lessonId);
        setAssignments(response.data.data);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch assignments');
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, [lessonId, refreshTrigger]);

  if (loading) return <div>Loading assignments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h3>Lesson Assignments</h3>
      <div className="assignment-list">
        {assignments.map(assignment => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onEdit={onEdit}
            onDelete={onDelete}
            onView={onView}
          />
        ))}
      </div>
    </div>
  );
};

export default AssignmentList;
