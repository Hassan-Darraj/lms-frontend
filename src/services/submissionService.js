import api from './api';

export const createSubmission = (data) => api.post('/submissions', data);
export const getSubmissionsByAssignment = (assignmentId) => api.get(`/submissions/assignment/${assignmentId}`);
export const getSubmissionsByUser = (userId) => api.get(`/submissions/user/${userId}`);
export const getSubmissionById = (id) => api.get(`/submissions/${id}`);
export const gradeSubmission = (id, data) => api.put(`/submissions/${id}/grade`, data);

// File upload for submissions (matches backend /submissions/upload route)
export const uploadSubmission = (data, config) => api.post('/submissions/upload', data, config);
