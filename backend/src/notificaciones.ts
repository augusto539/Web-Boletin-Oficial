import crypto from "node:crypto";
import { type Request, type Response, Router } from "express";
import { asyncHandler } from "./asyncHandler.js";
import { pool, requireUsuario } from "./auth.js";
import { enviarNotificacionActualizaciones, type NovedadNotificacion } from "./mail.js";

// Seguimiento de sociedades/personas: el usuario marca qué quiere vigilar
// (botón "Notificarme" en cada ficha, o la página /notificaciones para un
// CUIT/DNI que todavía no tiene ficha), y cuando el job diario carga
// boletines nuevos le pega a POST /procesar de acá abajo. Este módulo cruza
// lo cargado contra las suscripciones y manda UN mail resumen por usuario.
//
// El disparo es por webhook y no por polling a propósito: el job diario ya
// sabe exactamente qué boletines cargó, así que avisa en vez de que el
// backend ande preguntando. El cron de respaldo en server.ts existe solo
// para el caso de que ese POST se pierda (backend reiniciándose justo en ese
// momento).
//
// Tope de suscripciones por usuario: sin esto una cuenta podría vigilar la
// base entera y convertir cada corrida del job en un mail gigante.
const MAX_SUSCRIPCIONES = 50;

// Distinta de la 727001 que usa cargar_incremental.py (repo job-diario):
// son locks sobre la misma base, no se pueden pisar.
const LOCK_KEY = 727002;

// Cuánto para atrás mira el cron de respaldo. La ventana evita dos
// problemas de un saque: que el primer deploy barra los ~800 boletines
// históricos, y que un envío fallido quede perdido (se reintenta mientras
// esté dentro de la ventana). Re-procesar es inofensivo: la deduplicación
// real la da el UNIQUE de notificaciones_enviadas.
const DIAS_VENTANA_RESPALDO = 7;

// ---------------------------------------------------------------------------
// Worker
// ---------------------------------------------------------------------------

interface CoincidenciaRow {
  suscripcion_id: string;
  usuario_id: string;
  usuario_mail: string;
  usuario_nombre: string;
  boletin_id: number;
  acto_id: string;
  tipo_entidad: "sociedad" | "persona";
  entidad_id: string;
  entidad_nombre: string;
  acto: string;
  fecha_acto: string | null;
  descripcion: string | null;
  escribano: string | null;
  registro_notarial: string | null;
  id_pdf: string | null;
}

// Las suscripciones por documento apuntan a entidades que todavía no
// existían al crearlas. Cuando la entidad aparece, se las re-apunta al id
// real para que los actos siguientes también avisen (y para poder mostrar el
// nombre de verdad en la UI). Acotado a las entidades tocadas por estos
// boletines: un barrido global sería innecesariamente caro.
async function autoVincularPorDocumento(boletinIds: number[]): Promise<number> {
  const { rowCount: soc } = await pool().query(
    `UPDATE suscripciones_notificacion s
        SET sociedad_id = e.id, documento = NULL
       FROM (
         SELECT DISTINCT soc.id, soc.cuit
           FROM actos a
           JOIN sociedades soc ON soc.id = a.sociedad_id
          WHERE a.boletin_id = ANY($1) AND soc.cuit IS NOT NULL
       ) e
      WHERE s.activa AND s.documento IS NOT NULL AND s.documento = e.cuit
        -- No pisar una suscripción que el usuario ya tenga por id.
        AND NOT EXISTS (
          SELECT 1 FROM suscripciones_notificacion o
           WHERE o.usuario_id = s.usuario_id AND o.sociedad_id = e.id
        )`,
    [boletinIds],
  );

  const { rowCount: per } = await pool().query(
    `UPDATE suscripciones_notificacion s
        SET persona_id = e.id, documento = NULL
       FROM (
         SELECT DISTINCT p.id, p.cuit, p.documento
           FROM actos a
           JOIN vinculos v ON v.acto_alta_id = a.id
           JOIN personas_fisicas p ON p.id = v.persona_id
          WHERE a.boletin_id = ANY($1)
       ) e
      WHERE s.activa AND s.documento IS NOT NULL
        AND (s.documento = e.cuit OR s.documento = e.documento)
        AND NOT EXISTS (
          SELECT 1 FROM suscripciones_notificacion o
           WHERE o.usuario_id = s.usuario_id AND o.persona_id = e.id
        )`,
    [boletinIds],
  );

  return (soc ?? 0) + (per ?? 0);
}

