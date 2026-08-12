# Plan — Centralizar la baja de habeas data (que "oculta" se respete en todos lados)

Escrito el 2026-08-07. Nada implementado — este documento es para revisar
antes de tocar código. Responde a la pregunta: cuando un admin marca una
sociedad o persona como `oculta = true` desde el panel, ¿desaparece de
**todo** el sitio, o solo de su ficha?

## Resumen ejecutivo

**Sí, están hardcodeadas — y es un problema real, no solo teórico.**
Encontré una fuga de habeas data activa: los 12 informes de "nicho
sectorial" tienen nombre, CUIT, capital y socios de sociedades/personas
puntuales escritos a mano en archivos TypeScript versionados en git. Ese
contenido se sirve por **tres canales**, y ninguno de los tres consulta
la base de datos ni respeta `oculta`:

1. El bundle de React del frontend (lo que carga cualquier visitante).
2. HTML plano server-side para crawlers — **servido a cualquiera que pida
   la URL, no solo a bots**, confirmado leyendo `seo.ts`.
3. PDFs descargables generados con los mismos datos.

Si hoy alguien pide que lo saquen y vos apagás `oculta` en su ficha, su
nombre y CUIT siguen totalmente visibles en `/informes/nicho-cannabis`
(o el nicho que corresponda) por los tres canales. Esto no es un caso
límite raro: **de los 12 informes de nicho, todos** tienen esta
exposición (599 referencias a `sociedadId`, cientos a `personaId`, en
total).

La buena noticia: el resto del sitio (ficha individual, búsqueda, grafo,
sitemap, el informe de "departamentos activos") **ya está bien resuelto**,
con un patrón consistente y ya probado. El trabajo es llevar ese mismo
patrón a los informes de nicho — no inventar uno nuevo.

---

## 1. Cómo está resuelto HOY (lo que ya funciona, y por qué)

Un solo mecanismo, dos capas, aplicado con disciplina en casi todo el
sitio:

**Capa 1 — RLS a nivel de fila.** `sociedades` y `personas_fisicas` tienen
Row-Level Security (`007_rls.sql`): una fila con `oculta = true` es
literalmente invisible para el rol `boletin_api` (el que usa PostGraphile
y todo lo que lee datos públicos). No es un `WHERE` que alguien pueda
olvidarse de escribir — es una política a nivel de Postgres, así que
cualquier query nueva contra esas tablas hereda el filtro automáticamente.

**Capa 2 — todo lo que deriva de ahí, filtra explícitamente.** Donde el
dato no sale directo de `sociedades`/`personas_fisicas` (agregados,
vistas, sitemap), alguien ya escribió el `WHERE oculta = FALSE` a mano,
consistentemente:

| Superficie | Mecanismo | Estado |
|---|---|---|
| `/sociedad/:id`, `/persona/:id` | GraphQL vía `boletin_api` → RLS | ✅ Automático |
| Búsqueda | ídem | ✅ Automático |
| Grafo (`vw_grafo_aristas`, `grafo_de_sociedad`/`grafo_de_persona`) | La vista ya filtra `oculta=false` en su definición; las funciones son `LANGUAGE sql` sin `SECURITY DEFINER` (verificado: no hay ni un `SECURITY DEFINER` en todo el proyecto), así que heredan la RLS del rol que llama | ✅ |
| `sitemap-sociedades.xml` | `WHERE s.oculta = FALSE` explícito en la query (`seo.ts`) | ✅ |
| Informe "Departamentos más activos" | `recalcularDepartamentos()` en `informes.ts`: `JOIN sociedades s ON ... AND s.oculta = FALSE`, comentado explícitamente como "habeas data" | ✅ (con matiz, ver §2) |
| Informes "Mujeres Fundadoras", "Actividades CLAE", "Análisis de Redes" | Archivos estáticos igual que los de nicho, **pero sin `sociedadId`/`personaId`** — son agregados puros (confirmado por grep: 0 referencias en los tres) | ✅ Sin riesgo, por diseño |

**El problema está acotado**: es específicamente el grupo de 12 informes
de nicho, no "todos los informes" ni "todo el sitio".

## 2. Los tres canales de fuga, en detalle

### 2.1 — El bundle de React (menor, pero real)

`frontend/src/data/nichoCannabis.ts` (y sus 11 hermanos) exportan un
array `ENTIDADES` con objetos como:

