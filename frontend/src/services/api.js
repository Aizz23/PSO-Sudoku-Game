import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    api.get(`/puzzles/generate?difficulty=${difficulty}`),
  
  validate: (board) => 
    api.post('/puzzles/validate', { board }),
  
  solve: (board) => 
    api.post('/puzzles/solve', { board }),
  
  getHint: (puzzle, solution) => 
    api.post('/puzzles/hint', { puzzle, solution }),
};

// Game API
export const gameAPI = {
  create: (gameData) => 
    api.post('/games', gameData),
  
  getById: (id) => 
    api.get(`/games/${id}`),
  
  update: (id, updateData) => 
    api.put(`/games/${id}`, updateData),
  
  getUserGames: (userId) => 
    api.get(`/games/user/${userId}`),
  
  delete: (id) => 
    api.delete(`/games/${id}`),
};

// Auth API
export const authAPI = {
  register: (userData) => 
    api.post('/auth/register', userData),
  
  login: (credentials) => 
    api.post('/auth/login', credentials),
  
  getUser: (userId) => 
    api.get(`/auth/user/${userId}`),
};

// Leaderboard API
export const leaderboardAPI = {
  getTopScores: (difficulty = '', limit = 10) => 
    api.get(`/leaderboard/top-scores?difficulty=${difficulty}&limit=${limit}`),
  
  getFastestTimes: (difficulty = '', limit = 10) => 
    api.get(`/leaderboard/fastest-times?difficulty=${difficulty}&limit=${limit}`),
  
  getTopPlayers: (limit = 10) => 
    api.get(`/leaderboard/top-players?limit=${limit}`),
  
  getStats: () => 
    api.get('/leaderboard/stats'),
};

export default api;
