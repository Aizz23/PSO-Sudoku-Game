# 🎮 Sudoku Game - Full Stack Application

A modern, full-stack Sudoku game application built with **React**, **Node.js**, **Express**, and **MongoDB**. This project includes a complete CI/CD pipeline ready for deployment to Azure with Jenkins automation.

![Sudoku Game](https://img.shields.io/badge/Game-Sudoku-blue)
![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker Deployment](#docker-deployment)
- [Azure Deployment](#azure-deployment)
- [API Documentation](#api-documentation)

## ✨ Features

### Game Features
- 🎯 **Multiple Difficulty Levels**: Easy, Medium, Hard, and Expert
- ⏱️ **Timer**: Track your completion time
- 💡 **Hint System**: Get up to 3 hints per game
- ✅ **Real-time Validation**: Instant feedback on moves
- 🎨 **Beautiful UI**: Modern, responsive design
- 📱 **Mobile Friendly**: Play on any device

### User Features
- 👤 **User Authentication**: Register and login
- 📊 **Statistics Tracking**: View your game history and stats
- 🏆 **Leaderboard**: Compete with other players
- ⭐ **Score System**: Earn points based on performance

### Technical Features
- 🐳 **Dockerized**: Easy deployment with Docker
- 🔄 **CI/CD Ready**: Jenkins pipeline configuration
- ☁️ **Azure Ready**: Configured for Azure Web App + Cosmos DB
- 🔒 **Secure**: JWT authentication
- 📦 **RESTful API**: Clean, documented API

## 🛠️ Tech Stack

**Frontend:** React 18.2, React Router, Axios, CSS3  
**Backend:** Node.js 18+, Express, MongoDB, Mongoose, JWT, Bcrypt  
**DevOps:** Docker, Docker Compose, Jenkins, Azure (Web App for Containers, ACR, Cosmos DB)

## 📦 Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose
- Git

For Azure deployment:
- Azure account & Azure CLI
- Jenkins server

## 🚀 Quick Start

### Option 1: With Docker Compose (Recommended)

```bash
git clone https://github.com/Aizz23/PSO-Sudoku-Game.git
cd PSO-Sudoku-Game
docker-compose up --build
```

The application will be available at:
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`
- MongoDB: `localhost:27017`

### Option 2: Without Docker

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 🐳 Docker Deployment

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d

# Stop services
docker-compose down

# Clean all
docker-compose down -v && docker system prune -f
```

## ☁️ Azure Deployment

### Quick Deploy to Azure

```bash
# Login to Azure
az login

# Create resources
az group create --name sudoku-rg --location eastus
az acr create --resource-group sudoku-rg --name sudokuacr --sku Basic
az cosmosdb create --name sudoku-cosmos --resource-group sudoku-rg --kind MongoDB

# Build and push images
az acr login --name sudokuacr
docker tag sudoku-backend:latest sudokuacr.azurecr.io/sudoku-backend:latest
docker tag sudoku-frontend:latest sudokuacr.azurecr.io/sudoku-frontend:latest
docker push sudokuacr.azurecr.io/sudoku-backend:latest
docker push sudokuacr.azurecr.io/sudoku-frontend:latest

# Create web apps
az appservice plan create --name sudoku-plan --resource-group sudoku-rg --is-linux --sku B1

az webapp create \
  --resource-group sudoku-rg \
  --plan sudoku-plan \
  --name sudoku-backend-api \
  --deployment-container-image-name sudokuacr.azurecr.io/sudoku-backend:latest

az webapp create \
  --resource-group sudoku-rg \
  --plan sudoku-plan \
  --name sudoku-frontend-app \
  --deployment-container-image-name sudokuacr.azurecr.io/sudoku-frontend:latest
```

## 📚 API Documentation

### Base URL: `http://localhost:5000/api`

**Authentication:**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

**Puzzles:**
- `GET /api/puzzles/generate?difficulty=medium` - Generate puzzle
- `POST /api/puzzles/hint` - Get hint

**Games:**
- `POST /api/games` - Create game
- `GET /api/games/:id` - Get game
- `PUT /api/games/:id` - Update game

**Leaderboard:**
- `GET /api/leaderboard/top-scores` - Top scores
- `GET /api/leaderboard/top-players` - Top players
- `GET /api/leaderboard/stats` - Statistics

## 🔄 CI/CD Pipeline

The project includes a complete Jenkins pipeline (`Jenkinsfile`) that:
1. Builds Docker images
2. Runs tests
3. Pushes to Azure Container Registry
4. Deploys to Azure Web Apps
5. Performs health checks

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

MIT License - see LICENSE file for details

## 👨‍💻 Author

**Aizz23** - [@Aizz23](https://github.com/Aizz23)

---

**Happy Coding! 🎮🚀**
