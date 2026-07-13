import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FlechaIcon } from "../components/FlechaIcon";
import {
  alternarAdminUsuario,
  obtenerHistorialUsuario,
  obtenerUsuarioAdmin,
  type HistorialItem,
  type UsuarioAdmin,
} from "../lib/adminApi";
import { dato, SIN_DATO } from "../lib/format";

const POR_PAGINA = 100;

const ETIQUETAS_TIPO: Record<string, string> = {
  sociedad_nombre: "Sociedad por nombre",
  sociedad_cuit: "Sociedad por CUIT",
  sociedad_avanzada: "Sociedades (avanzada)",
  persona_avanzada: "Personas (avanzada)",
};

function fechaHora(iso: string): string {
  return new Date(iso).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminUsuario() {
  const { id } = useParams();
  const [usuario, setUsuario] = useState<UsuarioAdmin | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    setCargando(true);
    setError(false);
    obtenerUsuarioAdmin(id)
      .then((r) => setUsuario(r.usuario))
      .catch(() => setError(true))
      .finally(() => setCargando(false));
  }, [id]);

  function alAlternarAdmin() {
    if (!usuario) return;
    const anterior = usuario.admin;
    setUsuario({ ...usuario, admin: !anterior });
    alternarAdminUsuario(usuario.id, !anterior).catch(() => {
      setUsuario((u) => (u ? { ...u, admin: anterior } : u));
    });
  }

  if (cargando) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <p className="text-carbon/50">Cargando…</p>
      </main>
    );
  }

  if (error || !usuario) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-20">
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold">No encontramos ese usuario</h1>
          <Link
            to="/admin"
            className="mt-8 inline-block rounded-full bg-vino px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Volver a Admin
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-humo px-6 pt-32 pb-20">
      <div className="mx-auto max-w-5xl">
        <Link to="/admin" className="text-sm font-bold text-carbon/50 hover:text-vino">
          ← Volver a Admin
        </Link>

        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold md:text-5xl">{usuario.nombre}</h1>
            <p className="mt-2 text-carbon/60">{usuario.mail}</p>
          </div>
          <button
            type="button"
            onClick={alAlternarAdmin}
            className={`shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-colors ${
              usuario.admin
                ? "bg-vino text-white hover:bg-vino-oscuro"
                : "bg-white text-carbon/60 hover:bg-carbon/10"
            }`}
          >
            {usuario.admin ? "Quitar admin" : "Dar admin"}
          </button>
        </div>

        {/* Información */}
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-bold">Información</h2>
          <dl className="grid gap-x-10 gap-y-6 rounded-3xl bg-white p-7 md:grid-cols-3">
            <Campo etiqueta="Plan" valor={dato(usuario.plan)} />
            <Campo etiqueta="Admin" valor={usuario.admin ? "Sí" : "No"} />
            <Campo etiqueta="Creado" valor={fechaHora(usuario.creadoEl)} />
          </dl>
        </section>

        {/* Historial */}
        <section className="mt-10">
          <h2 className="mb-6 text-2xl font-bold">Historial de búsquedas</h2>
          <TablaHistorial usuarioId={usuario.id} />
        </section>
      </div>
    </main>
  );
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const vacio = valor === SIN_DATO;
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-carbon/50">{etiqueta}</dt>
      <dd className={`mt-1.5 leading-relaxed ${vacio ? "text-carbon/35" : "text-carbon"}`}>{valor}</dd>
    </div>
  );
}

function Paginador({
  pagina,
  totalPaginas,
  onCambiar,
}: {
  pagina: number;
  totalPaginas: number;
  onCambiar: (p: number) => void;
}) {
  if (totalPaginas <= 1) return null;
  return (
    <div className="mt-5 flex items-center justify-center gap-4">
      <button
        type="button"
        disabled={pagina <= 1}
        onClick={() => onCambiar(pagina - 1)}
        className="cursor-pointer rounded-full bg-humo px-5 py-2 text-sm font-bold text-carbon disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FlechaIcon className="mr-1 scale-x-[-1]" /> Anterior
      </button>
      <span className="text-sm text-carbon/60">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        disabled={pagina >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
        className="cursor-pointer rounded-full bg-humo px-5 py-2 text-sm font-bold text-carbon disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente <FlechaIcon className="ml-1" />
      </button>
    </div>
  );
}

function TablaHistorial({ usuarioId }: { usuarioId: string }) {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<{ total: number; historial: HistorialItem[] }>({
    total: 0,
    historial: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    obtenerHistorialUsuario(usuarioId, POR_PAGINA, (pagina - 1) * POR_PAGINA)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [usuarioId, pagina]);

  const totalPaginas = Math.ceil(datos.total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {cargando
          ? "Cargando…"
          : datos.total === 0
            ? "Este usuario todavía no hizo ninguna búsqueda."
            : `Mostrando ${datos.historial.length} de ${datos.total.toLocaleString("es-AR")}`}
      </p>
      {datos.historial.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                <th className="py-3 pr-4">Tipo</th>
                <th className="py-3 pr-4">Término</th>
                <th className="py-3 pr-4">Resultados</th>
                <th className="py-3">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {datos.historial.map((h) => (
                <tr key={h.id} className="border-b border-carbon/5 last:border-0">
                  <td className="py-3 pr-4">{ETIQUETAS_TIPO[h.tipo] ?? h.tipo}</td>
                  <td className="py-3 pr-4 font-bold">{h.termino ?? "(sin término, con filtros)"}</td>
                  <td className="py-3 pr-4">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        h.resultados > 0 ? "bg-vino/10 text-vino" : "bg-humo text-carbon/50"
                      }`}
                    >
                      {h.resultados}
                    </span>
                  </td>
                  <td className="py-3">{fechaHora(h.creadoEl)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}
