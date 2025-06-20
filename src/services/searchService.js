import api from './api';

// Global search across all entities
export const globalSearch = (params) => api.get('/search', { params });

// Advanced course search with filters
export const searchCourses = (params) => api.get('/search/courses', { params });

// Search users (admin only)
export const searchUsers = (params) => api.get('/search/users', { params });

// Get search suggestions/autocomplete
export const getSearchSuggestions = (params) => api.get('/search/suggestions', { params });