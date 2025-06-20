import api from './api';

const BASE_URL = 'http://localhost:5000/api';

// Authentication endpoints
export const register = (data) => api.post('/users/register', data);
export const login = (data) => api.post('/users/login', data);
export const logout = () => api.post('/users/logout');

// Google OAuth
export const googleOAuth = () => {
  window.location.href = `${BASE_URL}/users/google`;
};

// User management
export const getCurrentUser = () => api.get('/users/profile');
export const changePassword = (data) => api.post('/users/change-password', data);
export const updateProfile = (data) => api.put('/users/profile', data);

// Admin functions
export const getAllUsers = (params) => api.get('/users', { params });
export const updateUserRole = (id, data) => api.put(`/users/${id}/role`, data);
export const deleteUser = (id) => api.delete(`/users/${id}`);