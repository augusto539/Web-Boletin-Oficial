import { useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlechaIcon } from "../components/FlechaIcon";
import {
  alternarAdminUsuario,
  obtenerEstadisticasAdmin,
  obtenerLeadsAdmin,
  obtenerUsuariosAdmin,
  type EstadisticasAdmin,
  type LeadAdmin,
  type UsuarioAdmin,
} from "../lib/adminApi";
import { cuit as formatCuit, dato, fecha } from "../lib/format";
import {
  ADMIN_PERSONAS,
  ADMIN_SOCIEDADES,
  CONTEO_ADMIN,
  type AdminPersona,
  type AdminSociedad,
  type DataAdminPersonas,
  type DataAdminSociedades,
  type DataConteoAdmin,
} from "../lib/queries";

type Pestana = "estadisticas" | "configuracion" | "datos";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "estadisticas", etiqueta: "Estadísticas de la página" },
  { id: "configuracion", etiqueta: "Configuración" },
  { id: "datos", etiqueta: "Datos" },
];

export default function Admin() {
  const [pestana, setPestana] = useState<Pestana>("estadisticas");

  return (
    <main className="min-h-screen bg-humo px-6 pt-32 pb-20">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold md:text-5xl">Admin</h1>
        <p className="mt-3 text-lg text-carbon/60">Panel interno de INGcome.</p>

        <div className="mt-8 flex gap-2 border-b border-carbon/10">
          {PESTANAS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPestana(p.id)}
              className={`cursor-pointer rounded-t-xl px-5 py-3 text-sm font-bold transition-colors ${
                pestana === p.id
                  ? "border-b-2 border-vino text-vino"
                  : "text-carbon/50 hover:text-carbon"
              }`}
            >
              {p.etiqueta}
            </button>
          ))}
        </div>

        {pestana === "estadisticas" && <TabEstadisticas />}
        {pestana === "configuracion" && (
          <div className="mt-6 rounded-3xl bg-white p-14 text-center text-carbon/50">
            Configuración — próximamente.
          </div>
        )}
        {pestana === "datos" && <TabDatos />}
      </div>
    </main>
  );
}

function TarjetaEstadistica({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-carbon/50">{etiqueta}</p>
      <p className="mt-2 text-4xl font-bold text-vino">{valor}</p>
    </div>
  );
}

function TabEstadisticas() {
  const { data } = useQuery<DataConteoAdmin>(CONTEO_ADMIN);
  const [admin, setAdmin] = useState<EstadisticasAdmin | null>(null);

  useEffect(() => {
    obtenerEstadisticasAdmin()
      .then(setAdmin)
      .catch(() => setAdmin(null));
  }, []);

  const fmt = (n: number | undefined) => (n === undefined ? "…" : n.toLocaleString("es-AR"));

  return (
    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <TarjetaEstadistica etiqueta="Sociedades" valor={fmt(data?.allSociedades.totalCount)} />
      <TarjetaEstadistica
        etiqueta="Personas físicas"
        valor={fmt(data?.allPersonasFisicas.totalCount)}
      />
      <TarjetaEstadistica
        etiqueta="Usuarios registrados"
        valor={fmt(admin?.usuariosRegistrados)}
      />
      <TarjetaEstadistica
        etiqueta="Notificaciones activas"
        valor={fmt(admin?.notificacionesActivas)}
      />
    </div>
  );
}

const POR_PAGINA = 100;

type SubPestana = "sociedades" | "personas" | "usuarios" | "leads";

const SUBPESTANAS: { id: SubPestana; etiqueta: string }[] = [
  { id: "sociedades", etiqueta: "Sociedades" },
  { id: "personas", etiqueta: "Personas físicas" },
  { id: "usuarios", etiqueta: "Usuarios" },
  { id: "leads", etiqueta: "Leads" },
];

