import { type ReactNode, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlechaIcon } from "../components/FlechaIcon";
import {
  actualizarModoSoloAdmin,
  alternarAdminUsuario,
  alternarOcultaPersona,
  alternarOcultaSociedad,
  enviarMailPersonalizadoAdmin,
  obtenerConfiguracionAdmin,
  obtenerEstadisticasAdmin,
  obtenerGastoAnthropicAdmin,
  obtenerLeadsAdmin,
  obtenerPersonasAdmin,
  obtenerSociedadesAdmin,
  obtenerSociosJuridicosAdmin,
  obtenerUsuariosAdmin,
  recalcularInformesAdmin,
  vincularSocioJuridico,
  type EstadisticasAdmin,
  type GastoAnthropic,
  type LeadAdmin,
  type PersonaAdmin,
  type SociedadAdmin,
  type SocioJuridicoGrupo,
  type UsuarioAdmin,
} from "../lib/adminApi";
import { cuit as formatCuit, dato, fecha } from "../lib/format";

const fmtUSD = (n: number | null | undefined) =>
  n == null || Number.isNaN(n) ? "…" : `US$ ${n.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

type Pestana = "estadisticas" | "configuracion" | "datos" | "email";

const PESTANAS: { id: Pestana; etiqueta: string }[] = [
  { id: "estadisticas", etiqueta: "Estadísticas de la página" },
  { id: "configuracion", etiqueta: "Configuración" },
  { id: "datos", etiqueta: "Datos" },
  { id: "email", etiqueta: "E-mail" },
];

export default function Admin() {
  const [pestana, setPestana] = useState<Pestana>("estadisticas");

  return (
    <main className="relative min-h-screen overflow-hidden bg-humo px-6 pt-32 pb-20">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(105,24,36,0.16) 1.5px, transparent 1.5px)",
          backgroundSize: "20px 20px",
          maskImage: "radial-gradient(black, transparent 80%)",
          WebkitMaskImage: "radial-gradient(black, transparent 80%)",
        }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl">
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
      </div>

      <div className={`relative mx-auto ${pestana === "datos" ? "max-w-none" : "max-w-6xl"}`}>
        {pestana === "estadisticas" && <TabEstadisticas />}
        {pestana === "configuracion" && <TabConfiguracion />}
        {pestana === "datos" && <TabDatos />}
        {pestana === "email" && <TabEmail />}
      </div>
    </main>
  );
}

function TarjetaEstadistica({
  etiqueta,
  valor,
  tamanioValor = "text-4xl",
}: {
  etiqueta: string;
  valor: string;
  /** Clase de tamaño de fuente para el valor -- achicar cuando el texto es
   * largo (montos, fechas) y no entra en una sola línea con el tamaño
   * default. */
  tamanioValor?: string;
}) {
  return (
    <div className="flex h-full min-h-[7.5rem] flex-col rounded-3xl bg-white p-7">
      <p className="text-xs font-bold uppercase tracking-widest text-carbon/50">{etiqueta}</p>
      {/* mt-auto ancla el valor al borde de abajo de la tarjeta, sin
          importar si la etiqueta de arriba ocupa una línea o dos. */}
      <p className={`mt-auto pt-2 font-bold whitespace-nowrap text-vino ${tamanioValor}`}>{valor}</p>
    </div>
  );
}

function CategoriaEstadisticas({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-carbon/50">{titulo}</h2>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{children}</div>
    </section>
  );
}

function TabEstadisticas() {
  const [est, setEst] = useState<EstadisticasAdmin | null>(null);
  const [gasto, setGasto] = useState<GastoAnthropic | null>(null);

  useEffect(() => {
    obtenerEstadisticasAdmin()
      .then(setEst)
      .catch(() => setEst(null));
    // Consulta aparte: pega a la API de Anthropic (externa), no debe
    // bloquear ni tumbar el resto del panel si tarda o falla.
    obtenerGastoAnthropicAdmin()
      .then(setGasto)
      .catch(() => setGasto(null));
  }, []);

  const fmt = (n: number | undefined) => (n === undefined ? "…" : n.toLocaleString("es-AR"));

  return (
    <div className="mt-6 space-y-10">
      <CategoriaEstadisticas titulo="Base de datos">
        <TarjetaEstadistica etiqueta="Sociedades" valor={fmt(est?.baseDeDatos.sociedades)} />
        <TarjetaEstadistica etiqueta="Personas físicas" valor={fmt(est?.baseDeDatos.personas)} />
        <TarjetaEstadistica etiqueta="Relaciones" valor={fmt(est?.baseDeDatos.relaciones)} />
        <TarjetaEstadistica etiqueta="Dados de baja" valor={fmt(est?.baseDeDatos.dadosDeBaja)} />
        <TarjetaEstadistica etiqueta="Boletines extraídos" valor={fmt(est?.baseDeDatos.boletinesExtraidos)} />
        <TarjetaEstadistica etiqueta="Emails en la base" valor={fmt(est?.baseDeDatos.emailsEnBase)} />
      </CategoriaEstadisticas>

      <CategoriaEstadisticas titulo="Últimos datos cargados">
        <TarjetaEstadistica
          etiqueta="Fecha del último boletín"
          valor={est ? fecha(est.ultimosDatosCargados.fecha) : "…"}
          tamanioValor="text-2xl"
        />
        <TarjetaEstadistica
          etiqueta="Sociedades nuevas"
          valor={fmt(est?.ultimosDatosCargados.sociedadesNuevas)}
        />
        <TarjetaEstadistica
          etiqueta="Personas físicas nuevas"
          valor={fmt(est?.ultimosDatosCargados.personasNuevas)}
        />
        <TarjetaEstadistica
          etiqueta="Sociedades actualizadas"
          valor={fmt(est?.ultimosDatosCargados.sociedadesActualizadas)}
        />
        <TarjetaEstadistica
          etiqueta="Personas actualizadas"
          valor={fmt(est?.ultimosDatosCargados.personasActualizadas)}
        />
      </CategoriaEstadisticas>

      <CategoriaEstadisticas titulo="Gasto API">
        <TarjetaEstadistica etiqueta="Gasto total" valor={fmtUSD(gasto?.total)} tamanioValor="text-2xl" />
        <TarjetaEstadistica etiqueta="Últimos 30 días" valor={fmtUSD(gasto?.ultimos30Dias)} tamanioValor="text-2xl" />
        <TarjetaEstadistica etiqueta="Hoy" valor={fmtUSD(gasto?.hoy)} tamanioValor="text-2xl" />
      </CategoriaEstadisticas>

      <CategoriaEstadisticas titulo="Usuarios">
        <TarjetaEstadistica etiqueta="Usuarios registrados" valor={fmt(est?.usuarios.registrados)} />
        <TarjetaEstadistica etiqueta="Leads" valor={fmt(est?.usuarios.leads)} />
        <TarjetaEstadistica etiqueta="Búsquedas" valor={fmt(est?.usuarios.busquedas)} />
        <TarjetaEstadistica etiqueta="Descargas" valor={fmt(est?.usuarios.descargas)} />
        <TarjetaEstadistica etiqueta="Notificaciones activas" valor={fmt(est?.usuarios.notificacionesActivas)} />
      </CategoriaEstadisticas>
    </div>
  );
}

function Toggle({
  activo,
  disabled,
  onClick,
}: {
  activo: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={activo}
      disabled={disabled}
      onClick={onClick}
      className={`relative h-8 w-14 shrink-0 cursor-pointer rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
        activo ? "bg-vino" : "bg-carbon/20"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
          activo ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function TabConfiguracion() {
  const [modoSoloAdmin, setModoSoloAdmin] = useState<boolean | null>(null);
  const [guardando, setGuardando] = useState(false);
  const [recalculando, setRecalculando] = useState(false);
  const [resultadoRecalculo, setResultadoRecalculo] = useState<string | null>(null);

  useEffect(() => {
    obtenerConfiguracionAdmin()
      .then((d) => setModoSoloAdmin(d.modoSoloAdmin))
      .catch(() => setModoSoloAdmin(false));
  }, []);

  function alAlternar() {
    if (modoSoloAdmin === null) return;
    const nuevoValor = !modoSoloAdmin;
    setModoSoloAdmin(nuevoValor);
    setGuardando(true);
    actualizarModoSoloAdmin(nuevoValor)
      .catch(() => setModoSoloAdmin(!nuevoValor))
      .finally(() => setGuardando(false));
  }

  function alRecalcularInformes() {
    setRecalculando(true);
    setResultadoRecalculo(null);
    recalcularInformesAdmin()
      .then((r) =>
        setResultadoRecalculo(
          `Listo: ${r.departamentos} departamentos, ${r.anios} años, ${r.departamentosPorAnio} filas de serie histórica.`,
        ),
      )
      .catch(() => setResultadoRecalculo("Hubo un error, probá de nuevo."))
      .finally(() => setRecalculando(false));
  }

  return (
    <div className="mt-6 space-y-5">
      <div className="rounded-3xl bg-white p-7">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-bold">Modo solo administradores</p>
            <p className="mt-1.5 max-w-xl text-sm text-carbon/60">
              Mientras esté activo, la búsqueda avanzada, la exploración del grafo y el
              buscador de la portada quedan ocultos e inaccesibles para cualquier
              visitante que no sea administrador.
            </p>
          </div>
          <Toggle
            activo={modoSoloAdmin ?? false}
            disabled={modoSoloAdmin === null || guardando}
            onClick={alAlternar}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-white p-7">
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="font-bold">Informes</p>
            <p className="mt-1.5 max-w-xl text-sm text-carbon/60">
              Los datos de "/informes" se recalculan solos todos los días. Usá esto para
              forzar el recálculo ahora (ej. después de una carga grande de datos).
            </p>
            {resultadoRecalculo && (
              <p className="mt-2 text-sm font-bold text-vino">{resultadoRecalculo}</p>
            )}
          </div>
          <button
            type="button"
            onClick={alRecalcularInformes}
            disabled={recalculando}
            className="shrink-0 cursor-pointer rounded-full bg-vino px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-vino-oscuro disabled:cursor-not-allowed disabled:opacity-60"
          >
            {recalculando ? "Recalculando…" : "Recalcular ahora"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Mail suelto a mano, sin ligar a ningún flujo automático de la app -- sale
// siempre desde privacidad@ingcome.com.ar (ver enviarMailPersonalizado en
// backend/src/mail.ts), con el cuerpo tipeado acá insertado dentro del
// mismo layout de marca (header vino + "INGcome") que usan el resto de los
// mails transaccionales.
function TabEmail() {
  const [destinatario, setDestinatario] = useState("");
  const [asunto, setAsunto] = useState("");
  const [cuerpo, setCuerpo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState<{ ok: boolean; texto: string } | null>(null);

  const formularioValido = destinatario.trim() && asunto.trim() && cuerpo.trim();

  function alEnviar(e: React.FormEvent) {
    e.preventDefault();
    if (!formularioValido || enviando) return;
    setEnviando(true);
    setResultado(null);
    enviarMailPersonalizadoAdmin(destinatario.trim(), asunto.trim(), cuerpo)
      .then(() => {
        setResultado({ ok: true, texto: `Mail enviado a ${destinatario.trim()}.` });
        setDestinatario("");
        setAsunto("");
        setCuerpo("");
      })
      .catch(() => setResultado({ ok: false, texto: "Hubo un error, probá de nuevo." }))
      .finally(() => setEnviando(false));
  }

  return (
    <div className="mt-6 max-w-2xl">
      <div className="rounded-3xl bg-white p-7">
        <p className="font-bold">Enviar mail</p>
        <p className="mt-1.5 text-sm text-carbon/60">
          Sale desde <span className="font-bold">privacidad@ingcome.com.ar</span>, con el cuerpo
          insertado dentro del layout de marca de INGcome.
        </p>
        <form onSubmit={alEnviar} className="mt-5 space-y-4">
          <div>
            <label htmlFor="mail-destinatario" className="text-xs font-bold uppercase tracking-widest text-carbon/50">
              Destinatario
            </label>
            <input
              id="mail-destinatario"
              type="email"
              required
              value={destinatario}
              onChange={(e) => setDestinatario(e.target.value)}
              placeholder="persona@ejemplo.com"
              className="mt-1.5 w-full rounded-lg border border-carbon/15 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="mail-asunto" className="text-xs font-bold uppercase tracking-widest text-carbon/50">
              Asunto
            </label>
            <input
              id="mail-asunto"
              type="text"
              required
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-carbon/15 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label htmlFor="mail-cuerpo" className="text-xs font-bold uppercase tracking-widest text-carbon/50">
              Cuerpo del mail
            </label>
            <textarea
              id="mail-cuerpo"
              required
              rows={10}
              value={cuerpo}
              onChange={(e) => setCuerpo(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-carbon/15 px-3 py-2 text-sm"
            />
          </div>
          {resultado && (
            <p className={`text-sm font-bold ${resultado.ok ? "text-vino" : "text-red-600"}`}>
              {resultado.texto}
            </p>
          )}
          <button
            type="submit"
            disabled={!formularioValido || enviando}
            className="cursor-pointer rounded-full bg-vino px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-vino-oscuro disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Enviando…" : "Enviar"}
          </button>
        </form>
      </div>
    </div>
  );
}

const POR_PAGINA = 100;

type SubPestana = "sociedades" | "personas" | "usuarios" | "leads" | "socios-juridicos";

const SUBPESTANAS: { id: SubPestana; etiqueta: string }[] = [
  { id: "sociedades", etiqueta: "Sociedades" },
  { id: "personas", etiqueta: "Personas físicas" },
  { id: "usuarios", etiqueta: "Usuarios" },
  { id: "leads", etiqueta: "Leads" },
  { id: "socios-juridicos", etiqueta: "Socios jurídicos" },
];

function TabDatos() {
  const [sub, setSub] = useState<SubPestana>("sociedades");

  return (
    <div className="mt-6">
      {/* overflow-x-auto solo hasta sm: en desktop ya entran todas las
          pestañas en una línea. Sin esto (y sin shrink-0 en los botones) el
          <main> con overflow-hidden de más arriba directamente recortaba las
          últimas pestañas ("Usuarios", "Leads") fuera de pantalla en mobile,
          sin ninguna forma de llegar a ellas. */}
      <div className="mb-5 flex gap-2 overflow-x-auto sm:overflow-visible">
        {SUBPESTANAS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setSub(s.id)}
            className={`shrink-0 cursor-pointer rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
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
      {sub === "socios-juridicos" && <TablaSociosJuridicos />}
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
        <FlechaIcon className="mr-1 scale-x-[-1]" /> Anterior
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

function BotonOculta({
  oculta,
  onClick,
}: {
  oculta: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
        oculta
          ? "bg-vino text-white hover:bg-vino-oscuro"
          : "bg-humo text-carbon/60 hover:bg-carbon/10"
      }`}
    >
      {oculta ? "Desocultar" : "Ocultar"}
    </button>
  );
}

function TablaSociedades() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<{ total: number; sociedades: SociedadAdmin[] }>({
    total: 0,
    sociedades: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    obtenerSociedadesAdmin(POR_PAGINA, (pagina - 1) * POR_PAGINA)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [pagina]);

  function alAlternarOculta(s: SociedadAdmin) {
    const nuevoValor = !s.oculta;
    setDatos((d) => ({
      ...d,
      sociedades: d.sociedades.map((x) => (x.id === s.id ? { ...x, oculta: nuevoValor } : x)),
    }));
    alternarOcultaSociedad(s.id, nuevoValor).catch(() => {
      setDatos((d) => ({
        ...d,
        sociedades: d.sociedades.map((x) => (x.id === s.id ? { ...x, oculta: s.oculta } : x)),
      }));
    });
  }

  const totalPaginas = Math.ceil(datos.total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {cargando
          ? "Cargando…"
          : `Mostrando ${datos.sociedades.length} de ${datos.total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1300px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">CUIT</th>
              <th className="py-3 pr-4">Clae principal</th>
              <th className="py-3 pr-4">Descripción del clae</th>
              <th className="py-3 pr-4">Constitución</th>
              <th className="py-3 pr-4">Socios</th>
              <th className="py-3 pr-4">Domicilio</th>
              <th className="py-3 pr-4">Domicilio electrónico</th>
              <th className="py-3">Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            {datos.sociedades.map((s) => (
              <tr
                key={s.id}
                className={`border-b border-carbon/5 last:border-0 align-top ${s.oculta ? "opacity-50" : ""}`}
              >
                <td className="py-3 pr-4 font-bold">
                  <Link
                    to={`/sociedad/${s.id}`}
                    className="text-vino underline-offset-4 hover:underline"
                  >
                    {s.nombre}
                  </Link>
                </td>
                <td className="py-3 pr-4">{s.cuit ? formatCuit(s.cuit) : dato(null)}</td>
                <td className="py-3 pr-4">{dato(s.claeGrupoNombre)}</td>
                <td className="py-3 pr-4">{dato(s.claeDescripcion)}</td>
                <td className="py-3 pr-4">{fecha(s.fechaConstitucion)}</td>
                <td className="py-3 pr-4">{dato(s.socios)}</td>
                <td className="py-3 pr-4">{dato(s.domicilioCompleto)}</td>
                <td className="py-3 pr-4">{dato(s.domicilioElectronico)}</td>
                <td className="py-3">
                  <BotonOculta oculta={s.oculta} onClick={() => alAlternarOculta(s)} />
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

function TablaPersonas() {
  const [pagina, setPagina] = useState(1);
  const [datos, setDatos] = useState<{ total: number; personas: PersonaAdmin[] }>({
    total: 0,
    personas: [],
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    obtenerPersonasAdmin(POR_PAGINA, (pagina - 1) * POR_PAGINA)
      .then(setDatos)
      .finally(() => setCargando(false));
  }, [pagina]);

  function alAlternarOculta(p: PersonaAdmin) {
    const nuevoValor = !p.oculta;
    setDatos((d) => ({
      ...d,
      personas: d.personas.map((x) => (x.id === p.id ? { ...x, oculta: nuevoValor } : x)),
    }));
    alternarOcultaPersona(p.id, nuevoValor).catch(() => {
      setDatos((d) => ({
        ...d,
        personas: d.personas.map((x) => (x.id === p.id ? { ...x, oculta: p.oculta } : x)),
      }));
    });
  }

  const totalPaginas = Math.ceil(datos.total / POR_PAGINA);

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {cargando
          ? "Cargando…"
          : `Mostrando ${datos.personas.length} de ${datos.total.toLocaleString("es-AR")}`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">DNI</th>
              <th className="py-3 pr-4">CUIT</th>
              <th className="py-3 pr-4">Profesión</th>
              <th className="py-3 pr-4">Nacimiento</th>
              <th className="py-3 pr-4">Domicilio</th>
              <th className="py-3 pr-4">Domicilio electrónico</th>
              <th className="py-3">Visibilidad</th>
            </tr>
          </thead>
          <tbody>
            {datos.personas.map((p) => (
              <tr
                key={p.id}
                className={`border-b border-carbon/5 last:border-0 align-top ${p.oculta ? "opacity-50" : ""}`}
              >
                <td className="py-3 pr-4 font-bold">
                  <Link to={`/persona/${p.id}`} className="text-vino underline-offset-4 hover:underline">
                    {p.nombre}
                  </Link>
                </td>
                <td className="py-3 pr-4">{dato(p.documento)}</td>
                <td className="py-3 pr-4">{p.cuit ? formatCuit(p.cuit) : dato(null)}</td>
                <td className="py-3 pr-4">{dato(p.profesion)}</td>
                <td className="py-3 pr-4">{fecha(p.fechaNacimiento)}</td>
                <td className="py-3 pr-4">{dato(p.domicilioCompleto)}</td>
                <td className="py-3 pr-4">{dato(p.domicilioElectronico)}</td>
                <td className="py-3">
                  <BotonOculta oculta={p.oculta} onClick={() => alAlternarOculta(p)} />
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

// Grupos de socios jurídicos (personas jurídicas citadas como socias de
// otras sociedades) que el pipeline no pudo resolver a una fila propia —
// ver 036_socios_juridicos.sql. "Vincular" crea (o reutiliza, si el CUIT ya
// existe) una sociedad real y repunta todos los vínculos del grupo. No hay
// paginación acá: son ~300 grupos en total, entra cómodo en una sola tabla.
function TablaSociosJuridicos() {
  const [grupos, setGrupos] = useState<SocioJuridicoGrupo[] | null>(null);
  const [ediciones, setEdiciones] = useState<Record<string, { nombre: string; cuit: string }>>({});
  const [vinculando, setVinculando] = useState<string | null>(null);

  useEffect(() => {
    obtenerSociosJuridicosAdmin()
      .then((d) => setGrupos(d.grupos))
      .catch(() => setGrupos([]));
  }, []);

  function campo(g: SocioJuridicoGrupo) {
    return ediciones[g.clave] ?? { nombre: g.nombreSugerido, cuit: g.cuitSugerido ?? "" };
  }

  function alEditar(clave: string, campoEditado: "nombre" | "cuit", valor: string, g: SocioJuridicoGrupo) {
    setEdiciones((e) => ({ ...e, [clave]: { ...campo(g), [campoEditado]: valor } }));
  }

  async function alVincular(g: SocioJuridicoGrupo) {
    const { nombre, cuit } = campo(g);
    setVinculando(g.clave);
    try {
      await vincularSocioJuridico(
        nombre,
        cuit.trim() || null,
        g.detalle.map((d) => d.vinculoId),
      );
      setGrupos((gs) => (gs ?? []).filter((x) => x.clave !== g.clave));
    } catch {
      // Se deja el grupo en la lista para reintentar; sin toast en este panel.
    } finally {
      setVinculando(null);
    }
  }

  return (
    <div className="rounded-3xl bg-white p-7">
      <p className="mb-4 text-sm text-carbon/50">
        {grupos === null ? "Cargando…" : `${grupos.length} socios jurídicos sin vincular`}
      </p>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left text-sm">
          <thead>
            <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
              <th className="py-3 pr-4">Nombre</th>
              <th className="py-3 pr-4">CUIT</th>
              <th className="py-3 pr-4">Citas</th>
              <th className="py-3 pr-4">Sociedades que lo citan</th>
              <th className="py-3"></th>
            </tr>
          </thead>
          <tbody>
            {(grupos ?? []).map((g) => {
              const { nombre, cuit } = campo(g);
              return (
                <tr key={g.clave} className="border-b border-carbon/5 last:border-0 align-top">
                  <td className="py-3 pr-4">
                    <input
                      value={nombre}
                      onChange={(e) => alEditar(g.clave, "nombre", e.target.value, g)}
                      className="w-56 rounded-lg border border-carbon/15 px-2.5 py-1.5 text-sm font-bold"
                    />
                  </td>
                  <td className="py-3 pr-4">
                    <input
                      value={cuit}
                      onChange={(e) => alEditar(g.clave, "cuit", e.target.value, g)}
                      placeholder="Sin CUIT"
                      className="w-32 rounded-lg border border-carbon/15 px-2.5 py-1.5 text-sm"
                    />
                  </td>
                  <td className="py-3 pr-4">{g.citas}</td>
                  <td className="py-3 pr-4 text-carbon/70">
                    {g.detalle
                      .slice(0, 4)
                      .map((d) => d.sociedadNombre)
                      .join(" · ")}
                    {g.detalle.length > 4 && ` +${g.detalle.length - 4} más`}
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      onClick={() => alVincular(g)}
                      disabled={vinculando === g.clave}
                      className="cursor-pointer rounded-full bg-vino px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-vino-oscuro disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {vinculando === g.clave ? "Vinculando…" : "Vincular"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
