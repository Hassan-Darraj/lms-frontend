import './QuizCard.css';

const QuizCard = ({ quiz, onEdit, onDelete, onTake }) => {
  const getQuestionPreview = (question) => {
    if (!question) return 'No question available';
    return question.length > 80 ? question.substring(0, 80) + '...' : question;
  };

  const getDifficultyInfo = (maxScore) => {
    if (maxScore <= 5) {
      return { level: 'Easy', className: 'difficulty-easy', icon: '🟢' };
    } else if (maxScore <= 10) {
      return { level: 'Medium', className: 'difficulty-medium', icon: '🟡' };
    } else {
      return { level: 'Hard', className: 'difficulty-hard', icon: '🔴' };
    }
  };

  const difficultyInfo = getDifficultyInfo(quiz.max_score);

  return (
    <div className="quiz-card">
      <div className="quiz-header">
        <div className="quiz-type-badge">
          <span className="badge-icon">❓</span>
          Quiz
        </div>
        <div className={`difficulty-badge ${difficultyInfo.className}`}>
          <span className="difficulty-icon">{difficultyInfo.icon}</span>
          {difficultyInfo.level}
        </div>
      </div>

      <div className="quiz-content">
        <h4 className="quiz-question">{getQuestionPreview(quiz.question)}</h4>
        
        <div className="quiz-meta">
          <div className="meta-item">
            <div className="meta-icon">📊</div>
            <div className="meta-content">
              <span className="meta-label">Options</span>
              <span className="meta-value">{quiz.options?.length || 0}</span>
            </div>
          </div>
          
          <div className="meta-item">
            <div className="meta-icon">🎯</div>
            <div className="meta-content">
              <span className="meta-label">Max Score</span>
              <span className="meta-value">{quiz.max_score} pts</span>
            </div>
          </div>
          
          <div className="meta-item">
            <div className="meta-icon">📅</div>
            <div className="meta-content">
              <span className="meta-label">Created</span>
              <span className="meta-value">
                {quiz.created_at ? new Date(quiz.created_at).toLocaleDateString() : 'Recently'}
              </span>
            </div>
          </div>
        </div>

        {quiz.options && quiz.options.length > 0 && (
          <div className="quiz-options-preview">
            <h5 className="options-title">Answer Options:</h5>
            <div className="options-list">
              {quiz.options.slice(0, 2).map((option, index) => (
                <div key={index} className="option-preview">
                  <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                  <span className="option-text">
                    {option.length > 30 ? option.substring(0, 30) + '...' : option}
                  </span>
                </div>
              ))}
              {quiz.options.length > 2 && (
                <div className="options-more">
                  +{quiz.options.length - 2} more option{quiz.options.length - 2 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="quiz-actions">
        <button 
          className="action-btn take-btn"
          onClick={() => onTake(quiz)}
          title="Take Quiz"
        >
          <span className="btn-icon">🚀</span>
          Take Quiz
        </button>
        <button 
          className="action-btn edit-btn"
          onClick={() => onEdit(quiz)}
          title="Edit Quiz"
        >
          <span className="btn-icon">✏️</span>
          Edit
        </button>
        <button 
          className="action-btn delete-btn"
          onClick={() => onDelete(quiz)}
          title="Delete Quiz"
        >
          <span className="btn-icon">🗑️</span>
          Delete
        </button>
      </div>
    </div>
  );
};

export default QuizCard;