// Sociedades: cualquier acto del boletín sobre la sociedad vigilada.
// Personas: los actos donde la persona entra como vínculo nuevo (socio,
// autoridad, apoderado) o interviene como escribano.
async function buscarCoincidencias(boletinIds: number[]): Promise<CoincidenciaRow[]> {
  const { rows } = await pool().query<CoincidenciaRow>(
    `WITH actos_corrida AS (
       SELECT a.id, a.sociedad_id, a.boletin_id, a.fecha_acto, a.descripcion,
              a.escribano_id, a.registro_notarial, ta.nombre AS acto, b.id_pdf
         FROM actos a
         JOIN tipos_acto ta ON ta.id = a.tipo_acto_id
         JOIN boletines  b  ON b.id  = a.boletin_id
        WHERE a.boletin_id = ANY($1)
     ),
     -- Una fila por (suscripción, acto). El DISTINCT importa en el caso
     -- persona: alguien puede entrar al mismo acto con más de un rol
     -- (p.ej. "Socio" y "Gerente Titular"), y eso es un solo aviso.
     crudas AS (
       SELECT s.id AS suscripcion_id, ac.id AS acto_id, ac.boletin_id,
              'sociedad'::text AS tipo_entidad, soc.id AS entidad_id, soc.nombre AS entidad_nombre
         FROM suscripciones_notificacion s
         JOIN actos_corrida ac ON ac.sociedad_id = s.sociedad_id
         JOIN sociedades soc   ON soc.id = s.sociedad_id
        WHERE s.activa AND s.sociedad_id IS NOT NULL AND NOT soc.oculta

       UNION

       SELECT s.id, ac.id, ac.boletin_id,
              'persona', p.id, p.nombre
         FROM suscripciones_notificacion s
         JOIN vinculos v       ON v.persona_id = s.persona_id
         JOIN actos_corrida ac ON ac.id = v.acto_alta_id
         JOIN personas_fisicas p ON p.id = s.persona_id
        WHERE s.activa AND s.persona_id IS NOT NULL AND NOT p.oculta

       UNION

       SELECT s.id, ac.id, ac.boletin_id,
              'persona', p.id, p.nombre
         FROM suscripciones_notificacion s
         JOIN actos_corrida ac ON ac.escribano_id = s.persona_id
         JOIN personas_fisicas p ON p.id = s.persona_id
        WHERE s.activa AND s.persona_id IS NOT NULL AND NOT p.oculta
     )
     SELECT c.suscripcion_id::text, c.acto_id::text, c.boletin_id,
            c.tipo_entidad, c.entidad_id::text, c.entidad_nombre,
            u.id::text AS usuario_id, u.mail AS usuario_mail, u.nombre AS usuario_nombre,
            ac.acto, ac.fecha_acto::text, ac.descripcion, ac.registro_notarial, ac.id_pdf,
            esc.nombre AS escribano
       FROM crudas c
       JOIN suscripciones_notificacion s ON s.id = c.suscripcion_id
       JOIN usuarios u        ON u.id = s.usuario_id
       JOIN actos_corrida ac  ON ac.id = c.acto_id
       LEFT JOIN personas_fisicas esc ON esc.id = ac.escribano_id
       -- Lo ya avisado no se repite: esto es lo que hace idempotente al
       -- worker frente a reintentos, al cron de respaldo y al botón de admin.
       LEFT JOIN notificaciones_enviadas ne
              ON ne.suscripcion_id = c.suscripcion_id AND ne.acto_id = c.acto_id
      WHERE ne.id IS NULL
      ORDER BY u.id, c.entidad_nombre, ac.fecha_acto`,
    [boletinIds],
  );
  return rows;
}

