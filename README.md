# INGcome Consultora

Buscador y explorador de sociedades comerciales y personas físicas del Boletín Oficial de Mendoza, Argentina. Permite buscar sociedades y personas, ver su ficha completa (autoridades, socios, actos, boletines de origen) y navegar el grafo de vínculos societarios entre ellas.

Los datos (sociedades, personas, vínculos, actos, boletines) los carga un pipeline externo (Python) directo contra Postgres. Esta aplicación es de solo lectura sobre esos datos, salvo por cuentas de usuario, notificaciones y leads, que sí gestiona.

## Estructura del monorepo

```
db/         # esquema Postgres: migraciones SQL, roles, RLS, funciones de búsqueda/grafo
backend/    # ver backend/README.md — PostGraphile (GraphQL) + Express (auth, admin, leads, SEO)
frontend/   # ver frontend/README.md — SPA React + Vite
docs/       # notas de trabajo pendiente
```

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

## Stack

PostgreSQL 16 · PostGraphile 4 (GraphQL) · Express · React 19 + TypeScript + Vite · Tailwind CSS v4 · Apollo Client · Cytoscape.js · Docker Compose.

## Levantar el proyecto en desarrollo

Requiere Docker y Node 22+.

```bash
cp .env.example .env   # completar valores si hace falta (los defaults sirven para desarrollo local)
npm install
docker compose up -d   # Postgres + pgAdmin (los servicios backend/frontend de docker-compose son opcionales, ver abajo)

npm run migrate         # corre las migraciones de db/migrations contra Postgres
npm run seed             # opcional: carga datos de prueba (para desarrollo sin el pipeline real)

npm run dev:backend      # backend en http://localhost:5050 (GraphiQL en /graphiql)
npm run dev:front        # frontend en http://localhost:5173
```

Alternativamente, `docker compose up -d` con todos los servicios (postgres, backend, frontend, pgadmin) levanta todo el stack en contenedores, con hot-reload vía bind mount — no hace falta `npm install` en el host en ese caso.

pgAdmin queda disponible en `http://localhost:5080` para inspeccionar la base directamente.

## Roles de base de datos

El esquema usa tres roles Postgres con permisos separados por función (owner de migraciones, lectura pública vía RLS, lectura/escritura de auth). Están documentados en detalle en [backend/README.md](backend/README.md#roles-de-base-de-datos).

## Variables de entorno

Ver `.env.example` en la raíz — es la fuente de verdad de qué variables existen y para qué sirve cada una.
