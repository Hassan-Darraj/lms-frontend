import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getAssignmentById } from '../../services/assignmentService';
import { getCurrentUser } from '../../services/authService';
import SubmissionUpload from '../submission/SubmissionUpload';
import SubmissionList from '../submission/SubmissionList';
import './AssignmentDetail.css';

const AssignmentDetail = ({ assignmentId, onClose }) => {
  const { id } = useParams();
  const actualId = assignmentId || id;
  const [assignment, setAssignment] = useState(null);
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshSubmissions, setRefreshSubmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [assignmentResponse, userResponse] = await Promise.all([
          getAssignmentById(actualId),
          getCurrentUser()
        ]);
        setAssignment(assignmentResponse.data.data);
        setUser(userResponse.data.user);
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to load assignment details');
      } finally {
        setLoading(false);
      }
    };

    if (actualId) {
      fetchData();
    }
  }, [actualId]);

  const handleUploadSuccess = () => {
    setShowUpload(false);
    setRefreshSubmissions(prev => prev + 1);
    alert('Assignment submitted successfully!');
  };

  if (loading) {
    return (
      <div className="assignment-detail-container">
        <div className="loading-state">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading assignment...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-detail-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Assignment</h3>
          <p>{error}</p>
          {onClose && (
            <button className="btn btn-secondary" onClick={onClose}>
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="assignment-detail-container">
        <div className="not-found-state">
          <div className="not-found-icon">📋</div>
          <h3>Assignment Not Found</h3>
          <p>The assignment you're looking for doesn't exist or has been removed.</p>
          {onClose && (
            <button className="btn btn-secondary" onClick={onClose}>
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  const isOverdue = new Date(assignment.deadline) < new Date();
  const canSubmit = user && user.role === 'student' && !isOverdue;
  const canViewSubmissions = user && (user.role === 'instructor' || user.role === 'admin');

  const getTimeStatus = () => {
    const timeLeft = new Date(assignment.deadline) - new Date();
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

    if (isOverdue) {
      const daysOverdue = Math.abs(daysLeft);
      return {
        text: `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`,
        className: 'status-overdue'
      };
    } else if (daysLeft <= 1) {
      return {
        text: 'Due today',
        className: 'status-due-today'
      };
    } else if (daysLeft <= 3) {
      return {
        text: `${daysLeft} days left`,
        className: 'status-due-soon'
      };
    } else {
      return {
        text: `${daysLeft} days left`,
        className: 'status-normal'
      };
    }
  };

  const timeStatus = getTimeStatus();

  return (
    <div className="assignment-detail-container">
      <div className="assignment-header">
        <div className="header-top">
          <div className="assignment-badge">
            <span className="badge-icon">📝</span>
            Assignment
          </div>
          <div className={`time-status ${timeStatus.className}`}>
            <span className="status-icon">⏰</span>
            {timeStatus.text}
          </div>
        </div>
        
        <h1 className="assignment-title">{assignment.title}</h1>
        <p className="assignment-description">{assignment.description}</p>
        
        <div className="assignment-meta-grid">
          <div className="meta-card">
            <div className="meta-icon">📅</div>
            <div className="meta-content">
              <span className="meta-label">Deadline</span>
              <span className="meta-value">
                {new Date(assignment.deadline).toLocaleString()}
              </span>
            </div>
          </div>
          
          <div className="meta-card">
            <div className="meta-icon">🎯</div>
            <div className="meta-content">
              <span className="meta-label">Max Score</span>
              <span className="meta-value">{assignment.max_score} points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Student can submit if not overdue */}
      {canSubmit && (
        <div className="submission-section">
          <div className="section-header">
            <h2>Submit Your Work</h2>
            <p>Upload your assignment before the deadline</p>
          </div>
          
          <div className="submit-card">
            <div className="submit-content">
              <div className="submit-icon">📤</div>
              <div className="submit-text">
                <h3>Ready to submit?</h3>
                <p>Make sure your work is complete before submitting</p>
              </div>
            </div>
            <button 
              onClick={() => setShowUpload(true)}
              className="btn btn-primary submit-btn"
            >
              <span className="btn-icon">📤</span>
              Submit Assignment
            </button>
          </div>
        </div>
      )}

      {/* Instructors/Admins can view all submissions */}
      {canViewSubmissions && (
        <div className="submissions-section">
          <div className="section-header">
            <h2>Student Submissions</h2>
            <p>Review and grade student work</p>
          </div>
          
          <div className="submissions-container">
            <SubmissionList
              assignmentId={assignment.id}
              refreshTrigger={refreshSubmissions}
              onView={(submission) => window.location.href = `/submissions/${submission.id}`}
              onGrade={(submission) => window.location.href = `/submissions/${submission.id}`}
            />
          </div>
        </div>
      )}

      {showUpload && canSubmit && (
        <SubmissionUpload
          assignmentId={assignment.id}
          userId={user.id}
          onSuccess={handleUploadSuccess}
          onCancel={() => setShowUpload(false)}
        />
      )}

      {onClose && (
        <div className="detail-footer">
          <button className="btn btn-secondary close-btn" onClick={onClose}>
            <span className="btn-icon">←</span>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentDetail;