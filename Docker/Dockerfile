# STAGE 1: Build the frontend
FROM node:20-alpine AS frontend_builder

WORKDIR /app

# Copy package.json and package-lock.json
COPY frontend/package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the frontend code
COPY ./frontend /app

# Build the frontend
RUN npm run build 

# STAGE 2: Fullstack image
FROM node:20-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY backend/package*.json .

# Install dependencies
RUN npm install

# Copy the rest of the backend code
COPY ./backend /app

# Copy frontend build to public
COPY --from=frontend_builder /app/dist /app/public

CMD [ "node", "server.js" ]