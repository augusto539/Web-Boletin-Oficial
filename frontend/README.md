# Frontend

SPA de INGcome: React 19 + TypeScript + Vite, consumiendo la API GraphQL del [backend](../backend).

## Stack

- **Vite** + **React 19** + **TypeScript**.
- **Tailwind CSS v4** con los tokens de marca de INGcome.
- **Apollo Client** para las queries GraphQL contra PostGraphile.
- **React Router v7** para el ruteo client-side.
- **Cytoscape.js** para la visualización interactiva de los grafos de vínculos societarios.
- **Framer Motion** + **Lenis** para animaciones y scroll suave.

## Estructura

```
src/
  pages/       # una por ruta (Landing, Sociedad, Persona, BusquedaAvanzada, Admin, Login, Registro, ...)
  components/  # piezas reusables (Nav, Footer, SearchBox, GrafoSociedad, GrafoPersona, RutaAdmin, ...)
  lib/
    queries.ts   # queries/mutations GraphQL (Apollo)
    adminApi.ts  # llamadas REST a /api/admin
    auth.tsx     # AuthProvider + hook useAuth (sesión vía cookies httpOnly)
    format.ts    # formatCuit, enlaceBoletin y demás helpers de presentación
    constantes.ts
    scroll.ts    # instancia compartida de Lenis
```

## Rutas

| Ruta | Página |
|---|---|
| `/` | Landing |
| `/sociedad/:id` | Ficha de sociedad + grafo de vínculos |
| `/persona/:id` | Ficha de persona física + grafo de sociedades de las que es socia |
| `/busqueda-avanzada` | Búsqueda avanzada (sociedades y personas, con filtros) |
| `/login`, `/registro` | Autenticación |
| `/olvide-contrasena`, `/restablecer-contrasena` | Reset de contraseña |
| `/notificaciones` | Notificaciones activas del usuario |
| `/admin` | Panel admin (protegido, requiere `admin = true`) |
| `/terminos`, `/privacidad` | Legales |

## Autenticación

La sesión vive en cookies `httpOnly` que pone el backend (no hay tokens en `localStorage`). `AuthProvider` (`lib/auth.tsx`) llama a `/api/auth/me` al montar para saber si hay sesión activa, y expone el estado a toda la app. `RutaAdmin` es un guard que redirige si el usuario no es admin.

## SEO

Las páginas de sociedad/persona no dependen de SSR: el [backend](../backend) inyecta `<title>`/meta/JSON-LD en el mismo `index.html` antes de servirlo (ver `backend/src/seo.ts`), y React monta normalmente arriba de ese contenido. En desarrollo (`vite dev`, puerto 5173) no hay inyección — eso solo corre sobre el build servido por Express.

## Variables de entorno

- `VITE_API_URL` — URL del backend (default `http://localhost:5050`), usada para las llamadas REST fuera de Apollo (ej. `/api/leads`).

## Desarrollo

```bash
npm run dev --workspace frontend      # Vite dev server en :5173
npm run build --workspace frontend    # tsc -b && vite build -> dist/
npm run preview --workspace frontend  # sirve el build localmente
npm run lint --workspace frontend     # oxlint
```

En desarrollo normal, el frontend corre aparte del backend (puertos 5173 y 5050) con CORS habilitado. El `dist/` generado por `build` es el que Express sirve en producción (ver [backend/README.md](../backend/README.md)).
