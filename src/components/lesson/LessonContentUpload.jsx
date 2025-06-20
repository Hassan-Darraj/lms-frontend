import { useState, useRef } from 'react';
import './LessonContentUpload.css';

const LessonContentUpload = ({ onFileSelect, currentContent }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setError(null);
    
    if (!file) return;

    // Validate file type (matches backend: mp4, mov, webm, pdf, txt)
    const allowedTypes = ['video/mp4', 'video/mov', 'video/webm', 'application/pdf', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid file (mp4, mov, webm, pdf, txt)');
      return;
    }

    // Validate file size (20MB max - matches backend)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview for videos
    if (file.type.startsWith('video/')) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    handleFileChange(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('video/')) return '🎥';
    if (type === 'application/pdf') return '📄';
    if (type === 'text/plain') return '📝';
    return '📎';
  };

  const getContentTypeLabel = (type) => {
    if (type.startsWith('video/')) return 'Video';
    if (type === 'application/pdf') return 'PDF Document';
    if (type === 'text/plain') return 'Text File';
    return 'File';
  };

  return (
    <div className="lesson-content-upload-container">
      <div 
        className={`content-upload-area ${isDragOver ? 'drag-over' : ''} ${selectedFile || currentContent ? 'has-content' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="content"
          accept=".mp4,.mov,.webm,.pdf,.txt"
          onChange={handleInputChange}
          className="content-input"
        />
        
        {selectedFile ? (
          <div className="file-preview">
            <div className="file-info">
              <div className="file-icon">{getFileIcon(selectedFile.type)}</div>
              <div className="file-details">
                <h4 className="file-name">{selectedFile.name}</h4>
                <p className="file-meta">
                  {getContentTypeLabel(selectedFile.type)} • {formatFileSize(selectedFile.size)}
                </p>
              </div>
            </div>
            
            {preview && (
              <div className="video-preview">
                <video 
                  src={preview} 
                  controls 
                  className="preview-video"
                  preload="metadata"
                />
              </div>
            )}
            
            <div className="file-overlay">
              <div className="overlay-content">
                <span className="change-icon">📁</span>
                <span className="change-text">Click to change file</span>
              </div>
            </div>
          </div>
        ) : currentContent ? (
          <div className="current-content-display">
            <div className="current-content-info">
              <div className="content-icon">📎</div>
              <div className="content-details">
                <h4 className="content-title">Current Content</h4>
                <p className="content-description">Click to replace existing content</p>
              </div>
            </div>
            <a 
              href={currentContent} 
              target="_blank" 
              rel="noopener noreferrer"
              className="view-current-btn"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="btn-icon">👁️</span>
              View Current
            </a>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="placeholder-icon">📁</div>
            <h4 className="placeholder-title">Upload Lesson Content</h4>
            <p className="placeholder-description">
              Drop a file here or click to browse
            </p>
            <div className="placeholder-specs">
              <span>Video: MP4, MOV, WEBM</span>
              <span>Documents: PDF, TXT</span>
              <span>Max size: 20MB</span>
            </div>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="file-actions">
          <div className="file-summary">
            <span className="summary-text">
              {selectedFile.name} ({formatFileSize(selectedFile.size)})
            </span>
          </div>
          <button 
            className="remove-btn"
            onClick={handleRemove}
            type="button"
            title="Remove file"
          >
            <span className="remove-icon">✕</span>
          </button>
        </div>
      )}
      
      {error && (
        <div className="error-container">
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        </div>
      )}
      
      <div className="upload-guidelines">
        <h5 className="guidelines-title">Content Guidelines</h5>
        <ul className="guidelines-list">
          <li><strong>Video Files:</strong> MP4, MOV, WEBM formats supported</li>
          <li><strong>Documents:</strong> PDF and TXT files for reading materials</li>
          <li><strong>Size Limit:</strong> Maximum 20MB per file</li>
          <li><strong>Quality:</strong> Use high-quality content for better learning experience</li>
        </ul>
      </div>
    </div>
  );
};

export default LessonContentUpload;