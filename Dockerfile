# Imagen única de producción: compila frontend (Vite) y backend (tsc), y en
# runtime un solo proceso Node sirve la API (PostGraphile + Express) y el
# build estático del frontend (server.ts ya tiene el static+SPA fallback,
# ver backend/src/server.ts) — no hace falta un contenedor de frontend aparte.

# --- deps: instala node_modules de todo el workspace, cacheable mientras no
# cambien los package.json/lockfile (no se invalida por cambios de código). ---
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY frontend/package.json frontend/package.json
COPY db/package.json db/package.json
RUN npm ci

# --- build: compila backend (tsc) y frontend (tsc -b && vite build). ---
FROM deps AS build
COPY backend ./backend
COPY frontend ./frontend
COPY db ./db

# Vite incrusta las variables VITE_* en el JS en tiempo de build, no de
# arranque — por eso van acá como ARG y no en docker-compose.prod.yml.
# API_URL/GRAPHQL_URL quedan relativos a propósito: en este deploy el mismo
# contenedor sirve la API y el frontend en el mismo origen (ver server.ts),
# así que no hace falta (ni conviene) hardcodear un host.
ARG VITE_GA_ID=
ENV VITE_API_URL="" \
    VITE_GRAPHQL_URL="/graphql" \
    VITE_GA_ID=${VITE_GA_ID}

RUN npm run build --workspace backend \
 && npm run build --workspace frontend

# --- runtime: solo lo necesario para correr, usuario no-root. ---
FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app

COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json ./
COPY backend/package.json backend/package.json
COPY --from=build /app/backend/dist backend/dist
COPY --from=build /app/frontend/dist frontend/dist
# db/ no se compila (migrate.ts/seed.ts corren con tsx directo, igual que en
# dev): se copia el código fuente + las migraciones tal cual.
COPY db db

USER app
EXPOSE 5050
CMD ["node", "backend/dist/server.js"]
