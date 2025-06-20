import './SuccessMessage.css';

const SuccessMessage = ({ message, onClose, autoClose = false, duration = 5000 }) => {
  // Auto close functionality
  if (autoClose && onClose) {
    setTimeout(() => {
      onClose();
    }, duration);
  }

  return (
    <div className="success-message-container">
      <div className="success-content">
        <div className="success-icon">✅</div>
        <div className="success-text">
          <h3 className="success-title">Success!</h3>
          <p className="success-description">{message}</p>
        </div>
      </div>
      
      {onClose && (
        <div className="success-actions">
          <button 
            className="close-btn"
            onClick={onClose}
            title="Close message"
          >
            <span className="btn-icon">✕</span>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SuccessMessage;