# backend/Dockerfile

# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory to an absolute path
WORKDIR /nodeapp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port the app runs on
EXPOSE 1243

# Start the application
# CMD ["node", "app.js"]
CMD ["npm", "start"]