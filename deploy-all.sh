#!/bin/bash

set -e

echo "🚀 Deploying PSO Sudoku Game to Azure..."

# Variables
RESOURCE_GROUP="sudoku-rg"
ACR_LOGIN_SERVER="sudokustrupwa.azurecr.io"
BACKEND_APP="sudoku-backend"
FRONTEND_APP="sudoku-frontend"

# Get latest commit SHA from git
COMMIT_SHA=$(git rev-parse HEAD)

echo "📦 Deploying images with commit: $COMMIT_SHA"

# Deploy Backend
echo "🔄 Deploying backend..."
az containerapp update \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --image ${ACR_LOGIN_SERVER}/sudoku-backend:latest

# Deploy Frontend
echo "🔄 Deploying frontend..."
az containerapp update \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --image ${ACR_LOGIN_SERVER}/sudoku-frontend:latest

# Get URLs
BACKEND_URL=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo ""
echo "✅ Deployment complete!"
echo "🌐 Backend:  https://$BACKEND_URL"
echo "🌐 Frontend: https://$FRONTEND_URL"