// Los vínculos que creó cada acto: los socios de una constitución, las
// autoridades de una designación. Se traen todos juntos y se agrupan en
// memoria para no hacer una query por acto.
async function participantesPorActo(
  actoIds: string[],
): Promise<Map<string, { rol: string; nombre: string }[]>> {
  const mapa = new Map<string, { rol: string; nombre: string }[]>();
  if (actoIds.length === 0) return mapa;

  const { rows } = await pool().query<{ acto_id: string; rol: string; nombre: string }>(
    `SELECT v.acto_alta_id::text AS acto_id, r.nombre AS rol,
            COALESCE(p.nombre, soc.nombre, v.nombre_juridico_fallback) AS nombre
       FROM vinculos v
       JOIN roles r ON r.id = v.rol_id
       LEFT JOIN personas_fisicas p ON p.id = v.persona_id AND NOT p.oculta
       LEFT JOIN sociedades soc     ON soc.id = v.sociedad_miembro_id AND NOT soc.oculta
      WHERE v.acto_alta_id = ANY($1::bigint[])
        AND COALESCE(p.nombre, soc.nombre, v.nombre_juridico_fallback) IS NOT NULL
      ORDER BY v.id`,
    [actoIds],
  );

  for (const r of rows) {
    const lista = mapa.get(r.acto_id) ?? [];
    lista.push({ rol: r.rol, nombre: r.nombre });
    mapa.set(r.acto_id, lista);
  }
  return mapa;
}

export interface ResultadoProceso {
  boletines: number;
  coincidencias: number;
  usuariosNotificados: number;
  autovinculadas: number;
}

/**
 * Cruza los boletines indicados contra las suscripciones activas y manda un
 * mail resumen por usuario. Idempotente: se puede llamar dos veces con los
 * mismos boletines sin que nadie reciba el aviso repetido.
 *
 * @param idsPdf `boletines.id_pdf` de los boletines a mirar. Si viene vacío,
 *   se usa la ventana de respaldo (últimos DIAS_VENTANA_RESPALDO días).
 */
