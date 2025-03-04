# Utiliser une image de base avec pnpm
FROM node:20-alpine AS base
RUN npm install -g pnpm

# Backend
FROM base AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./
# Installer les dépendances du projet
RUN pnpm install --frozen-lockfile
# Ajouter le répertoire des binaires de pnpm au PATH
ENV PATH="/app/backend/node_modules/.bin:${PATH}"
COPY backend/ .
RUN pnpm prisma generate
# Compiler TypeScript en JavaScript
RUN pnpm build

# Frontend
FROM base AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend/ .
RUN pnpm build

# Image finale
FROM base AS production
WORKDIR /app

# Copier les fichiers du backend
COPY --from=backend-build /app/backend/index.js ./backend/
COPY --from=backend-build /app/backend/prisma ./backend/prisma
COPY --from=backend-build /app/backend/package.json ./backend/
COPY --from=backend-build /app/backend/pnpm-lock.yaml ./backend/

# Copier les fichiers du frontend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3000

# Installer uniquement les dépendances de production
RUN cd backend && pnpm install --prod --frozen-lockfile

# Exposition du port
EXPOSE 3000

# Commande de démarrage
CMD ["node", "backend/index.js"]
