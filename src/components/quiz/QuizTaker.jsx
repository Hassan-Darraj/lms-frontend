import { useState } from 'react';
import './QuizTaker.css';

const QuizTaker = ({ quiz, onSubmit, onCancel }) => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = selectedAnswer === quiz.correct_answer;
    const calculatedScore = isCorrect ? quiz.max_score : 0;
    
    setScore(calculatedScore);
    setSubmitted(true);
    
    onSubmit({
      quizId: quiz.id,
      selectedAnswer,
      score: calculatedScore,
      isCorrect
    });
  };

  if (submitted) {
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h3 className="modal-title">Quiz Results</h3>
            <div className={`result-icon ${score === quiz.max_score ? 'correct' : 'incorrect'}`}>
              {score === quiz.max_score ? '✅' : '❌'}
            </div>
          </div>
          
          <div className="results-content">
            <div className="score-display">
              <div className="score-circle">
                <span className="score-value">{score}</span>
                <span className="score-total">/{quiz.max_score}</span>
              </div>
              <div className={`result-text ${score === quiz.max_score ? 'correct' : 'incorrect'}`}>
                {score === quiz.max_score ? 'Correct!' : 'Incorrect'}
              </div>
            </div>
            
            <div className="answer-details">
              <div className="detail-section">
                <h4 className="detail-title">Question</h4>
                <p className="detail-content">{quiz.question}</p>
              </div>
              
              <div className="detail-section">
                <h4 className="detail-title">Your Answer</h4>
                <p className={`detail-content answer ${score === quiz.max_score ? 'correct' : 'incorrect'}`}>
                  {selectedAnswer}
                </p>
              </div>
              
              <div className="detail-section">
                <h4 className="detail-title">Correct Answer</h4>
                <p className="detail-content answer correct">{quiz.correct_answer}</p>
              </div>
            </div>
          </div>
          
          <div className="modal-actions">
            <button className="action-btn close-btn" onClick={onCancel}>
              <span className="btn-icon">✓</span>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3 className="modal-title">Take Quiz</h3>
          <div className="quiz-icon">❓</div>
        </div>
        
        <div className="quiz-content">
          <div className="question-section">
            <h4 className="question-title">Question</h4>
            <p className="question-text">{quiz.question}</p>
          </div>
          
          <form onSubmit={handleSubmit} className="quiz-form">
            <div className="options-section">
              <h4 className="options-title">Select your answer:</h4>
              <div className="options-list">
                {quiz.options?.map((option, index) => (
                  <label key={index} className={`option-item ${selectedAnswer === option ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="answer"
                      value={option}
                      checked={selectedAnswer === option}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      className="option-radio"
                      required
                    />
                    <div className="option-content">
                      <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                      <span className="option-text">{option}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="form-actions">
              <button 
                type="button" 
                className="action-btn cancel-btn"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="action-btn submit-btn"
                disabled={!selectedAnswer}
              >
                <span className="btn-icon">📝</span>
                Submit Answer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuizTaker;