pipeline {
    agent any
    
    environment {
        // Azure Container Registry
        ACR_NAME = 'sudokuacr'
        ACR_LOGIN_SERVER = "${ACR_NAME}.azurecr.io"

        // ACR login credentials (Jenkins credentials ID)
        ACR_CREDENTIALS = credentials('azure-acr-credentials')

        // Azure Service Principal credentials (Jenkins credentials ID)
        AZURE_CREDENTIALS = credentials('azure-service-principal')

        // Tenant ID (You MUST set this in Jenkins as a secret text credential)
        AZURE_TENANT_ID = credentials('azure-tenant-id')

        // Image names
        BACKEND_IMAGE = "${ACR_LOGIN_SERVER}/sudoku-backend"
        FRONTEND_IMAGE = "${ACR_LOGIN_SERVER}/sudoku-frontend"

        // App names and RG
        BACKEND_APP_NAME = 'sudoku-backend-api'
        FRONTEND_APP_NAME = 'sudoku-frontend-app'
        RESOURCE_GROUP = 'sudoku-rg'
    }
    
    stages {

        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/Aizz23/PSO-Sudoku-Game.git'
            }
        }

        stage('Install Dependencies') {
            parallel {

                stage('Backend Dependencies') {
                    steps {
                        dir('backend') {
                            sh 'npm ci'
                        }
                    }
                }

                stage('Frontend Dependencies') {
                    steps {
                        dir('frontend') {
                            sh 'npm ci'
                        }
                    }
                }

            }
        }
        
        stage('Run Tests') {
            parallel {

                stage('Backend Tests') {
                    steps {
                        dir('backend') {
                            sh 'npm test || true'
                        }
                    }
                }

                stage('Frontend Tests') {
                    steps {
                        dir('frontend') {
                            sh 'npm test -- --watchAll=false || true'
                        }
                    }
                }

            }
        }
        
        stage('Build Docker Images') {
            steps {
                script {
                    sh """
                        docker build -t ${BACKEND_IMAGE}:${BUILD_NUMBER} -t ${BACKEND_IMAGE}:latest ./backend
                        docker build -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest ./frontend
                    """
                }
            }
        }
        
        stage('Push to Azure Container Registry') {
            steps {
                script {
                    sh """
                        echo ${ACR_CREDENTIALS_PSW} | docker login ${ACR_LOGIN_SERVER} -u ${ACR_CREDENTIALS_USR} --password-stdin
                        
                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${BACKEND_IMAGE}:latest

                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest
                    """
                }
            }
        }
        
        stage('Deploy to Azure Web App') {
            steps {
                script {
                    sh """
                        # Login to Azure via service principal
                        az login --service-principal \
                            -u ${AZURE_CREDENTIALS_USR} \
                            -p ${AZURE_CREDENTIALS_PSW} \
                            --tenant ${AZURE_TENANT_ID}
                        
                        # Update Backend Web App
                        az webapp config container set \
                            --name ${BACKEND_APP_NAME} \
                            --resource-group ${RESOURCE_GROUP} \
                            --docker-custom-image-name ${BACKEND_IMAGE}:${BUILD_NUMBER} \
                            --docker-registry-server-url https://${ACR_LOGIN_SERVER} \
                            --docker-registry-server-user ${ACR_CREDENTIALS_USR} \
                            --docker-registry-server-password ${ACR_CREDENTIALS_PSW}
                        
                        # Update Frontend Web App
                        az webapp config container set \
                            --name ${FRONTEND_APP_NAME} \
                            --resource-group ${RESOURCE_GROUP} \
                            --docker-custom-image-name ${FRONTEND_IMAGE}:${BUILD_NUMBER} \
                            --docker-registry-server-url https://${ACR_LOGIN_SERVER} \
                            --docker-registry-server-user ${ACR_CREDENTIALS_USR} \
                            --docker-registry-server-password ${ACR_CREDENTIALS_PSW}
                        
                        # Restart Apps
                        az webapp restart --name ${BACKEND_APP_NAME} --resource-group ${RESOURCE_GROUP}
                        az webapp restart --name ${FRONTEND_APP_NAME} --resource-group ${RESOURCE_GROUP}
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sh """
                        echo "Waiting for services to start..."
                        sleep 30
                        
                        curl -f https://${BACKEND_APP_NAME}.azurewebsites.net/health || exit 1
                        
                        echo "Deployment successful!"
                    """
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ Pipeline completed successfully!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
        always {
            sh 'docker system prune -f'
        }
    }
}
