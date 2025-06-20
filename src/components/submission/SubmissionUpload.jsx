import { useState } from 'react';
import { uploadSubmission } from '../../services/submissionService';
import './SubmissionComponents.css';

const SubmissionUpload = ({ assignmentId, userId, onSuccess, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type (matches backend: pdf, docx, zip, rar, pptx, txt)
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/zip',
        'application/x-rar-compressed',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        alert('Please select a valid file (pdf, docx, zip, rar, pptx, txt)');
        return;
      }

      // Validate file size (20MB max - matches backend)
      if (file.size > 20 * 1024 * 1024) {
        alert('File size must be less than 20MB');
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Create FormData (matches backend route handling)
      const formData = new FormData();
      formData.append('file', selectedFile); // Backend expects "file" field name
      formData.append('assignment_id', assignmentId);
      formData.append('user_id', userId);

      await uploadSubmission(formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to upload submission');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Upload Assignment Submission</h3>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label>Select File:</label>
            <input
              type="file"
              name="file" // Backend expects "file" field name
              accept=".pdf,.docx,.zip,.rar,.pptx,.txt"
              onChange={handleFileChange}
              required
            />
          </div>
          
          {selectedFile && (
            <div className="file-info">
              <p><strong>Selected:</strong> {selectedFile.name}</p>
              <p><strong>Size:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
              <p><strong>Type:</strong> {selectedFile.type}</p>
            </div>
          )}
          
          {error && <div className="error">{error}</div>}
          
          <div>
            <button type="submit" disabled={loading || !selectedFile}>
              {loading ? 'Uploading...' : 'Upload Submission'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmissionUpload;