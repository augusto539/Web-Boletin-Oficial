// Los datos del Boletín son incompletos por naturaleza: casi cualquier campo
// puede venir null. Estos helpers centralizan cómo se muestra un dato ausente.
export const SIN_DATO = "—";

export function dato(valor: string | number | null | undefined): string {
  if (valor === null || valor === undefined || valor === "") return SIN_DATO;
  return String(valor);
}

// Las fechas llegan como "YYYY-MM-DD"; se formatean sin pasar por Date para
// evitar el corrimiento de día por zona horaria (UTC-3).
export function fecha(iso: string | null | undefined): string {
  if (!iso) return SIN_DATO;
  const [anio, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${anio}`;
}

export function moneda(valor: string | null | undefined): string {
  if (valor === null || valor === undefined) return SIN_DATO;
  const numero = Number(valor);
  if (Number.isNaN(numero)) return SIN_DATO;
  return numero.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  });
}

export function porcentaje(valor: string | null | undefined): string {
  if (valor === null || valor === undefined) return SIN_DATO;
  const numero = Number(valor);
  if (Number.isNaN(numero)) return SIN_DATO;
  return `${numero.toLocaleString("es-AR", { maximumFractionDigits: 2 })}%`;
}

export function siNo(valor: boolean | null | undefined): string {
  if (valor === null || valor === undefined) return SIN_DATO;
  return valor ? "Sí" : "No";
}

// El CUIT en la base son 11 dígitos sin guiones (ej: "30716289806"); se
// muestra en el formato habitual XX-XXXXXXXX-X.
export function cuit(valor: string | null | undefined): string {
  if (!valor) return SIN_DATO;
  const digitos = valor.replace(/\D/g, "");
  if (digitos.length !== 11) return valor;
  return `${digitos.slice(0, 2)}-${digitos.slice(2, 10)}-${digitos.slice(10)}`;
}

// El visor de PDF del Boletín Oficial de Mendoza arma la URL con el id_pdf
// de esa edición (la tabla boletines solo guarda id_pdf, no una URL directa).
export function enlaceBoletin(boletin: { idPdf: string | null }): string | null {
  if (boletin.idPdf) return `https://boe.mendoza.gov.ar/default/public/publico/verpdf/${boletin.idPdf}`;
  return null;
}

// Fecha de hoy en formato "YYYY-MM-DD" (hora local, no UTC) para precargar
// inputs type="date".
export function hoyISO(): string {
  const ahora = new Date();
  const anio = ahora.getFullYear();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}
