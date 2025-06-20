import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';
import { getRoleIcon, getRoleBadgeClass } from '../../utils/roleUtils';
import ErrorBoundary from './ErrorBoundary';
import './Header.css';

const NavItem = ({ icon, text, onClick, ariaLabel }) => (
  <li className="nav-item-wrapper">
    <button 
      className="nav-item"
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <span className="nav-icon" aria-hidden="true">{icon}</span>
      <span className="nav-text">{text}</span>
    </button>
  </li>
);

const Header = ({ user }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Clear sensitive data from storage
  const clearSensitiveData = useCallback(() => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.clear();
    }
  }, []);

  // Handle logout with error handling
  const handleLogout = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      await logout();
      clearSensitiveData();
      navigate('/auth/login', { 
        replace: true, 
        state: { 
          message: 'Logged out successfully',
          type: 'success'
        }
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out. Please try again.');
      clearSensitiveData();
      navigate('/auth/login', { 
        replace: true,
        state: { 
          message: 'Session expired. Please log in again.',
          type: 'warning'
        } 
      });
    } finally {
      setLoading(false);
    }
  }, [clearSensitiveData, navigate]);

  // Memoize user data
  const userRole = user?.role || 'default';
  const userInitial = useMemo(() => 
    user?.name ? user.name.charAt(0).toUpperCase() : '?',
    [user?.name]
  );
  
  const roleIcon = useMemo(() => getRoleIcon(userRole), [userRole]);
  const roleBadgeClass = useMemo(() => getRoleBadgeClass(userRole), [userRole]);

  // Navigation handlers
  const handleProfileClick = useCallback(() => {
    setShowUserMenu(false);
    navigate('/profile');
  }, [navigate]);

  const handleDashboardClick = useCallback(() => {
    setShowUserMenu(false);
    navigate('/dashboard');
  }, [navigate]);

  const handleAdminPanelClick = useCallback(() => {
    setShowUserMenu(false);
    navigate('/admin/users');
  }, [navigate]);

  // Menu handlers
  const toggleUserMenu = useCallback(() => {
    setShowUserMenu(prev => !prev);
  }, []);

  const closeUserMenu = useCallback(() => {
    setShowUserMenu(false);
  }, []);

  // Close menu when clicking outside
  const handleClickOutside = useCallback((event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      closeUserMenu();
    }
  }, [closeUserMenu]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      closeUserMenu();
    }
  }, [closeUserMenu]);

  // Add/remove event listeners
  useEffect(() => {
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showUserMenu, handleClickOutside, handleKeyDown]);

  // Handle logo click
  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    navigate('/');
  }, [navigate]);

  // Show minimal header when not logged in
  if (!user) {
    return (
      <header className="app-header" role="banner">
        <div className="header-container">
          <div className="header-left">
            <button 
              onClick={handleLogoClick}
              className="logo-button"
              aria-label="Go to homepage"
            >
              <div className="logo-icon" role="img" aria-hidden="true">🎓</div>
              <div className="logo-text">
                <span className="logo-main">LMS</span>
                <span className="logo-subtitle">Learning Hub</span>
              </div>
            </button>
          </div>
          <div className="header-right">
            <button 
              className="auth-button"
              onClick={() => navigate('/auth/login')}
              aria-label="Sign in"
            >
              Sign In
            </button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <ErrorBoundary>
      <header className="app-header" role="banner">
        <div className="header-container">
          <div className="header-left">
            <button 
              onClick={handleLogoClick}
              className="logo-button"
              aria-label="Go to homepage"
            >
              <div className="logo-icon" role="img" aria-hidden="true">🎓</div>
              <div className="logo-text">
                <span className="logo-main">B1 SCHOOL</span>
                <span className="logo-subtitle">Learning Management System</span>
              </div>
            </button>
          </div>

          <div className="header-center">
            <nav className="quick-nav" role="navigation" aria-label="Main navigation">
              <NavItem 
                icon="📚" 
                text="Courses" 
                onClick={() => navigate('/courses')} 
                ariaLabel="Browse courses"
              />
              
              {user.role === 'student' && (
                <NavItem 
                  icon="🎯" 
                  text="My Learning" 
                  onClick={() => navigate('/my-enrollments')}
                  ariaLabel="View my learning"
                />
              )}
              
              {(user.role === 'instructor' || user.role === 'admin') && (
                <NavItem 
                  icon="📝" 
                  text="Assignments" 
                  onClick={() => navigate('/assignments/manage')}
                  ariaLabel="Manage assignments"
                />
              )}
              
              <NavItem 
                icon="🔍" 
                text="Search" 
                onClick={() => navigate('/search')}
                ariaLabel="Search courses and content"
              />
            </nav>
          </div>

          <div className="header-right" ref={menuRef}>
            <div className="user-section">
              <div className="user-info">
                <div 
                  className="user-avatar" 
                  role="img" 
                  aria-label={`${user.name || 'User'}'s avatar`}
                >
                  {userInitial}
                </div>
                <div className="user-details">
                  <span className="user-name">{user.name}</span>
                  <span className={`user-role ${roleBadgeClass}`}>
                    {roleIcon} {user.role}
                  </span>
                </div>
              </div>
              
              <div className="user-menu-container">
                <button 
                  onClick={toggleUserMenu}
                  className="user-menu-trigger"
                  aria-expanded={showUserMenu}
                  aria-label="User menu"
                  aria-haspopup="true"
                >
                  <span className="menu-icon" aria-hidden="true">⚙️</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown" role="menu">
                    <div className="dropdown-header">
                      <div className="dropdown-avatar">
                        {userInitial}
                      </div>
                      <div className="dropdown-info">
                        <span className="dropdown-name">{user.name}</span>
                        <span className="dropdown-email">{user.email}</span>
                      </div>
                    </div>
                    
                    <div className="dropdown-divider"></div>
                    
                    <div className="dropdown-menu">
                      <button 
                        className="dropdown-item"
                        onClick={handleProfileClick}
                        role="menuitem"
                      >
                        <span className="item-icon" aria-hidden="true">👤</span>
                        <span className="item-text">My Profile</span>
                      </button>
                      
                      <button 
                        className="dropdown-item"
                        onClick={handleDashboardClick}
                        role="menuitem"
                      >
                        <span className="item-icon" aria-hidden="true">🏠</span>
                        <span className="item-text">Dashboard</span>
                      </button>
                      
                      {user.role === 'admin' && (
                        <button 
                          className="dropdown-item"
                          onClick={handleAdminPanelClick}
                          role="menuitem"
                        >
                          <span className="item-icon" aria-hidden="true">⚙️</span>
                          <span className="item-text">Admin Panel</span>
                        </button>
                      )}
                      
                      <div className="dropdown-divider"></div>
                      
                      <button 
                        className="dropdown-item logout-item"
                        onClick={handleLogout}
                        disabled={loading}
                        role="menuitem"
                      >
                        <span className="item-icon" aria-hidden="true">
                          {loading ? '⏳' : '🚪'}
                        </span>
                        <span className="item-text">
                          {loading ? 'Logging out...' : 'Logout'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}
      </header>
    </ErrorBoundary>
  );
};

export default Header;