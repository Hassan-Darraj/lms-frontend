import api from './api';

export const createAssignment = (data) => api.post('/assignments', data);
export const getAssignmentsByLesson = (lessonId) => api.get(`/assignments/lesson/${lessonId}`);
export const getAssignmentById = (id) => api.get(`/assignments/${id}`);
export const updateAssignment = (id, data) => api.put(`/assignments/${id}`, data);
export const deleteAssignment = (id) => api.delete(`/assignments/${id}`);
