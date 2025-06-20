import './ErrorMessage.css';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="error-message-container">
      <div className="error-content">
        <div className="error-icon">⚠️</div>
        <div className="error-text">
          <h3 className="error-title">Something went wrong</h3>
          <p className="error-description">{message}</p>
        </div>
      </div>
      
      {onRetry && (
        <div className="error-actions">
          <button 
            className="retry-btn"
            onClick={onRetry}
          >
            <span className="btn-icon">🔄</span>
            Try Again
          </button>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;