```ts
{
  tipo: "S.A.S.", nombre: "Cannabafl S.A.S.", sociedadId: 6701,
  cuit: null, capital: "$60.000", publicacion: "19/05/2021",
  socios: [{ nombre: "Alejandro Daniel Romero Funar", personaId: 5335 }, ...],
  objetoSocial: "...",
}
```

Esto se compila directo al JS que baja cualquier visitante de
`/informes/nicho-cannabis`. Aunque el link a `/sociedad/6701` ya no
resuelva nada (por la RLS), el nombre/CUIT/capital/socios de esa fila
igual se ve en la página del informe.

### 2.2 — HTML server-side para SEO (el más grave)

`backend/src/seo.ts` importa esos mismos arrays y arma HTML plano:

```ts
function entidadHtml(e: EntidadCannabis): string {
  return `<h3>${e.tipo} — <a href="/sociedad/${e.sociedadId}">${e.nombre}</a></h3>
    <p>CUIT: ${e.cuit} · Capital: ${e.capital} · ...</p>
    <p>Socios/Integrantes: ${sociosLinks}</p> ...`;
}
```

Y ese HTML se inyecta en la respuesta del middleware de SEO — **sin
ningún chequeo de User-Agent ni de bot**, confirmado leyendo el router
completo. O sea: `curl https://ingcome.com.ar/informes/nicho-cannabis`
devuelve ese HTML con nombre y CUIT completos, para cualquiera, ahora
mismo, esté o no oculta la sociedad en la base. Es el canal más serio de
los tres porque además queda **indexado y cacheado por Google** — un
`oculta = true` de hoy no borra lo que el crawler ya guardó la semana
pasada, pero sí debería evitar que se lo siga sirviendo de acá en más.

### 2.3 — PDFs descargables (irreversible una vez descargado)

`frontend/src/lib/exportarInforme.tsx` + `frontend/src/components/pdf/
InformeNicho*PDF.tsx` generan un PDF client-side con `@react-pdf/renderer`
a partir de los mismos arrays hardcodeados. Un usuario que descargó el
PDF el mes pasado tiene un archivo con el nombre/CUIT de esa persona **en
su disco**, fuera de cualquier alcance nuestro. Esto no tiene arreglo
retroactivo posible — lo único que se puede controlar es que las
descargas **de acá en adelante** no incluyan lo que esté oculto. Vale la
pena decirlo así de directo para calibrar expectativas: la solución
técnica resuelve el futuro, no deshace lo ya descargado.

## 3. Qué falta para que sea real: los IDs son enlaces rotos que nunca se revisaron

Hay un problema previo, más chico pero relacionado: **nadie verificó si
los `sociedadId`/`personaId` de estos 12 archivos siguen apuntando a algo
que existe**. Los comentarios de `nichoCannabis.ts` dicen que el cruce se
hizo "a mano" en su momento. Si una sociedad fue reprocesada, fusionada,
o si algún id cambió, hoy el informe podría estar linkeando a un id
equivocado sin que nadie se entere — un problema de calidad de datos
independiente del habeas data, pero que la solución de abajo destapa
igual (si el id no existe o está oculto, con el fix ya no se muestra el
nombre, así que un id mal cargado simplemente desaparece de la vista en
vez de mostrar un link roto).

## 4. La solución: los datos ya viven en la base, hay que consultarla en vez de copiarla

**No hace falta un sistema nuevo de permisos.** El dato de identidad
(nombre, CUIT actualizado, si está oculta) ya vive en `sociedades` /
`personas_fisicas`. Lo que hoy está mal es que estos 12 informes
**copiaron ese dato una vez, a mano, a un archivo estático**, en vez de
consultarlo. La solución es dejar de copiarlo.

### Diseño propuesto

Los archivos `nicho*.ts` dejan de ser la fuente de la verdad para
nombre/CUIT/oculta — pasan a guardar **solo el `sociedadId`/`personaId`
y los datos que son del informe en sí** (por qué está en esa lista, la
categoría, cualquier nota curada a mano tipo `nombreGenerico`). El
nombre/CUIT/capital/oculta se resuelven en tiempo de request contra la
base, con la RLS de siempre haciendo el trabajo.

```ts
// ANTES (nichoCannabis.ts)
{ tipo: "S.A.S.", nombre: "Cannabafl S.A.S.", sociedadId: 6701, cuit: null,
  capital: "$60.000", publicacion: "19/05/2021", ... }

// DESPUÉS
{ tipo: "S.A.S.", sociedadId: 6701 }   // nombre/cuit/capital se resuelven solos
```

