import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',  // 🔥 FIXED HERE (5000 → 5001)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // In development we avoid automatic logout+redirect on 401 so a
    // single failing request (e.g. during startup token verification)
    // doesn't cause redirect loops or cascade of requests. In
    // production preserve the stricter behavior.
    const isDev = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

    if (error.response?.status === 401) {
      if (isDev) {
        // Do not clear local storage or force navigation in dev —
        // let the app decide how to handle auth state and show errors.
        console.warn('Received 401 (dev mode) — not auto-logging out');
        return Promise.reject(error);
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  verifyToken: () => api.get('/auth/verify'),
};

// Movies API
export const moviesAPI = {
  getAll: (params = {}) => api.get('/movies', { params }),
  getById: (id) => api.get(`/movies/${id}`),
  getFeatured: () => api.get('/movies/featured/list'),
  getByGenre: (genre, params = {}) => api.get(`/movies/genre/${genre}`, { params }),
  search: (query, params = {}) => api.get(`/movies/search/${query}`, { params }),
  getRandom: () => api.get('/movies/random/one'),
  getGenres: () => api.get('/movies/genres/list'),
  create: (movieData) => api.post('/movies', movieData),
  update: (id, movieData) => api.put(`/movies/${id}`, movieData),
  delete: (id) => api.delete(`/movies/${id}`),
};

// MyList API
export const myListAPI = {
  getAll: (params = {}) => api.get('/mylist', { params }),
  add: (movieId) => api.post(`/mylist/add/${movieId}`),
  remove: (movieId) => api.delete(`/mylist/remove/${movieId}`),
  check: (movieId) => api.get(`/mylist/check/${movieId}`),
  updateProgress: (movieId, data) => api.put(`/mylist/progress/${movieId}`, data),
  getRecent: (params = {}) => api.get('/mylist/recent', { params }),
  getStats: () => api.get('/mylist/stats'),
};

// Upload API
export const uploadAPI = {
  uploadVideo: (movieId, videoFile) => {
    const formData = new FormData();
    formData.append('video', videoFile);
    return api.post(`/upload/video/${movieId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadPoster: (posterFile) => {
    const formData = new FormData();
    formData.append('poster', posterFile);
    return api.post('/upload/poster', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadBackdrop: (backdropFile) => {
    const formData = new FormData();
    formData.append('backdrop', backdropFile);
    return api.post('/upload/backdrop', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  deleteVideo: (movieId) => api.delete(`/upload/video/${movieId}`),
  streamVideo: (movieId) =>
    `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/upload/video/${movieId}`, // 🔥 FIXED 5000→5001
};

export default api;