export async function procesarNotificaciones(idsPdf?: string[]): Promise<ResultadoProceso> {
  const vacio: ResultadoProceso = {
    boletines: 0,
    coincidencias: 0,
    usuariosNotificados: 0,
    autovinculadas: 0,
  };

  // Dos corridas solapadas (el POST del job y el cron de respaldo cayendo
  // juntos) mandarían el mail dos veces: entre el SELECT de coincidencias y
  // el INSERT en notificaciones_enviadas hay una ventana de carrera que el
  // UNIQUE por sí solo no cubre.
  const { rows: lock } = await pool().query<{ ok: boolean }>(
    "SELECT pg_try_advisory_lock($1) AS ok",
    [LOCK_KEY],
  );
  if (!lock[0].ok) {
    console.warn("[notificaciones] otra corrida en curso, se saltea esta.");
    return vacio;
  }

  try {
    const { rows: boletines } = idsPdf?.length
      ? await pool().query<{ id: number }>(
          "SELECT id FROM boletines WHERE id_pdf = ANY($1)",
          [idsPdf],
        )
      : await pool().query<{ id: number }>(
          `SELECT id FROM boletines WHERE created_at > now() - ($1 || ' days')::interval`,
          [DIAS_VENTANA_RESPALDO],
        );

    if (boletines.length === 0) return vacio;
    const boletinIds = boletines.map((b) => b.id);

    const autovinculadas = await autoVincularPorDocumento(boletinIds);
    const coincidencias = await buscarCoincidencias(boletinIds);
    if (coincidencias.length === 0) {
      // Se loguea igual: el caso normal es no tener nada para avisar, y sin
      // esta línea no habría forma de distinguir "corrió y no había nada" de
      // "no corrió" al mirar los logs.
      console.log(
        `[notificaciones] ${boletinIds.length} boletín(es), sin novedades para avisar ` +
          `(${autovinculadas} suscripción(es) auto-vinculada(s)).`,
      );
      return { ...vacio, boletines: boletinIds.length, autovinculadas };
    }

    const participantes = await participantesPorActo(coincidencias.map((c) => c.acto_id));

    // Un mail por usuario, con todas sus entidades.
    const porUsuario = new Map<string, CoincidenciaRow[]>();
    for (const c of coincidencias) {
      const lista = porUsuario.get(c.usuario_id) ?? [];
      lista.push(c);
      porUsuario.set(c.usuario_id, lista);
    }

    let usuariosNotificados = 0;
    for (const filas of porUsuario.values()) {
      const novedades: NovedadNotificacion[] = filas.map((f) => ({
        tipoEntidad: f.tipo_entidad,
        entidadId: f.entidad_id,
        entidadNombre: f.entidad_nombre,
        acto: f.acto,
        fechaActo: f.fecha_acto,
        descripcion: f.descripcion,
        participantes: participantes.get(f.acto_id) ?? [],
        escribano: f.escribano,
        registroNotarial: f.registro_notarial,
        idPdf: f.id_pdf,
      }));

      const enviado = await enviarNotificacionActualizaciones(
        { mail: filas[0].usuario_mail, nombre: filas[0].usuario_nombre },
        novedades,
      );
      // Solo se registra si el mail salió: si Resend falló, la próxima
      // corrida lo reintenta en vez de darlo por avisado.
      if (!enviado) continue;
      usuariosNotificados++;

      await pool().query(
        `INSERT INTO notificaciones_enviadas (suscripcion_id, boletin_id, acto_id)
         SELECT * FROM unnest($1::bigint[], $2::int[], $3::bigint[])
         ON CONFLICT (suscripcion_id, acto_id) DO NOTHING`,
        [
          filas.map((f) => f.suscripcion_id),
          filas.map((f) => f.boletin_id),
          filas.map((f) => f.acto_id),
        ],
      );
    }

    console.log(
      `[notificaciones] ${boletinIds.length} boletín(es), ${coincidencias.length} coincidencia(s), ` +
        `${usuariosNotificados} usuario(s) notificado(s), ${autovinculadas} suscripción(es) auto-vinculada(s).`,
    );
    return {
      boletines: boletinIds.length,
      coincidencias: coincidencias.length,
      usuariosNotificados,
      autovinculadas,
    };
  } finally {
    await pool().query("SELECT pg_advisory_unlock($1)", [LOCK_KEY]);
  }
}

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const notificacionesRouter = Router();

interface SuscripcionRow {
  id: string;
  tipo: "sociedad" | "persona" | "documento";
  entidad_id: string | null;
  nombre: string | null;
  cuit: string | null;
  creada_el: string;
}

notificacionesRouter.get(
  "/",
  requireUsuario(),
  asyncHandler(async (req: Request, res: Response) => {
    const { rows } = await pool().query<SuscripcionRow>(
      `SELECT s.id::text,
              CASE WHEN s.sociedad_id IS NOT NULL THEN 'sociedad'
                   WHEN s.persona_id  IS NOT NULL THEN 'persona'
                   ELSE 'documento' END AS tipo,
              COALESCE(s.sociedad_id, s.persona_id)::text AS entidad_id,
              COALESCE(soc.nombre, p.nombre, s.etiqueta)   AS nombre,
              COALESCE(soc.cuit, p.cuit, s.documento)      AS cuit,
              s.creada_el::text
         FROM suscripciones_notificacion s
         LEFT JOIN sociedades       soc ON soc.id = s.sociedad_id
         LEFT JOIN personas_fisicas p   ON p.id   = s.persona_id
        WHERE s.usuario_id = $1 AND s.activa
        ORDER BY s.creada_el DESC`,
      [req.usuario!.id],
    );
    return res.json(rows);
  }),
);

notificacionesRouter.post(
  "/",
  requireUsuario(),
  asyncHandler(async (req: Request, res: Response) => {
    const tipo = typeof req.body?.tipo === "string" ? req.body.tipo : "";
    if (!["sociedad", "persona", "documento"].includes(tipo)) {
      return res.status(400).json({ error: "Tipo de notificación inválido." });
    }

    const { rows: cuenta } = await pool().query<{ n: string }>(
      "SELECT count(*) AS n FROM suscripciones_notificacion WHERE usuario_id = $1 AND activa",
      [req.usuario!.id],
    );
    if (Number(cuenta[0].n) >= MAX_SUSCRIPCIONES) {
      return res
        .status(400)
        .json({ error: `Llegaste al máximo de ${MAX_SUSCRIPCIONES} notificaciones activas.` });
    }

    let columna: "sociedad_id" | "persona_id" | "documento";
    let valor: string;
    let etiqueta: string | null = null;

    if (tipo === "documento") {
      valor = String(req.body?.documento ?? "").replace(/\D/g, "");
      if (valor.length < 7 || valor.length > 11) {
        return res.status(400).json({ error: "El CUIT/DNI debe tener entre 7 y 11 dígitos." });
      }
      columna = "documento";
      etiqueta =
        typeof req.body?.etiqueta === "string" && req.body.etiqueta.trim()
          ? req.body.etiqueta.trim().slice(0, 200)
          : null;
    } else {
      valor = String(req.body?.id ?? "");
      if (!/^\d+$/.test(valor)) return res.status(400).json({ error: "Id inválido." });
      columna = tipo === "sociedad" ? "sociedad_id" : "persona_id";
    }

    // ON CONFLICT sobre los índices parciales: apretar el botón dos veces (o
    // tenerlo abierto en dos pestañas) no tiene que ser un error.
    const { rows } = await pool().query<{ id: string }>(
      `INSERT INTO suscripciones_notificacion (usuario_id, ${columna}, etiqueta)
       VALUES ($1, $2, $3)
       ON CONFLICT DO NOTHING
       RETURNING id::text`,
      [req.usuario!.id, valor, etiqueta],
    );
    return res.status(201).json({ ok: true, id: rows[0]?.id ?? null });
  }),
);

notificacionesRouter.delete(
  "/:id",
  requireUsuario(),
  asyncHandler(async (req: Request, res: Response) => {
    if (!/^\d+$/.test(req.params.id)) return res.status(400).json({ error: "Id inválido." });
    // El usuario_id en el WHERE es lo que impide borrar la suscripción de otro.
    const { rowCount } = await pool().query(
      "DELETE FROM suscripciones_notificacion WHERE id = $1 AND usuario_id = $2",
      [req.params.id, req.usuario!.id],
    );
    if (!rowCount) return res.status(404).json({ error: "No encontramos esa notificación." });
    return res.json({ ok: true });
  }),
);

// Disparador del job diario (ver _notificar_backend en run_diario.py del repo
// job-diario-boletin-oficial). No lleva requireUsuario: lo llama una máquina,
// no una persona. En producción el job corre en la misma red de docker
// compose (--network app_default), así que le pega por el hostname interno y
// esto nunca se expone a internet.
notificacionesRouter.post(
  "/procesar",
  asyncHandler(async (req: Request, res: Response) => {
    const esperado = process.env.JOB_WEBHOOK_TOKEN;
    // Sin token configurado el endpoint no queda abierto: se apaga.
    if (!esperado) {
      return res.status(503).json({ error: "JOB_WEBHOOK_TOKEN no configurado." });
    }
    const recibido = String(req.get("x-job-token") ?? "");
    const a = Buffer.from(recibido);
    const b = Buffer.from(esperado);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
      return res.status(401).json({ error: "Token inválido." });
    }

    const boletines: string[] = Array.isArray(req.body?.boletines)
      ? req.body.boletines.map((v: unknown) => String(v)).filter(Boolean)
      : [];
    if (boletines.length === 0) {
      return res.status(400).json({ error: "Falta la lista de boletines." });
    }

    // 202 y a procesar en segundo plano: mandar los mails puede tardar y el
    // job diario no tiene por qué quedarse esperando (su corrida ya terminó).
    res.status(202).json({ ok: true, recibidos: boletines.length });
    procesarNotificaciones(boletines).catch((err) =>
      console.error("[notificaciones] error procesando el aviso del job diario:", err),
    );
    return;
  }),
);
