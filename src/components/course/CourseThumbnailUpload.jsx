import { useState, useRef } from 'react';
import './CourseThumbnailUpload.css';

const CourseThumbnailUpload = ({ onFileSelect, currentThumbnail }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentThumbnail || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (file) => {
    setError(null);
    
    if (!file) return;

    // Validate file type (matches backend: jpg, jpeg, png, webp)
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (jpg, jpeg, png, webp)');
      return;
    }

    // Validate file size (20MB max - matches backend)
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be less than 20MB');
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
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
    setPreview(currentThumbnail || null);
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

  return (
    <div className="thumbnail-upload-container">
      <div 
        className={`thumbnail-upload-area ${isDragOver ? 'drag-over' : ''} ${preview ? 'has-image' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          name="thumbnail"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleInputChange}
          className="thumbnail-input"
        />
        
        {preview ? (
          <div className="thumbnail-preview">
            <img 
              src={preview} 
              alt="Course thumbnail" 
              className="preview-image"
            />
            <div className="preview-overlay">
              <div className="overlay-content">
                <span className="change-icon">📷</span>
                <span className="change-text">Click to change image</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <div className="placeholder-icon">🖼️</div>
            <h4 className="placeholder-title">Upload Course Thumbnail</h4>
            <p className="placeholder-description">
              Drop an image here or click to browse
            </p>
            <div className="placeholder-specs">
              <span>JPG, PNG, WEBP • Max 20MB</span>
            </div>
          </div>
        )}
      </div>
      
      {selectedFile && (
        <div className="file-info">
          <div className="file-details">
            <div className="file-name">{selectedFile.name}</div>
            <div className="file-size">{formatFileSize(selectedFile.size)}</div>
          </div>
          <button 
            className="remove-btn"
            onClick={handleRemove}
            type="button"
            title="Remove image"
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
        <h5 className="guidelines-title">Image Guidelines</h5>
        <ul className="guidelines-list">
          <li>Recommended size: 1280×720 pixels (16:9 ratio)</li>
          <li>Maximum file size: 20MB</li>
          <li>Supported formats: JPG, PNG, WEBP</li>
          <li>High-quality images improve course appeal</li>
        </ul>
      </div>
    </div>
  );
};

export default CourseThumbnailUpload;