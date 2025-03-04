# Frontend
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/pnpm-lock.yaml ./
COPY frontend/package.json ./
RUN npm install -g pnpm && pnpm install
COPY frontend/ .
RUN pnpm run build

# Backend
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/pnpm-lock.yaml ./
COPY backend/package.json ./
RUN npm install -g pnpm && pnpm install
COPY backend/ .

# Final stage (serveur Fastify + frontend buildé)
EXPOSE 3000
CMD ["node", "server.js"]
