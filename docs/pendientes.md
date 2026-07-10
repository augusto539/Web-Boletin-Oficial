# Pendientes

Cosas que quedaron afuera del alcance de alguna feature a propósito, para no perderlas.

## Auth (login/registro con JWT — planeado 2026-07-09)

- **Reemplazar el mail mock de Notificaciones**: `frontend/src/pages/Notificaciones.tsx`
  usa `EMAIL_CUENTA = "vos@tu-mail.com"` hardcodeado. Una vez que el login esté andando,
  reemplazar por el mail del usuario logueado (via `useAuth()`/contexto de sesión) y
  requerir estar logueado para entrar a la página.
- **Recuperar contraseña**: flujo de "olvidé mi contraseña" (pedir mail → token de un
  solo uso → link por mail → nueva contraseña). Requiere resolver antes el envío de
  mails, que hoy no existe en el proyecto (nada manda mail todavía, ni las
  notificaciones de sociedades/personas).
- Relacionado: cuando exista envío de mails, también sirve para el job real de
  Notificaciones (avisar por mail cuando una sociedad/persona aparece en un boletín
  nuevo) — hoy esa parte es honestamente solo UI, sin backend (ver
  `Notificaciones.tsx`).

## Admin (estadísticas/datos — planeado 2026-07-09)

- **"Notificaciones activas" en `/admin` es un mock**: `backend/src/admin.ts`
  (`GET /api/admin/estadisticas`) devuelve `notificacionesActivas = 100` fijo, porque
  no hay tabla de notificaciones en la base todavía (ver el ítem de arriba). El día
  que se construya esa tabla, reemplazar ese número fijo por un
  `SELECT count(*) FROM notificaciones WHERE activa = true` (o como se llame).
