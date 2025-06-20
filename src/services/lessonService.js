import api from './api';

export const createLesson = (data, config) => api.post('/lessons', data, config);
export const getLessonsByModule = (moduleId) => api.get(`/lessons/module/${moduleId}`);
export const getLessonById = (id) => api.get(`/lessons/${id}`);
export const updateLesson = (id, data) => api.put(`/lessons/${id}`, data);
export const deleteLesson = (id) => api.delete(`/lessons/${id}`);
