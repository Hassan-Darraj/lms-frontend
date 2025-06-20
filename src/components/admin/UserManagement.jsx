import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/authService';
import UserList from './UserList';
import UserRoleEditor from './UserRoleEditor';
import DeleteUserConfirm from './DeleteUserConfirm';
import './UserManagement.css';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleEditor, setShowRoleEditor] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  // Fetch total user count
  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        // First get total count from pagination if available
        const initialResponse = await getAllUsers({ limit: 1 });
        const totalFromPagination = initialResponse.data.pagination?.total;
        
        if (totalFromPagination) {
          setTotalUsers(totalFromPagination);
        } else {
          // If no pagination info, fetch all users and count them
          const allUsersResponse = await getAllUsers({ limit: 1000 }); // Adjust limit as needed
          setTotalUsers(allUsersResponse.data.users.length);
        }
      } catch (error) {
        console.error('Failed to fetch user count:', error);
      }
    };

    fetchUserCount();
  }, [refreshTrigger]); // Refresh count when refreshTrigger changes

  const handleEditRole = (user) => {
    setSelectedUser(user);
    setShowRoleEditor(true);
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteConfirm(true);
  };

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
    setShowRoleEditor(false);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setShowRoleEditor(false);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
  };

  return (
    <div className="user-management-container">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">User Management</h2>
          <p className="page-description">
            Manage user accounts, roles, and permissions across the platform
          </p>
        </div>
        <div className="header-actions">
          <div className="stats-summary">
            <div className="stat-item">
              <span className="stat-label">Total Users</span>
              <span className="stat-value">{totalUsers.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="management-content">
        <UserList 
          onEditRole={handleEditRole}
          onDeleteUser={handleDeleteUser}
          refreshTrigger={refreshTrigger}
        />
      </div>
      
      {showRoleEditor && selectedUser && (
        <UserRoleEditor
          user={selectedUser}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
      
      {showDeleteConfirm && selectedUser && (
        <DeleteUserConfirm
          user={selectedUser}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default UserManagement;