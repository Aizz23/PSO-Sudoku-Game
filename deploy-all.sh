#!/bin/bash

echo "╔════════════════════════════════════════════════╗"
echo "║   Sudoku Game - Full Deployment to Azure      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

TAG="${1:-latest}"

echo "📦 Deploying version: ${TAG}"
echo ""

# Deploy backend first
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  BACKEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./deploy-backend.sh "${TAG}"
BACKEND_STATUS=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  FRONTEND DEPLOYMENT"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
./deploy-frontend.sh "${TAG}"
FRONTEND_STATUS=$?

echo ""
echo "╔════════════════════════════════════════════════╗"
echo "║           DEPLOYMENT SUMMARY                   ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

if [ $BACKEND_STATUS -eq 0 ]; then
  echo "✅ Backend: SUCCESS"
else
  echo "❌ Backend: FAILED"
fi

if [ $FRONTEND_STATUS -eq 0 ]; then
  echo "✅ Frontend: SUCCESS"
else
  echo "❌ Frontend: FAILED"
fi

echo ""

if [ $BACKEND_STATUS -eq 0 ] && [ $FRONTEND_STATUS -eq 0 ]; then
  echo "🎉 Full deployment completed successfully!"
  echo ""
  echo "🌐 Your application is live!"
  
  # Get URLs
  BACKEND_URL=$(az containerapp show --name sudoku-backend --resource-group sudoku-rg --query properties. configuration.ingress.fqdn -o tsv)
  FRONTEND_URL=$(az containerapp show --name sudoku-frontend --resource-group sudoku-rg --query properties.configuration.ingress.fqdn -o tsv)
  
  echo ""
  echo "🔗 Backend:  https://${BACKEND_URL}"
  echo "🔗 Frontend: https://${FRONTEND_URL}"
  echo ""
  exit 0
else
  echo "⚠️  Deployment completed with errors!"
  exit 1
fi
