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

## Exploración del grafo — descarga de imagen (planeado 2026-07-13)

Hoy `GrafoExploracion.tsx` tiene un botón "Descargar imagen" que exporta directo
(PNG, con el panel "Explorando X" incluido, sin preguntar nada). Falta agregarle
control al usuario antes de descargar:

1. **Menú de ajustes al hacer click en "Descargar"**: en vez de descargar directo,
   abrir un panel/modal con las opciones de abajo y un botón final de confirmar
   descarga.
2. **Ajustes de la imagen**:
   - Formato: PNG, JPG, PDF, SVG (hoy solo genera PNG vía `cy.png()`). Cytoscape
     tiene `cy.jpg()` y `cy.svg()` (este último requiere el plugin
     `cytoscape-svg`, no instalado todavía). PDF probablemente signifique
     convertir el PNG/SVG resultante con alguna lib liviana (ej. `jspdf`), no hay
     soporte nativo en Cytoscape.
   - Toggle "incluir panel Explorando X" (hoy siempre se dibuja).
   - Toggle "incluir referencias/leyenda" (nodos/aristas — el mismo cuadro que ya
     se ve abajo a la izquierda en la vista interactiva, con los colores de
     Sociedad/Persona física/Escribano y los tipos de línea).
   - Color de fondo: el actual (`#efefef`, el mismo `bg-humo`) o transparente
     (relevante sobre todo para PNG/SVG; JPG no soporta transparencia real, ahí
     habría que forzar un color de fondo igual).
3. **Marca de agua**: agregar el isotipo "iNG" de la marca (ver
   `frontend/src/components/Logo.tsx` / `public/brand/`) en una esquina de la
   imagen exportada, sutil, no tapando el contenido del grafo.

Nada de esto es funcionalmente urgente — el botón actual ya cubre el caso de uso
básico (bajarse una imagen de la red que se está viendo).
