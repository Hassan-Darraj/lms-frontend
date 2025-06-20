import { useState, useEffect } from 'react';
import { createQuiz, updateQuiz, getQuizById } from '../../services/quizService';
import './QuizForm.css';

const QuizForm = ({ quizId, lessonId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    lesson_id: lessonId || '',
    question: '',
    options: ['', '', '', ''],
    correct_answer: '',
    max_score: 10
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (quizId) {
      const fetchQuiz = async () => {
        try {
          const response = await getQuizById(quizId);
          const quiz = response.data.data;
          setFormData({
            ...quiz,
            options: Array.isArray(quiz.options) ? quiz.options : ['', '', '', '']
          });
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to fetch quiz');
        }
      };
      fetchQuiz();
    }
  }, [quizId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Validate that correct answer is one of the options
    if (!formData.options.includes(formData.correct_answer)) {
      setError('Correct answer must be one of the options');
      setLoading(false);
      return;
    }
    
    try {
      if (quizId) {
        await updateQuiz(quizId, formData);
      } else {
        await createQuiz(formData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'max_score' ? parseInt(value) : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({
      ...prev,
      options: newOptions
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">{quizId ? 'Edit Quiz' : 'Create Quiz'}</h3>
          <div className="form-icon">❓</div>
        </div>
        
        <form onSubmit={handleSubmit} className="quiz-form">
          <div className="form-group">
            <label className="form-label">Question</label>
            <div className="textarea-wrapper">
              <textarea
                name="question"
                value={formData.question}
                onChange={handleChange}
                className="form-textarea"
                placeholder="Enter your quiz question..."
                rows="3"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Options</label>
            <div className="options-list">
              {formData.options.map((option, index) => (
                <div key={index} className="option-input-wrapper">
                  <span className="option-number">{index + 1}</span>
                  <input
                    type="text"
                    className="form-input option-input"
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correct Answer</label>
            <div className="select-wrapper">
              <select
                name="correct_answer"
                value={formData.correct_answer}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select correct answer</option>
                {formData.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option || `Option ${index + 1}`}
                  </option>
                ))}
              </select>
              <span className="select-icon">▼</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Max Score</label>
            <div className="input-wrapper">
              <input
                type="number"
                name="max_score"
                value={formData.max_score}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter maximum score"
                min="1"
                required
              />
              <span className="input-icon">🎯</span>
            </div>
          </div>
          
          {error && (
            <div className="error-container">
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="action-btn cancel-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="action-btn submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  Saving...
                </>
              ) : (
                <>
                  <span className="btn-icon">{quizId ? '✏️' : '➕'}</span>
                  {quizId ? 'Update' : 'Create'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;