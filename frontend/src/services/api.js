import axios from 'axios';

// eslint-disable-next-line no-undef
const API_URL = window.ENV?.REACT_APP_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Puzzle API
export const puzzleAPI = {
  generate: (difficulty = 'medium') =>
    api.get(`/api/puzzles/generate?difficulty=${difficulty}`),

  validate: (board) => api.post('/api/puzzles/validate', { board }),

  solve: (board) => api.post('/api/puzzles/solve', { board }),

  getHint: (puzzle, solution) =>
    api.post('/api/puzzles/hint', { puzzle, solution }),
};

// Game API
export const gameAPI = {
  create: (gameData) => api.post('/api/games', gameData),

  getById: (id) => api.get(`/api/games/${id}`),

  update: (id, updateData) => api.put(`/api/games/${id}`, updateData),

  getUserGames: (userId) => api.get(`/api/games/user/${userId}`),

  delete: (id) => api.delete(`/api/games/${id}`),
};

// Auth API
export const authAPI = {
  register: (userData) => api.post('/api/auth/register', userData),

  login: (credentials) => api.post('/api/auth/login', credentials),

  getUser: (userId) => api.get(`/api/auth/user/${userId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getTopScores: (difficulty = '', limit = 10) =>
    api.get(`/api/leaderboard/top-scores?difficulty=${difficulty}&limit=${limit}`),

  getFastestTimes: (difficulty = '', limit = 10) =>
    api.get(
      `/api/leaderboard/fastest-times?difficulty=${difficulty}&limit=${limit}`
    ),

  getTopPlayers: (limit = 10) =>
    api.get(`/api/leaderboard/top-players?limit=${limit}`),

  getStats: () => api.get('/api/leaderboard/stats'),
};

export default api;
