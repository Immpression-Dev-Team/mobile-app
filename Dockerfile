# Use Node.js image
FROM node:20-alpine3.20

# Set working directory
WORKDIR /app

# Copy project files
COPY . .

# Install global dependencies
RUN npm install -g expo-cli @expo/ngrok@latest eas-cli

# Update and install dependencies
RUN npm install

# Expose Expo and Metro ports
EXPOSE 19000
EXPOSE 8081

# Enable polling for file changes
ENV CHOKIDAR_USEPOLLING=true

# Start Expo in tunnel mode for external access
CMD ["npx", "expo", "start", "--tunnel"]
