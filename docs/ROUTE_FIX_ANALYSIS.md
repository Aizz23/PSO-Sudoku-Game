# Route Not Found - Root Cause Analysis & Fix

## 🔍 Problem Diagnosis

**Issue:** Login and Register routes returning "Route not found" error on production website.

**URL:** https://sudoku-frontend.agreeableforest-82817a2d.southeastasia.azurecontainerapps.io

## 🎯 Root Cause

### The Mismatch:

**Frontend API calls** (before fix):
```javascript
authAPI.register() → POST /auth/register
authAPI.login() → POST /auth/login
```

**Backend route registration**:
```javascript
app.use('/api/auth', require('./routes/auth'))
```

**Expected endpoints**:
- POST `/api/auth/register`
- POST `/api/auth/login`

### Why It Failed:

The frontend was calling `/auth/register` and `/auth/login`, but the backend only responds to `/api/auth/register` and `/api/auth/login`.

The axios baseURL was set correctly to the backend URL, but **all route paths were missing the `/api` prefix**.

## ✅ Solution Applied

### Fixed File: `frontend/src/services/api.js`

Added `/api` prefix to all API endpoints:

#### Auth API (Lines 53-60)
```javascript
// BEFORE
register: (userData) => api.post('/auth/register', userData),
login: (credentials) => api.post('/auth/login', credentials),
getUser: (userId) => api.get(`/auth/user/${userId}`),

// AFTER
register: (userData) => api.post('/api/auth/register', userData),
login: (credentials) => api.post('/api/auth/login', credentials),
getUser: (userId) => api.get(`/api/auth/user/${userId}`),
```

#### Puzzle API (Lines 27-38)
```javascript
// BEFORE
generate: (difficulty) => api.get(`/puzzles/generate?difficulty=${difficulty}`)

// AFTER
generate: (difficulty) => api.get(`/api/puzzles/generate?difficulty=${difficulty}`)
```

#### Game API (Lines 40-52)
```javascript
// BEFORE
create: (gameData) => api.post('/games', gameData)

// AFTER
create: (gameData) => api.post('/api/games', gameData)
```

#### Leaderboard API (Lines 62-76)
```javascript
// BEFORE
getTopScores: () => api.get(`/leaderboard/top-scores?...`)

// AFTER
getTopScores: () => api.get(`/api/leaderboard/top-scores?...`)
```

## 🚀 Deployment Steps

To apply this fix to production:

### Option 1: Automated CI/CD
```bash
git add frontend/src/services/api.js
git commit -m "fix: Add /api prefix to all API endpoints"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run tests
2. Build the Docker image
3. Push to Azure Container Registry
4. Display deployment instructions

### Option 2: Manual Deployment
```bash
# Navigate to project root
cd PSO-Sudoku-Game

# Build and deploy frontend
./deploy-frontend.sh
```

### Option 3: Direct Azure CLI
```bash
# Build the frontend Docker image with build args
docker build \
  --build-arg REACT_APP_API_URL=https://sudoku-backend.agreeableforest-82817a2d.southeastasia.azurecontainerapps.io \
  -t sudokustrupwa.azurecr.io/sudoku-frontend:latest \
  ./frontend

# Push to ACR
az acr login --name sudokustrupwa
docker push sudokustrupwa.azurecr.io/sudoku-frontend:latest

# Update Container App
az containerapp update \
  --name sudoku-frontend \
  --resource-group sudoku-rg \
  --image sudokustrupwa.azurecr.io/sudoku-frontend:latest
```

## ✅ Verification

After deployment, test the following:

1. **Register New User**
   - Navigate to: https://sudoku-frontend.agreeableforest-82817a2d.southeastasia.azurecontainerapps.io/register
   - Fill in username, email, password
   - Click "Register"
   - Should redirect to game page

2. **Login Existing User**
   - Navigate to: https://sudoku-frontend.agreeableforest-82817a2d.southeastasia.azurecontainerapps.io/login
   - Enter email and password
   - Click "Login"
   - Should redirect to game page

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Network tab should show:
     - POST `https://sudoku-backend.../api/auth/register` → 201 Created
     - POST `https://sudoku-backend.../api/auth/login` → 200 OK

## 📊 Impact

### Fixed Endpoints:
- ✅ `/api/auth/register` - User registration
- ✅ `/api/auth/login` - User login
- ✅ `/api/auth/user/:id` - Get user profile
- ✅ `/api/puzzles/generate` - Generate puzzle
- ✅ `/api/puzzles/validate` - Validate board
- ✅ `/api/puzzles/solve` - Solve puzzle
- ✅ `/api/puzzles/hint` - Get hint
- ✅ `/api/games/*` - All game operations
- ✅ `/api/leaderboard/*` - All leaderboard operations

## 🔧 Prevention

To prevent this issue in the future:

1. **Use environment variable for API prefix**:
   ```javascript
   const API_PREFIX = '/api';
   authAPI.register = (userData) => api.post(`${API_PREFIX}/auth/register`, userData);
   ```

2. **Add integration tests** that verify API endpoints match backend routes

3. **Document API contract** between frontend and backend

---

**Fixed By:** Antigravity AI  
**Date:** 2025-12-20  
**Status:** ✅ Ready for Deployment
