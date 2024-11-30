# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Expose the port for Vite (default: 5173)
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev", "--", "--host"]
