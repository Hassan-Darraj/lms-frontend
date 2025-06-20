import { useState, useEffect } from 'react';
import { getAllUsers } from '../../services/authService';
import './UserList.css';

const UserList = ({ onEditRole, onDeleteUser, refreshTrigger }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ limit: 50, offset: 0 });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await getAllUsers(params);
        setUsers(response.data.users); // Backend: { success: true, users, pagination }
      } catch (error) {
        setError(error.response?.data?.error || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [params, refreshTrigger]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          Error: {error}
        </div>
      </div>
    );
  }

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin': return 'badge-admin';
      case 'instructor': return 'badge-instructor';
      case 'student': return 'badge-student';
      default: return 'badge-default';
    }
  };

  return (
    <div className="user-list-container">
      <div className="section-header">
        <h3 className="section-title">Users</h3>
        <div className="user-count">
          <span className="count-badge">{users.length} users</span>
        </div>
      </div>
      
      <div className="table-container">
        <div className="table-wrapper">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className="user-row">
                  <td>
                    <div className="user-name-cell">
                      <div className="user-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="user-email">{user.email}</span>
                  </td>
                  <td>
                    <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`}>
                      <span className="status-dot"></span>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="action-btn edit-btn"
                        onClick={() => onEditRole(user)}
                        title="Edit Role"
                      >
                        <span className="btn-icon">✏️</span>
                        Edit Role
                      </button>
                      <button 
                        className="action-btn delete-btn"
                        onClick={() => onDeleteUser(user)}
                        title="Delete User"
                      >
                        <span className="btn-icon">🗑️</span>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {users.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No users found</h3>
            <p>There are no users to display at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;