**Backend (`seo.ts` y el endpoint que alimente al frontend)**: en vez de
mapear el array estático directo a HTML, resuelve primero:

```sql
SELECT id, nombre, cuit, capital_inicial, ...
FROM sociedades
WHERE id = ANY($1) AND oculta = FALSE
```

Un `sociedadId` que apunta a una fila oculta (o borrada) simplemente
**no aparece** en el `Map` de resultados → se filtra de la lista antes de
renderizar, sin necesitar un caso especial. Esto resuelve los tres
canales a la vez, porque los tres (bundle de React, HTML de SEO, PDF) van
a consumir el mismo endpoint/resolución en vez de cada uno importar el
archivo estático por separado.

Esto también resuelve gratis el problema del §3: un id que ya no existe
o cambió, hoy generaría un link roto silencioso; con esto, simplemente no
se muestra — mismo criterio "no mostrar en vez de mostrar mal" que ya usa
el resto del sitio (ver el comentario de `post_procesar_excel.py`:
*"optamos por dejarlo sin informar antes que asignarle un valor que
podría ser incorrecto"*).

### Qué NO cambia

- El texto curado a mano de cada informe (introducción, metodología,
  gráficos de evolución anual, distribución por departamento/tipo) —
  eso es contenido editorial legítimo, no dato personal, se queda como
  está.
- Los 3 informes sin `sociedadId`/`personaId` (Mujeres Fundadoras,
  Actividades CLAE, Análisis de Redes) — no tienen este problema, no se
  tocan.
- El informe de Departamentos — ya filtra `oculta` correctamente.

## 5. Piezas concretas a construir

1. **Un resolver compartido**, en el backend, que reciba una lista de
   `{sociedadId?, personaId?}` y devuelva los datos vigentes de la base
   (nombre, CUIT, capital, fecha, oculta ya excluida por RLS). Un solo
   lugar, reusado por los 12 informes — no 12 queries copiadas y pegadas.
2. **Reescribir los 12 `data/nicho*.ts`**: sacarles nombre/cuit/capital/
   publicacion/departamento, dejar solo el id + lo curado a mano. Es
   mecánico pero hay que hacerlo con cuidado archivo por archivo (evitar
   romper qué fila es cuál).
3. **`seo.ts`**: las funciones `entidadHtml`-equivalentes (una por nicho)
   pasan a recibir el resultado ya resuelto contra la base, no el array
   crudo.
4. **Los 12 componentes `Informe*.tsx`** (frontend): hoy renderizan
   `ENTIDADES` directo; pasan a pedir la resolución (vía el mismo
   endpoint/query que usa `seo.ts`, expuesto por GraphQL o REST) antes de
   renderizar la tabla de entidades.
5. **Los 12 `Informe*PDF.tsx`**: mismo cambio — reciben la lista ya
   resuelta como prop en vez de importar el array estático.
6. **Revisión de datos (§3)**: correr la resolución una vez contra todos
   los ids de los 12 archivos y loguear cuáles no matchean nada — para
   detectar (y corregir a mano) los ids que ya estaban rotos antes de
   este cambio, no solo prevenir los futuros.

## 6. Lo que decidiste que NO se toca (para que quede explícito)

- No se propone un sistema de permisos/roles nuevo — la RLS existente
  alcanza, el problema era que estos 12 informes no pasaban por ella.
- No se propone borrar contenido editorial de los informes, solo dejar
  de hardcodear la parte que es dato personal identificable.
- No hay forma de resolver retroactivamente los PDFs ya descargados
  (§2.3) — se documenta como limitación conocida, no como pendiente.

## 7. Orden sugerido

| Paso | Qué | Por qué |
|---|---|---|
| 1 | Resolver compartido (backend) + correr la auditoría de ids rotos (§5.6) | No visible, no rompe nada, y de paso valida que el enfoque funciona con los ids reales |
| 2 | `seo.ts` — el canal más grave (servido a cualquiera, indexado por Google) | Cierra la fuga más urgente primero |
| 3 | Los 12 `Informe*.tsx` (frontend) | Mismo mecanismo que el paso 2, ya probado |
| 4 | Los 12 `Informe*PDF.tsx` | Último porque depende de que los datos ya vengan resueltos desde donde sea que se dispare la exportación |
| 5 | Reescribir los 12 `data/nicho*.ts` para sacar los campos que ya no se usan | Limpieza final, una vez que nada los lee más |

¿Seguimos por acá, o preferís que ajuste el alcance de alguna parte antes
de que arranque a implementar?
