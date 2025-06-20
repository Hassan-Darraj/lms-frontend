import { useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import AssignmentList from '../../components/assignment/AssignmentList';
import AssignmentForm from '../../components/assignment/AssignmentForm';
import DeleteAssignmentConfirm from '../../components/assignment/DeleteAssignmentConfirm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const AssignmentManagement = () => {
  const [searchParams] = useSearchParams();
  const lessonId = searchParams.get('lessonId');
  
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleCreateAssignment = () => {
    setShowCreateForm(true);
    setSelectedAssignment(null);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditForm(true);
  };

  const handleViewAssignment = (assignment) => {
    window.location.href = `/assignments/${assignment.id}`;
  };

  const handleDeleteAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = (action) => {
    setMessage(`Assignment ${action} successfully!`);
    setError('');
    setRefreshTrigger(prev => prev + 1);
    closeAllModals();
    setTimeout(() => setMessage(''), 3000);
  };

  const closeAllModals = () => {
    setShowCreateForm(false);
    setShowEditForm(false);
    setShowDeleteConfirm(false);
    setSelectedAssignment(null);
  };

  return (
    <Layout showSidebar={true}>
      <div className="assignment-management">
        <div className="page-header">
          <h1>Assignment Management</h1>
          <button onClick={handleCreateAssignment} className="primary-button">
            Create New Assignment
          </button>
        </div>

        {message && <SuccessMessage message={message} />}
        {error && <ErrorMessage message={error} />}

        <AssignmentList
          lessonId={lessonId}
          onEdit={handleEditAssignment}
          onDelete={handleDeleteAssignment}
          onView={handleViewAssignment}
          refreshTrigger={refreshTrigger}
        />

        {showCreateForm && (
          <AssignmentForm
            lessonId={lessonId}
            onSuccess={() => handleSuccess('created')}
            onCancel={closeAllModals}
          />
        )}

        {showEditForm && selectedAssignment && (
          <AssignmentForm
            assignmentId={selectedAssignment.id}
            lessonId={lessonId}
            onSuccess={() => handleSuccess('updated')}
            onCancel={closeAllModals}
          />
        )}

        {showDeleteConfirm && selectedAssignment && (
          <DeleteAssignmentConfirm
            assignment={selectedAssignment}
            onSuccess={() => handleSuccess('deleted')}
            onCancel={closeAllModals}
          />
        )}
      </div>
    </Layout>
  );
};

export default AssignmentManagement;