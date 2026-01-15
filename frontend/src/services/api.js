import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear tokens and redirect to login
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (credentials) => api.post('/auth/login/', credentials),
  refreshToken: (refreshToken) => api.post('/auth/token/refresh/', { refresh: refreshToken }),
  searchUsers: (query) => api.get(`/auth/search/?q=${encodeURIComponent(query)}`),
};

// Projects APIs
export const projectsAPI = {
  getAll: () => api.get('/projects/'),
  getById: (id) => api.get(`/projects/${id}/`),
  create: (data) => api.post('/projects/', data),
  update: (id, data) => api.patch(`/projects/${id}/`, data),
  delete: (id) => api.delete(`/projects/${id}/`),
  
  // Members
  getMembers: (projectId) => api.get(`/projects/${projectId}/members/`),
  addMember: (projectId, data) => api.post(`/projects/${projectId}/members/`, data),
  removeMember: (projectId, userId) => 
    api.delete(`/projects/${projectId}/members/`, { data: { user_id: userId } }),
};

// Tasks APIs
export const tasksAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return api.get(`/tasks/${params ? '?' + params : ''}`);
  },
  getById: (id) => api.get(`/tasks/${id}/`),
  create: (data) => api.post('/tasks/', data),
  update: (id, data) => api.patch(`/tasks/${id}/`, data),
  delete: (id) => api.delete(`/tasks/${id}/`),
};

export default api;
