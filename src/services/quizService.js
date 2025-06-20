import api from './api';

export const createQuiz = (data) => api.post('/quizzes', data);
export const getQuizzesByLesson = (lessonId) => api.get(`/quizzes/lesson/${lessonId}`);
export const getQuizById = (id) => api.get(`/quizzes/${id}`);
export const updateQuiz = (id, data) => api.put(`/quizzes/${id}`, data);
export const deleteQuiz = (id) => api.delete(`/quizzes/${id}`);
