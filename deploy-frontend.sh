#!/bin/bash

echo "🚀 Deploying Sudoku Frontend to Azure Container Apps..."
echo ""

# Configuration
RESOURCE_GROUP="sudoku-rg"
CONTAINER_APP_NAME="sudoku-frontend"
ACR_NAME="sudokustrupwa"
IMAGE_NAME="sudoku-frontend"
TAG="${1:-latest}"

FULL_IMAGE="${ACR_NAME}.azurecr.io/${IMAGE_NAME}:${TAG}"

echo "📦 Image: ${FULL_IMAGE}"
echo "🎯 Target: ${CONTAINER_APP_NAME}"
echo ""

# Update container app
echo "⏳ Updating container app..."
az containerapp update \
  --name "${CONTAINER_APP_NAME}" \
  --resource-group "${RESOURCE_GROUP}" \
  --image "${FULL_IMAGE}"

if [ $?  -eq 0 ]; then
  echo ""
  echo "✅ Frontend deployment successful!"
  echo ""
  echo "🌐 Getting frontend URL..."
  FRONTEND_URL=$(az containerapp show \
    --name "${CONTAINER_APP_NAME}" \
    --resource-group "${RESOURCE_GROUP}" \
    --query properties.configuration.ingress. fqdn \
    --output tsv)
  
  echo "🔗 Frontend URL: https://${FRONTEND_URL}"
  echo ""
  
  # Test frontend
  echo "🧪 Testing frontend..."
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "https://${FRONTEND_URL}")
  
  if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Frontend is responding (HTTP ${HTTP_CODE})"
  else
    echo "⚠️  Frontend returned HTTP ${HTTP_CODE}"
  fi
else
  echo ""
  echo "❌ Frontend deployment failed!"
  exit 1
fi
