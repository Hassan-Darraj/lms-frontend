import { useState } from 'react';
import { logout } from '../../services/authService';
import Layout from '../../components/common/Layout';
import ProfileView from '../../components/auth/ProfileView';
import ChangePasswordForm from '../../components/auth/ChangePasswordForm';
import SuccessMessage from '../../components/common/SuccessMessage';
import ErrorMessage from '../../components/common/ErrorMessage';

const Profile = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);

  const handlePasswordChangeSuccess = (successMsg) => {
    setMessage(successMsg);
    setError('');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChangeError = (errorMsg) => {
    setError(errorMsg);
    setMessage('');
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      window.location.href = '/auth/login';
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showSidebar={true}>
      <div className="profile-page">
        <div className="profile-header">
          <h1>My Profile</h1>
          <p>Manage your account settings and preferences</p>
          
          {/* Logout Button in Profile */}
          <button 
            onClick={handleLogout} 
            disabled={loading}
            className="logout-button"
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>

        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Security Settings
          </button>
        </div>

        <div className="profile-content">
          {message && <SuccessMessage message={message} />}
          {error && <ErrorMessage message={error} />}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              <ProfileView />
            </div>
          )}

          {activeTab === 'security' && (
            <div className="security-section">
              <h2>Change Password</h2>
              <ChangePasswordForm 
                onSuccess={handlePasswordChangeSuccess}
                onError={handlePasswordChangeError}
              />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
