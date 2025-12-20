#!/bin/bash

echo "🚀 Deploying Sudoku Backend to Azure Container Apps..."
echo ""

# Configuration
RESOURCE_GROUP="sudoku-rg"
CONTAINER_APP_NAME="sudoku-backend"
ACR_NAME="sudokustrupwa"
IMAGE_NAME="sudoku-backend"

# Determine which tag to use
# Usage: ./deploy-backend.sh [tag]
if [ -n "$1" ]; then
  TAG="$1"
  echo "📦 Using provided tag: $TAG"
else
  TAG=$(git rev-parse HEAD)
  echo "📦 Using current commit SHA: $TAG"
fi

FULL_IMAGE="${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${TAG}"

echo "🎯 Target: ${CONTAINER_APP_NAME}"
echo "📦 Image: ${FULL_IMAGE}"
echo ""

# Update container app
echo "⏳ Updating container app..."
az containerapp update \
  --name "${CONTAINER_APP_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --image "${FULL_IMAGE}"

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Backend deployment successful!"
  echo ""
  echo "🌐 Getting backend URL..."
  BACKEND_URL=$(az containerapp show \
    --name "${CONTAINER_APP_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query properties.configuration.ingress.fqdn \
    --output tsv)
  
  echo "🔗 Backend URL: https://${BACKEND_URL}"
  echo ""
  
  # Test backend
  echo "🧪 Testing backend..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://${BACKEND_URL}")
  
  if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Backend is responding (HTTP ${HTTP_CODE})"
  else
    echo "⚠️  Backend returned HTTP ${HTTP_CODE}"
  fi
else
  echo ""
  echo "❌ Backend deployment failed!"
  exit 1
fi
