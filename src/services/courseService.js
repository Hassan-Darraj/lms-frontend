import api from './api';

export const getCourses = (params) => api.get('/courses', { params });
export const getCourseById = (id) => api.get(`/courses/${id}`);
export const createCourse = (data, config) => api.post('/courses', data, config);
export const updateCourse = (id, data, config) => api.put(`/courses/${id}`, data, config);
export const deleteCourse = (id) => api.delete(`/courses/${id}`);
export const getCoursesByCategory = (categoryId) => api.get(`/courses/category/${categoryId}`);
