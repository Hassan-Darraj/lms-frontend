import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure authentication state is properly set
    const timer = setTimeout(() => {
      setAuthChecked(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Show loading while checking authentication
  if (loading || !authChecked) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <LoadingSpinner message="Checking authentication..." />
      </div>
    );
  }

  // If not authenticated, redirect to login with the current location
  if (!isAuthenticated || !user) {
    return (
      <Navigate 
        to="/auth/login" 
        state={{ from: location }} 
        replace 
      />
    );
  }

  // If authenticated but role is not allowed, redirect to appropriate dashboard
    console.warn(`Access denied for role: ${user.role}. Redirecting...`);

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to user's role-appropriate dashboard
    let redirectPath;
    let role = JSON.stringify(localStorage.getItem('user')).role || user.role;
    switch (role) {
      case 'admin':
        redirectPath = '/dashboard/admin';
        break;
      case 'instructor':
        redirectPath = '/dashboard/instructor';
        break;
      case 'student':
      default:
        redirectPath = '/dashboard/student';
        break;
    }
    
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and has proper role
  return children;
};

export default ProtectedRoute;