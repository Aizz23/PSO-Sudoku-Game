#!/bin/bash

set -e

echo "🚀 Deploying PSO Sudoku Game to Azure..."

# Variables
RESOURCE_GROUP="sudoku-rg"
ACR_LOGIN_SERVER="sudokustrupwa.azurecr.io"
BACKEND_APP="sudoku-backend"
FRONTEND_APP="sudoku-frontend"

# Determine which tag to use
# Usage: ./deploy-all.sh [tag]
# Examples:
#   ./deploy-all.sh           # Uses current git commit SHA
#   ./deploy-all.sh latest    # Uses latest tag
#   ./deploy-all.sh abc123    # Uses specific commit SHA

if [ -n "$1" ]; then
  # Use provided tag argument
  IMAGE_TAG="$1"
  echo "📦 Using provided tag: $IMAGE_TAG"
else
  # Default to current git commit SHA (matches GitHub Actions)
  IMAGE_TAG=$(git rev-parse HEAD)
  echo "📦 Using current commit SHA: $IMAGE_TAG"
fi

echo ""
echo "� Verifying images exist in ACR..."

# Check if images with this tag exist
BACKEND_IMAGE="${ACR_LOGIN_SERVER}/sudoku-backend:${IMAGE_TAG}"
FRONTEND_IMAGE="${ACR_LOGIN_SERVER}/sudoku-frontend:${IMAGE_TAG}"

echo "  Backend:  $BACKEND_IMAGE"
echo "  Frontend: $FRONTEND_IMAGE"
echo ""

# Deploy Backend
echo "🔄 Deploying backend..."
az containerapp update \
  --name $BACKEND_APP \
  --resource-group $RESOURCE_GROUP \
  --image $BACKEND_IMAGE

# Deploy Frontend
echo "🔄 Deploying frontend..."
az containerapp update \
  --name $FRONTEND_APP \
  --resource-group $RESOURCE_GROUP \
  --image $FRONTEND_IMAGE

# Get URLs
BACKEND_URL=$(az containerapp show --name $BACKEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)
FRONTEND_URL=$(az containerapp show --name $FRONTEND_APP --resource-group $RESOURCE_GROUP --query properties.configuration.ingress.fqdn -o tsv)

echo ""
echo "✅ Deployment complete!"
echo "🌐 Backend:  https://$BACKEND_URL"
echo "🌐 Frontend: https://$FRONTEND_URL"