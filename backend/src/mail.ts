import { Resend } from "resend";

// Wrapper de mail transaccional (bienvenida, reset de contraseña). MAIL_FROM
// usa el dominio propio verificado en Resend (ingcome.com.ar).
let resendSingleton: Resend | null = null;
function resend(): Resend {
  if (!resendSingleton) {
    resendSingleton = new Resend(process.env.RESEND_API_KEY);
  }
  return resendSingleton;
}

function mailFrom(): string {
  return process.env.MAIL_FROM ?? "INGcome <no-responder@ingcome.com.ar>";
}

const VINO = "#691824";
const CARBON = "#191d20";
const HUMO = "#efefef";

// Los clientes de mail ignoran hojas de estilo externas, así que todo va con
// estilos inline. Layout compartido entre las dos plantillas.
function layout(contenidoHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${HUMO};font-family:Arial,Helvetica,sans-serif;color:${CARBON};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="480" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="background:${VINO};padding:24px 32px;">
                <img src="${sitioUrl()}/brand/horizontal-blanco.svg" alt="INGcome" height="28" style="display:block;border:0;" />
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                ${contenidoHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

interface DestinatarioMail {
  mail: string;
  nombre: string;
}

// Nunca lanza: si Resend falla (o no hay API key configurada), solo se
// loguea. El alta de cuenta no puede depender de que el mail salga bien.
export async function enviarBienvenida(usuario: DestinatarioMail): Promise<void> {
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;">¡Bienvenido/a, ${usuario.nombre}!</h1>
    <p style="margin:0 0 4px;line-height:1.5;color:#5a5f63;">
      Tu cuenta en INGcome ya está lista. Ya podés buscar sociedades y personas del
      Boletín Oficial de Mendoza, explorar la red de vínculos entre empresas y
      programar notificaciones.
    </p>
  `);
  try {
    const { error } = await resend().emails.send({
      from: mailFrom(),
      to: usuario.mail,
      subject: "Bienvenido/a a INGcome",
      html,
    });
    // La SDK de Resend no tira excepción en errores de la API (403, dominio
    // no verificado, etc.) -- devuelve { data: null, error } y resuelve
    // normalmente. Sin este chequeo, un error de Resend quedaba silencioso.
    if (error) throw error;
  } catch (err) {
    console.error("Error enviando mail de bienvenida:", err);
  }
}

// Una entidad vigilada por el usuario que tuvo movimiento en un boletín
// nuevo. Un acto por elemento: si una misma sociedad tiene dos actos en el
// día, vienen dos elementos.
export interface NovedadNotificacion {
  tipoEntidad: "sociedad" | "persona";
  entidadId: string;
  entidadNombre: string;
  acto: string;
  fechaActo: string | null;
  descripcion: string | null;
  // Vínculos que creó este acto (rol + nombre), p.ej. los socios de una
  // constitución o las autoridades designadas.
  participantes: { rol: string; nombre: string }[];
  escribano: string | null;
  registroNotarial: string | null;
  idPdf: string | null;
}

function sitioUrl(): string {
  return process.env.FRONTEND_URL ?? "http://localhost:5173";
}

// Escapa para interpolar texto de la base (descripciones del LLM, nombres)
// dentro del HTML del mail.
function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function bloqueNovedad(n: NovedadNotificacion): string {
  const url = `${sitioUrl()}/${n.tipoEntidad}/${n.entidadId}`;
  const filas: string[] = [];

  if (n.fechaActo) {
    filas.push(
      `<p style="margin:0 0 6px;font-size:13px;color:#8a8f93;">Fecha del acto: ${esc(n.fechaActo)}</p>`,
    );
  }
  if (n.descripcion) {
    filas.push(
      `<p style="margin:0 0 10px;line-height:1.5;color:#5a5f63;">${esc(n.descripcion)}</p>`,
    );
  }
  if (n.participantes.length > 0) {
    const items = n.participantes
      .map((p) => `<li style="margin:0 0 2px;">${esc(p.nombre)} — ${esc(p.rol)}</li>`)
      .join("");
    filas.push(
      `<p style="margin:0 0 4px;font-size:13px;font-weight:bold;">Personas y empresas en este acto</p>
       <ul style="margin:0 0 10px;padding-left:18px;line-height:1.5;color:#5a5f63;font-size:14px;">${items}</ul>`,
    );
  }
  if (n.escribano) {
    const registro = n.registroNotarial ? ` (registro ${esc(n.registroNotarial)})` : "";
    filas.push(
      `<p style="margin:0 0 10px;font-size:13px;color:#8a8f93;">Escribano: ${esc(n.escribano)}${registro}</p>`,
    );
  }

  const linkPdf = n.idPdf
    ? ` &nbsp;·&nbsp; <a href="https://boe.mendoza.gov.ar/default/public/publico/verpdf/${esc(n.idPdf)}" style="color:${VINO};">Ver el boletín en PDF</a>`
    : "";

  return `
    <div style="border:1px solid #e4e4e4;border-radius:16px;padding:20px;margin:0 0 16px;">
      <p style="margin:0 0 2px;font-size:12px;text-transform:uppercase;letter-spacing:1px;color:${VINO};">${esc(n.acto)}</p>
      <h2 style="margin:0 0 10px;font-size:18px;">${esc(n.entidadNombre)}</h2>
      ${filas.join("")}
      <a href="${url}" style="color:${VINO};font-weight:bold;text-decoration:none;">Ver la ficha completa</a>${linkPdf}
    </div>`;
}

// Aviso de movimiento en las entidades que el usuario tiene en seguimiento.
// Un solo mail por usuario por corrida, aunque tenga varias entidades con
// novedades. No lanza (mismo criterio que el resto del archivo): quien la
// llama solo registra en notificaciones_enviadas si devolvió true, así un
// fallo de Resend se reintenta en la corrida siguiente en vez de perderse.
export async function enviarNotificacionActualizaciones(
  usuario: DestinatarioMail,
  novedades: NovedadNotificacion[],
): Promise<boolean> {
  if (novedades.length === 0) return false;

  const plural = novedades.length === 1 ? "una novedad" : `${novedades.length} novedades`;
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;">Hay ${plural} en tu seguimiento</h1>
    <p style="margin:0 0 20px;line-height:1.5;color:#5a5f63;">
      ${usuario.nombre}, esto apareció en el Boletín Oficial de Mendoza sobre lo que
      seguís:
    </p>
    ${novedades.map(bloqueNovedad).join("")}
    <p style="margin:20px 0 0;font-size:13px;color:#8a8f93;">
      Podés dar de baja cualquier seguimiento desde
      <a href="${sitioUrl()}/notificaciones" style="color:${VINO};">tus notificaciones</a>.
    </p>
  `);

  try {
    const { error } = await resend().emails.send({
      from: mailFrom(),
      to: usuario.mail,
      subject:
        novedades.length === 1
          ? `Novedad en ${novedades[0].entidadNombre}`
          : `${novedades.length} novedades en tu seguimiento`,
      html,
    });
    if (error) throw error;
    return true;
  } catch (err) {
    console.error("Error enviando mail de notificación de actualizaciones:", err);
    return false;
  }
}

// Mail ad-hoc enviado a mano desde el panel de admin (tab "E-mail"), no
// ligado a ningún flujo automático. A diferencia del resto del archivo, sí
// devuelve el resultado en vez de tragarse el error: acá el admin está
// esperando una confirmación en el momento, no tiene sentido que la UI diga
// "enviado" si Resend lo rechazó. Remitente fijo (no mailFrom()): este envío
// puntual usa la casilla de privacidad, no la de no-responder del resto de
// la app.
export async function enviarMailPersonalizado(
  destinatario: string,
  asunto: string,
  cuerpo: string,
): Promise<{ ok: boolean; error?: string }> {
  const cuerpoHtml = esc(cuerpo).replace(/\n/g, "<br>");
  const html = layout(`
    <p style="margin:0;line-height:1.6;color:#5a5f63;">${cuerpoHtml}</p>
  `);
  try {
    const { error } = await resend().emails.send({
      from: "INGcome <privacidad@ingcome.com.ar>",
      to: destinatario,
      subject: asunto,
      html,
    });
    if (error) throw error;
    return { ok: true };
  } catch (err) {
    console.error("Error enviando mail personalizado desde admin:", err);
    return { ok: false, error: err instanceof Error ? err.message : "Error desconocido" };
  }
}

// Tampoco lanza, a propósito: el endpoint que la llama responde el mismo
// mensaje genérico exista o no la cuenta / haya fallado o no el envío, para
// no filtrar qué mails están registrados.
export async function enviarResetContrasena(usuario: DestinatarioMail, link: string): Promise<void> {
  const html = layout(`
    <h1 style="margin:0 0 12px;font-size:22px;">Restablecer contraseña</h1>
    <p style="margin:0 0 20px;line-height:1.5;color:#5a5f63;">
      Pediste restablecer la contraseña de tu cuenta en INGcome. Si no fuiste vos,
      podés ignorar este mail.
    </p>
    <a href="${link}" style="display:inline-block;background:${VINO};color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:999px;">
      Elegir nueva contraseña
    </a>
    <p style="margin:20px 0 0;font-size:13px;color:#8a8f93;">Este link vence en 1 hora.</p>
  `);
  try {
    const { error } = await resend().emails.send({
      from: mailFrom(),
      to: usuario.mail,
      subject: "Restablecer tu contraseña de INGcome",
      html,
    });
    if (error) throw error;
  } catch (err) {
    console.error("Error enviando mail de reset de contraseña:", err);
  }
}
