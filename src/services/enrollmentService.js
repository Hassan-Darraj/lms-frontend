import api from './api';

export const enrollUser = (data) => api.post('/enrollments', data);
export const getAllEnrollments = () => api.get('/enrollments');
export const getEnrollmentById = (id) => api.get(`/enrollments/${id}`);
export const updateEnrollment = (id, data) => api.put(`/enrollments/${id}`, data);
export const deleteEnrollment = (id) => api.delete(`/enrollments/${id}`);

// Stats and trends (these DO exist in backend)
export const getEnrollmentStats = (params) => api.get('/enrollments/stats', { params });
export const getEnrollmentTrends = (params) => api.get('/enrollments/trends', { params });

// Progress tracking
export const markLessonCompleted = (userId, lessonData) => 
  api.post(`/enrollments/${userId}/lessons/completed`, lessonData);

export const markAssignmentCompleted = (userId, assignmentData) => 
  api.post(`/enrollments/${userId}/assignments/completed`, assignmentData);

export const markQuizCompleted = (userId, quizData) => 
  api.post(`/enrollments/${userId}/quizzes/completed`, quizData);

export const getCourseProgress = (userId, courseId) => 
  api.get(`/enrollments/${userId}/courses/${courseId}/progress`);

export const getUserEnrollmentsWithProgress = (userId) => 
  api.get(`/enrollments/users/${userId}/enrollments`);
