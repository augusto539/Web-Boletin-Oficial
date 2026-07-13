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

## Página de informes (planeado 2026-07-13)

Nueva sección `/informes`. Punto de partida: tres ideas del usuario que en
realidad no compiten entre sí, cada una cumple un rol distinto:

1. Informes descargables en PDF sobre un período (último año/trimestre, desde
   que hay datos) o estudios puntuales (edad promedio al ingresar a una
   sociedad, clusters, sociedad con más socios, etc).
2. Página de métricas en tiempo real con data de la base.
3. Los mismos informes del punto 1 pero como página HTML, no solo PDF.

**Decisión: HTML-first, PDF como complemento.** Un PDF solo (sin versión HTML)
es casi un callejón sin salida para SEO — Google lo indexa peor, no hay
linkeo interno, no retiene al visitante, es un dolor actualizar. La ventaja
real acá es que estos datos de Mendoza no los tiene nadie más estructurados;
eso solo rinde en SEO si es HTML rastreable (URLs tipo "sociedades
constituidas en Mendoza en 2025"). Entonces: cada informe es una página HTML
completa, y el PDF (ya tenemos `@react-pdf/renderer` armado de la feature de
descarga de fichas) es un botón de descarga *dentro* de esa página, no el
formato principal.

**"Tiempo real" (punto 2) es producto, no SEO.** Nadie busca "dashboard en
vivo", y contenido que cambia constantemente no le da a Google un snapshot
estable para rankear. Sirve como feature de la home o de una página aparte
tipo `/estadisticas` para el "wow" y la retención, pero no reemplaza a los
informes HTML. Mejor una cadencia "actualizado mensualmente" con fecha
visible: fresco pero estable.

**Estructura propuesta:**

```
/informes                          ← hub / pillar page (índice de todo)
├── Informes periódicos             ← workhorse de SEO, se regeneran solos
│   ├── /informes/anuario-2025
│   ├── /informes/2025-q1
│   └── ...
├── Estudios evergreen              ← imán de curiosidad + backlinks
│   ├── /informes/edad-promedio-ingreso-sociedades
│   ├── /informes/sociedades-con-mas-socios
│   ├── /informes/departamentos-mas-activos
│   └── ...
└── Métricas en vivo → widget aparte (home o /estadisticas), no cuenta como SEO
```

**Ángulo estratégico:** esta sección puede funcionar como motor de backlinks
— los datos son atractivos para prensa local ("Según INGcome, en Mendoza se
crearon X sociedades en 2025..."), que es lo que más mueve la aguja en SEO.
Pensar los informes también como herramienta de PR, no solo de contenido.

**Restricciones a resolver desde el diseño, no después:**

- **Precomputar, no calcular por request.** Job programado que escribe a una
  tabla de agregados/materialized view — estas queries son pesadas y las
  páginas SEO se crawlean seguido.
- **Cuidado legal con rankings de personas.** Un ranking nominal tipo
  "persona con más sociedades" choca con la Ley 25.326 (habeas data) y con
  `EMAIL_BAJA_DATOS`/el compromiso de baja de datos ya armado. Sociedades
  públicas → OK. Estadísticas agregadas sobre personas (edad promedio,
  distribuciones) → OK. Rankings nominales de personas → evitar o anonimizar.
  Respetar `oculta=true` en todo agregado (excluir sociedades/personas dadas
  de baja de los cálculos).
- URLs en español, keyword-rich, JSON-LD, entrada en el sitemap, fecha de
  "actualizado el" visible en cada informe.

**Próximo paso sugerido:** no arrancar por todo. Un solo estudio evergreen
bandera (candidato: "departamentos más activos" o "evolución de
constituciones por año", los de titular más fuerte) + la plantilla del
anuario anual, para validar el pipeline completo (precómputo → tabla →
página HTML → botón PDF) antes de escalar a más informes.
