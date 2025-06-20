import { useState, useRef } from 'react';
import './FileUpload.css';

const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = "*", 
  maxSize = 20 * 1024 * 1024, // 20MB
  multiple = false 
}) => {
  const [selectedFiles, setSelectedFiles] = useState(null);
  const [error, setError] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (files) => {
    setError(null);

    if (files.length === 0) return;

    // Validate file size
    for (let file of files) {
      if (file.size > maxSize) {
        setError(`File ${file.name} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`);
        return;
      }
    }

    setSelectedFiles(files);
    onFileSelect(multiple ? files : files[0]);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    handleFileChange(files);
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
    const files = e.dataTransfer.files;
    handleFileChange(files);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (indexToRemove) => {
    if (selectedFiles) {
      const filesArray = Array.from(selectedFiles);
      const newFiles = filesArray.filter((_, index) => index !== indexToRemove);
      
      if (newFiles.length === 0) {
        setSelectedFiles(null);
        onFileSelect(null);
      } else {
        const newFileList = new DataTransfer();
        newFiles.forEach(file => newFileList.items.add(file));
        setSelectedFiles(newFileList.files);
        onFileSelect(multiple ? newFileList.files : newFileList.files[0]);
      }
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
    <div className="file-upload-container">
      <div 
        className={`file-upload-area ${isDragOver ? 'drag-over' : ''} ${selectedFiles ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes}
          multiple={multiple}
          onChange={handleInputChange}
          className="file-input"
        />
        
        <div className="upload-content">
          <div className="upload-icon">📁</div>
          <div className="upload-text">
            <h4 className="upload-title">
              {selectedFiles ? 'Files Selected' : 'Choose Files or Drag & Drop'}
            </h4>
            <p className="upload-description">
              {selectedFiles 
                ? `${selectedFiles.length} file${selectedFiles.length > 1 ? 's' : ''} selected`
                : `Maximum size: ${maxSize / (1024 * 1024)}MB ${multiple ? '• Multiple files allowed' : '• Single file only'}`
              }
            </p>
          </div>
          <button type="button" className="browse-btn">
            <span className="btn-icon">📂</span>
            Browse Files
          </button>
        </div>
      </div>
      
      {selectedFiles && (
        <div className="selected-files-list">
          <h5 className="files-title">Selected Files</h5>
          <div className="files-container">
            {Array.from(selectedFiles).map((file, index) => (
              <div key={index} className="file-item">
                <div className="file-info">
                  <div className="file-icon">📄</div>
                  <div className="file-details">
                    <span className="file-name">{file.name}</span>
                    <span className="file-size">{formatFileSize(file.size)}</span>
                  </div>
                </div>
                <button 
                  className="remove-file-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  title="Remove file"
                >
                  <span className="remove-icon">✕</span>
                </button>
              </div>
            ))}
          </div>
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
    </div>
  );
};

export default FileUpload;