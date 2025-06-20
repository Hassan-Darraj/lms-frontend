import './LessonCard.css';

const LessonCard = ({ lesson, onEdit, onDelete, onView }) => {
  return (
    <div className="lesson-card">
      <h4>{lesson.title}</h4>
      <p>Type: {lesson.content_type}</p>
      <p>Duration: {lesson.duration} minutes</p>
      <p>Order: {lesson.order}</p>
      <p>Free: {lesson.is_free ? 'Yes' : 'No'}</p>
      
      <div className="lesson-actions">
        <button onClick={() => onView(lesson)}>
          View
        </button>
        <button onClick={() => onEdit(lesson)}>
          Edit
        </button>
        <button onClick={() => onDelete(lesson)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default LessonCard;
