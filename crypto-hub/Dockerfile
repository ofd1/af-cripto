# ============================================
# CryptoHub — Multi-stage Dockerfile for Railway
# ============================================

# Stage 1: Build the frontend (React + Vite)
FROM node:20-alpine AS client-build
WORKDIR /app/client
COPY client/package*.json ./
ENV NODE_ENV=development
RUN npm install --include=dev
COPY client/ ./
RUN npx vite build

# Stage 2: Build the backend (TypeScript)
FROM node:20-alpine AS server-build
WORKDIR /app/server
COPY server/package*.json ./
ENV NODE_ENV=development
RUN npm install --include=dev
COPY server/ ./
RUN npx tsc --project tsconfig.json
RUN mkdir -p dist/db && cp src/db/schema.sql dist/db/schema.sql

# Stage 3: Production image
FROM node:20-alpine AS production
WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

# Copy compiled server
COPY --from=server-build /app/server/dist ./dist

# Copy built frontend into server's public directory
COPY --from=client-build /app/client/dist ./public

EXPOSE ${PORT:-3001}

CMD ["node", "dist/index.js"]
