import api from './api';

export const createModule = (data) => api.post('/modules', data);
export const getModulesByCourse = (courseId) => api.get(`/modules/course/${courseId}`);
export const getModuleById = (id) => api.get(`/modules/${id}`);
export const updateModule = (id, data) => api.put(`/modules/${id}`, data);
export const deleteModule = (id) => api.delete(`/modules/${id}`);
