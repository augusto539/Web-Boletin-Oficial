# Backend

API de INGcome: PostGraphile (GraphQL, solo lectura) + Express (auth, admin, leads, SEO).

## Stack

- **Express** como servidor HTTP, monta PostGraphile y las rutas REST propias.
- **PostGraphile v4** expone el schema de Postgres como GraphQL, respetando GRANTs y RLS reales (`ignoreRBAC: false`). Mutaciones automáticas desactivadas: la carga de datos la hace un pipeline externo directo contra Postgres, no esta API.
- **pg** para las conexiones directas usadas por auth/admin/leads/SEO (fuera de PostGraphile).
- **jsonwebtoken** + **bcryptjs** para el sistema de autenticación.
- **Resend** para mail transaccional (bienvenida, reset de contraseña).

## Estructura

```
src/
  server.ts   # arma Express, monta PostGraphile y los routers, sirve el build del frontend en prod
  auth.ts     # registro/login/refresh/logout/me + olvidé/restablecer contraseña
  admin.ts    # estadísticas y listados paginados (solo admin=true)
  leads.ts    # alta de mail para el lead magnet de la landing
  seo.ts      # inyección de title/meta/JSON-LD por sociedad/persona + robots.txt/sitemap
  mail.ts     # envío de mails vía Resend (nunca lanza: un mail caído no rompe el flujo)
```

## Roles de base de datos

El backend usa tres roles Postgres distintos según qué endpoint conecta, cada uno con permisos mínimos:

| Rol | Usado por | Permisos |
|---|---|---|
| `boletin_admin` | migraciones, `ownerConnectionString` de PostGraphile (watch mode) | owner completo |
| `boletin_api` | PostGraphile (todas las queries GraphQL) | solo lectura, RLS filtra filas con `oculta = true` |
| `boletin_auth` | `auth.ts`, `admin.ts`, `leads.ts` | lectura/escritura solo sobre `usuarios`, `sesiones`, `resets_contrasena`, `leads_informe` |

## Autenticación

JWT de acceso (15 min) + refresh token (30 días) con rotación y detección de reuso: si un refresh token ya usado/revocado se reutiliza, se revocan todas las sesiones activas del usuario. Ambos tokens viajan en cookies `httpOnly` (`access_token` en `/`, `refresh_token` en `/api/auth`), nunca en el body ni en localStorage.

Endpoints (`/api/auth`):

- `POST /registro` — crea usuario, manda mail de bienvenida.
- `POST /login`
- `POST /refresh` — rota el refresh token.
- `POST /logout`
- `GET /me`
- `POST /olvide-contrasena` — genera un token de reset y manda el mail (si el mail no existe, responde igual para no filtrar qué mails están registrados).
- `POST /restablecer-contrasena`

`/api/admin/*` requiere sesión con `admin = true` (middleware `requireAdmin`). `/api/leads` es público (solo valida formato de mail).

## SEO

`seo.ts` intercepta `GET /sociedad/:id` y `GET /persona/:id` antes del catch-all de la SPA, e inyecta `<title>`, meta description, canonical, Open Graph y JSON-LD sobre el mismo `index.html` del build de Vite (sin SSR real: React pisa ese contenido al montar). Devuelve 404 real si el id no existe. Las páginas de persona siempre llevan `noindex` (dato personal, no corresponde indexarlas). También sirve `robots.txt`, `sitemap.xml` y `sitemap-sociedades.xml` de forma dinámica contra la base.

## Variables de entorno

Ver `.env.example` en la raíz del repo. Requeridas para levantar el backend: `DATABASE_URL`, `DATABASE_URL_API`, `DATABASE_URL_AUTH`, `JWT_SECRET`, `PORT`, `CORS_ORIGIN`, `SITE_URL`. `RESEND_API_KEY` puede quedar vacía en desarrollo (los mails simplemente no se envían, sin romper el flujo).

## Desarrollo

```bash
npm run dev --workspace backend   # tsx watch, recarga en cada cambio
npm run build --workspace backend # compila a dist/ con tsc
npm run start --workspace backend # corre el build compilado
```

GraphiQL disponible en `http://localhost:5050/graphiql` mientras el backend está levantado.