function TabDatos() {
  const [sub, setSub] = useState<SubPestana>("sociedades");

  return (
    <div className="mt-6">
      <div className="mb-5 flex gap-2">
        {SUBPESTANAS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSub(s.id)}
            className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
              sub === s.id ? "bg-vino text-white" : "bg-white text-carbon/60 hover:bg-carbon/10"
            }`}
          >
            {s.etiqueta}
          </button>
        ))}
      </div>

      {sub === "sociedades" && <TablaSociedades />}
      {sub === "personas" && <TablaPersonas />}
      {sub === "usuarios" && <TablaUsuarios />}
      {sub === "leads" && <TablaLeads />}
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
        className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-bold text-carbon disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Anterior
      </button>
      <span className="text-sm text-carbon/60">
        Página {pagina} de {totalPaginas}
      </span>
      <button
        type="button"
        disabled={pagina >= totalPaginas}
        onClick={() => onCambiar(pagina + 1)}
        className="cursor-pointer rounded-full bg-white px-5 py-2 text-sm font-bold text-carbon disabled:cursor-not-allowed disabled:opacity-40"
      >
        Siguiente <FlechaIcon className="ml-1" />
      </button>
    </div>
  );
}

function nombresSocios(v: AdminSociedad["vinculosBySociedadId"]["nodes"]): string {
  const nombres = v
    .map((x) => x.personaFisicaByPersonaId?.nombre ?? x.sociedadBySociedadMiembroId?.nombre ?? x.nombreJuridicoFallback)
    .filter((n): n is string => Boolean(n));
  return [...new Set(nombres)].join(", ");
}

function TablaSociedades() {
  const [pagina, setPagina] = useState(1);
  const { data, loading } = useQuery<DataAdminSociedades>(ADMIN_SOCIEDADES, {
    variables: { first: POR_PAGINA, offset: (pagina - 1) * POR_PAGINA },
  });

  const total = data?.allSociedades.totalCount ?? 0;
  const filas = data?.allSociedades.nodes ?? [];
  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {loading ? "Cargando…" : `Mostrando ${filas.length} de ${total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">CUIT</th>
              <th className="py-3 pr-4">Clae principal</th>
              <th className="py-3 pr-4">Descripción del clae</th>
              <th className="py-3 pr-4">Constitución</th>
              <th className="py-3 pr-4">Socios</th>
              <th className="py-3 pr-4">Domicilio</th>
              <th className="py-3">Domicilio electrónico</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((s) => {
              const principal = s.sociedadActividadesBySociedadId.nodes.find((a) => a.orden === 1);
              return (
                <tr key={s.id} className="border-b border-carbon/5 last:border-0 align-top">
                  <td className="py-3 pr-4 font-bold">
                    <Link
                      to={`/sociedad/${s.id}`}
                      className="text-vino underline-offset-4 hover:underline"
                    >
                      {s.nombre}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{s.cuit ? formatCuit(s.cuit) : dato(null)}</td>
                  <td className="py-3 pr-4">{dato(principal?.grupoClaeByClaeGrupo?.nombre)}</td>
                  <td className="py-3 pr-4">{dato(principal?.actividadClaeByClaeCodigo?.descripcion)}</td>
                  <td className="py-3 pr-4">{fecha(s.fechaConstitucion)}</td>
                  <td className="py-3 pr-4">{dato(nombresSocios(s.vinculosBySociedadId.nodes))}</td>
                  <td className="py-3 pr-4">{dato(s.domicilioByDomicilioId?.domicilioCompleto)}</td>
                  <td className="py-3">{dato(s.domicilioElectronico)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}

function TablaPersonas() {
  const [pagina, setPagina] = useState(1);
  const { data, loading } = useQuery<DataAdminPersonas>(ADMIN_PERSONAS, {
    variables: { first: POR_PAGINA, offset: (pagina - 1) * POR_PAGINA },
  });

  const total = data?.allPersonasFisicas.totalCount ?? 0;
  const filas = data?.allPersonasFisicas.nodes ?? [];
  const totalPaginas = Math.ceil(total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {loading ? "Cargando…" : `Mostrando ${filas.length} de ${total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">DNI</th>
              <th className="py-3 pr-4">CUIT</th>
              <th className="py-3 pr-4">Profesión</th>
              <th className="py-3 pr-4">Nacimiento</th>
              <th className="py-3 pr-4">Domicilio</th>
              <th className="py-3">Domicilio electrónico</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((p: AdminPersona) => (
              <tr key={p.id} className="border-b border-carbon/5 last:border-0 align-top">
                <td className="py-3 pr-4 font-bold">
                  <Link to={`/persona/${p.id}`} className="text-vino underline-offset-4 hover:underline">
                    {p.nombre}
                  </Link>
                </td>
                <td className="py-3 pr-4">{dato(p.documento)}</td>
                <td className="py-3 pr-4">{p.cuit ? formatCuit(p.cuit) : dato(null)}</td>
                <td className="py-3 pr-4">{dato(p.profesion)}</td>
                <td className="py-3 pr-4">{fecha(p.fechaNacimiento)}</td>
                <td className="py-3 pr-4">{dato(p.domicilioByDomicilioId?.domicilioCompleto)}</td>
                <td className="py-3">{dato(p.domicilioElectronico)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}

function TablaUsuarios() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<{ total: number; usuarios: UsuarioAdmin[] }>({
    total: 0,
    usuarios: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    obtenerUsuariosAdmin(POR_PAGINA, (pagina - 1) * POR_PAGINA)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [pagina]);

  function alAlternarAdmin(usuario: UsuarioAdmin) {
    setDatos((d) => ({
      ...d,
      usuarios: d.usuarios.map((u) => (u.id === usuario.id ? { ...u, admin: !u.admin } : u)),
    }));
    alternarAdminUsuario(usuario.id, !usuario.admin).catch(() => {
      // Si falla (ej. intentar auto-degradarse), se revierte el cambio optimista.
      setDatos((d) => ({
        ...d,
        usuarios: d.usuarios.map((u) => (u.id === usuario.id ? { ...u, admin: usuario.admin } : u)),
      }));
    });
  }

  const totalPaginas = Math.ceil(datos.total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {cargando
          ? "Cargando…"
          : `Mostrando ${datos.usuarios.length} de ${datos.total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">Mail</th>
              <th className="py-3 pr-4">Creado</th>
              <th className="py-3">Admin</th>
            </tr>
          </thead>
          <tbody>
            {datos.usuarios.map((u) => (
              <tr key={u.id} className="border-b border-carbon/5 last:border-0">
                <td className="py-3 pr-4 font-bold">
                  <Link
                    to={`/admin/usuarios/${u.id}`}
                    className="text-vino underline-offset-4 hover:underline"
                  >
                    {u.nombre}
                  </Link>
                </td>
                <td className="py-3 pr-4">{u.mail}</td>
                <td className="py-3 pr-4">{fecha(u.creadoEl.slice(0, 10))}</td>
                <td className="py-3">
                  <button
                    type="button"
                    onClick={() => alAlternarAdmin(u)}
                    className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
                      u.admin
                        ? "bg-vino text-white hover:bg-vino-oscuro"
                        : "bg-humo text-carbon/60 hover:bg-carbon/10"
                    }`}
                  >
                    {u.admin ? "Quitar admin" : "Dar admin"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}

function TablaLeads() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<{ total: number; leads: LeadAdmin[] }>({
    total: 0,
    leads: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    obtenerLeadsAdmin(POR_PAGINA, (pagina - 1) * POR_PAGINA)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [pagina]);

  const totalPaginas = Math.ceil(datos.total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {cargando
          ? "Cargando…"
          : `Mostrando ${datos.leads.length} de ${datos.total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[400px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Mail</th>
              <th className="py-3">Creado</th>
            </tr>
          </thead>
          <tbody>
            {datos.leads.map((l) => (
              <tr key={l.id} className="border-b border-carbon/5 last:border-0">
                <td className="py-3 pr-4 font-bold">{l.mail}</td>
                <td className="py-3">{fecha(l.creadoEl.slice(0, 10))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={setPagina} />
    </div>
  );
}
