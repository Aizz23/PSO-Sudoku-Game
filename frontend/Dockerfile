# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . . 

# Build arguments - must be declared BEFORE they are used
ARG REACT_APP_API_URL
ARG REACT_APP_APPINSIGHTS_CONNECTION_STRING

# Set environment variables for build time
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_APPINSIGHTS_CONNECTION_STRING=$REACT_APP_APPINSIGHTS_CONNECTION_STRING

# Build the application (env vars will be baked into the build)
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]