import { useState, useEffect } from 'react';
import { getCurrentUser, logout } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to get current user using session cookies
        const response = await getCurrentUser();
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
          setIsAuthenticated(true);
          // Store user data for quick access (but not the token)
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (error) {
        // Session expired or user not authenticated
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Always clear local state regardless of API call success
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    if (newUserData) {
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(newUserData));
    } else {
      setIsAuthenticated(false);
      localStorage.removeItem('user');
    }
  };

  return { 
    user, 
    loading, 
    isAuthenticated, 
    handleLogout, 
    updateUser 
  };
};