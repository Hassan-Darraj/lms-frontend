import api from './api';

export const getUserActivityReport = (params) => api.get('/reports/users/activity', { params });
export const getCoursePopularityReport = (params) => api.get('/reports/courses/popularity', { params });
export const getSystemUsageReport = () => api.get('/reports/system/usage');
