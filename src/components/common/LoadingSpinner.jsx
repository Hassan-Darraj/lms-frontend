import './LoadingSpinner.css';

const LoadingSpinner = ({ message = "Loading...", size = "medium", variant = "default" }) => {
  return (
    <div className={`loading-spinner-container ${size} ${variant}`}>
      <div className="spinner-wrapper">
        <div className="spinner"></div>
        <div className="spinner-glow"></div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;