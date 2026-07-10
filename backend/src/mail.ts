import { Resend } from "resend";

// Wrapper de mail transaccional (bienvenida, reset de contraseña). Sin
// dominio propio verificado en Resend, MAIL_FROM usa el dominio de pruebas
// @resend.dev, que solo entrega al mail de la cuenta de Resend — no a
// usuarios reales (ver docs/pendientes.md). El día que se verifique un
// dominio, el único cambio necesario es la env var MAIL_FROM.
let resendSingleton: Resend | null = null;
function resend(): Resend {
  if (!resendSingleton) {
    resendSingleton = new Resend(process.env.RESEND_API_KEY);
  }
  return resendSingleton;
}

function mailFrom(): string {
  return process.env.MAIL_FROM ?? "INGcome <onboarding@resend.dev>";
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
              <td style="background:${VINO};padding:28px 32px;">
                <span style="color:#ffffff;font-size:20px;font-weight:bold;">INGcome</span>
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
    await resend().emails.send({
      from: mailFrom(),
      to: usuario.mail,
      subject: "Bienvenido/a a INGcome",
      html,
    });
  } catch (err) {
    console.error("Error enviando mail de bienvenida:", err);
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
    await resend().emails.send({
      from: mailFrom(),
      to: usuario.mail,
      subject: "Restablecer tu contraseña de INGcome",
      html,
    });
  } catch (err) {
    console.error("Error enviando mail de reset de contraseña:", err);
  }
}
