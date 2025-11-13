# # -------------------------
# # Stage 1: Build the app
# # -------------------------
# FROM node:20-alpine AS builder

# WORKDIR /app

# # Copy package files first (for efficient caching)
# COPY package*.json ./

# RUN npm install

# # Copy rest of the application
# COPY . .

# # Build the NestJS project
# RUN npm run build

# # -------------------------
# # Stage 2: Production image
# # -------------------------
# FROM node:20-alpine

# WORKDIR /app

# # Copy only the built files and necessary assets
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./

# RUN npm install --only=production

# # Expose the app port
# EXPOSE 3000

# # Start the app
# CMD ["node", "dist/main.js"]



# -------------------------------
# 🧱 Stage 1: Base
# -------------------------------
FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

# -------------------------------
# 🧩 Stage 2: Development
# -------------------------------
FROM base AS development
RUN npm install
COPY . .
# Use ts-node-dev for live reload
RUN npm install -g ts-node-dev
CMD ["npm", "run", "start:dev"]

# -------------------------------
# 🚀 Stage 3: Production
# -------------------------------
# FROM base AS production
# ENV NODE_ENV=production
# RUN npm ci --only=production
# COPY . .
# RUN npm run build
# CMD ["npm", "run", "start:prod"]
