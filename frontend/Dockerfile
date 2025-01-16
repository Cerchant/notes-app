# Use Node.js image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Build the application
COPY . .
RUN npm run build

# Use nginx for serving the app
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output to nginx
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
