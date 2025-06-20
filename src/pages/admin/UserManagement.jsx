import { useState, useEffect } from 'react';
import { getCurrentUser } from '../../services/authService';
import Layout from '../../components/common/Layout';
import UserManagement from '../../components/admin/UserManagement';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const UserManagementPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
      } catch (error) {
        setError('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <LoadingSpinner message="Loading user management..." />;
  if (error) return <ErrorMessage message={error} />;

  // Only admins can access user management
  if (user && user.role !== 'admin') {
    return (
      <Layout showSidebar={true}>
        <ErrorMessage message="Access denied. Admin privileges required." />
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <UserManagement />
    </Layout>
  );
};

export default UserManagementPage;
