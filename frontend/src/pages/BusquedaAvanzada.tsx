import { useLazyQuery, useQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlechaIcon } from "../components/FlechaIcon";
import { trackEvent } from "../lib/analytics";
import { useAuth } from "../lib/auth";
import { cuit as formatCuit, dato, fecha, haceDiasISO, hoyISO } from "../lib/format";
import { registrarBusqueda } from "../lib/historialApi";
import {
  BUSCAR_PERSONAS_AVANZADO,
  BUSCAR_SOCIEDADES_AVANZADO,
  FILTROS_BUSQUEDA_AVANZADA,
  type DataBusquedaAvanzada,
  type DataBusquedaPersonasAvanzada,
  type DataFiltrosBusquedaAvanzada,
} from "../lib/queries";

const POR_PAGINA = 100;

type Pestana = "sociedades" | "personas";

export default function BusquedaAvanzada() {
  const [pestana, setPestana] = useState<Pestana>("sociedades");

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
      <div className="relative mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold md:text-5xl">Búsqueda avanzada</h1>
        <p className="mt-3 text-lg text-carbon/60">
          Buscá sociedades o personas del Boletín Oficial de Mendoza con filtros combinados.
        </p>

        <div className="mt-8 flex gap-2 border-b border-carbon/10">
          <button
            type="button"
            onClick={() => setPestana("sociedades")}
            className={`cursor-pointer rounded-t-xl px-5 py-3 text-sm font-bold transition-colors ${
              pestana === "sociedades"
                ? "border-b-2 border-vino text-vino"
                : "text-carbon/50 hover:text-carbon"
            }`}
          >
            Sociedades
          </button>
          <button
            type="button"
            onClick={() => setPestana("personas")}
            className={`cursor-pointer rounded-t-xl px-5 py-3 text-sm font-bold transition-colors ${
              pestana === "personas"
                ? "border-b-2 border-vino text-vino"
                : "text-carbon/50 hover:text-carbon"
            }`}
          >
            Personas
          </button>
        </div>

        {pestana === "sociedades" ? <BusquedaSociedades /> : <BusquedaPersonas />}
      </div>
    </main>
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

function BusquedaSociedades() {
  const { usuario } = useAuth();
  const [hoy] = useState(hoyISO);
  // Ventana de 30 días por defecto: antes era solo "hoy", que casi siempre
  // mostraba 0 resultados en la primera carga. 30 días sigue siendo barato
  // (Seq Scan + sort en memoria, ~8ms medido con ~20k sociedades — sin esto
  // Postgres tiene que ordenar la base entera y el sort se derrama a disco,
  // ver conversación sobre costo de la búsqueda sin filtro de fecha).
  const [hace30] = useState(() => haceDiasISO(30));
  const [termino, setTermino] = useState("");
  const [grupoClae, setGrupoClae] = useState("");
  const [tipoSociedadId, setTipoSociedadId] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [fechaDesde, setFechaDesde] = useState(hace30);
  const [fechaHasta, setFechaHasta] = useState(hoy);
  const [pagina, setPagina] = useState(1);

  const { data: filtros } = useQuery<DataFiltrosBusquedaAvanzada>(FILTROS_BUSQUEDA_AVANZADA);
  const [buscar, { data, loading, called }] =
    useLazyQuery<DataBusquedaAvanzada>(BUSCAR_SOCIEDADES_AVANZADO);

  function ejecutarBusqueda(paginaDestino = 1) {
    setPagina(paginaDestino);
    return buscar({
      variables: {
        termino: termino.trim() || undefined,
        grupoClae: grupoClae || undefined,
        tipoSociedadId: tipoSociedadId ? Number(tipoSociedadId) : undefined,
        departamentoId: departamentoId ? Number(departamentoId) : undefined,
        fechaDesde: fechaDesde || undefined,
        fechaHasta: fechaHasta || undefined,
        first: POR_PAGINA,
        offset: (paginaDestino - 1) * POR_PAGINA,
      },
    });
  }

  // Al entrar, buscar con los valores por defecto (últimos 30 días).
  useEffect(() => {
    ejecutarBusqueda(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function limpiarFiltros() {
    setTermino("");
    setGrupoClae("");
    setTipoSociedadId("");
    setDepartamentoId("");
    setFechaDesde(hace30);
    setFechaHasta(hoy);
    setPagina(1);
    buscar({ variables: { fechaDesde: hace30, fechaHasta: hoy, first: POR_PAGINA, offset: 0 } });
  }

  const resultados = data?.buscarSociedadesAvanzado.nodes ?? [];
  const total = data?.buscarSociedadesAvanzado.totalCount ?? 0;
  const totalPaginas = Math.ceil(total / POR_PAGINA);
  const hayFiltrosActivos = Boolean(
    termino ||
      grupoClae ||
      tipoSociedadId ||
      departamentoId ||
      fechaDesde !== hace30 ||
      fechaHasta !== hoy,
  );

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ejecutarBusqueda(1).then((resultado) => {
            if (!usuario) return;
            const cantidad = resultado.data?.buscarSociedadesAvanzado.totalCount ?? 0;
            registrarBusqueda("sociedad_avanzada", termino.trim() || null, cantidad);
          });
          trackEvent("buscar_avanzada", {
            entidad: "sociedades",
            con_termino: Boolean(termino.trim()),
            grupo_clae: grupoClae || undefined,
            tipo_sociedad: Boolean(tipoSociedadId),
            departamento: Boolean(departamentoId),
          });
        }}
        className="mt-8 grid gap-5 rounded-3xl bg-white p-7 md:grid-cols-4"
      >
        <div className="md:col-span-4">
          <label
            htmlFor="termino"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Sociedad
          </label>
          <input
            id="termino"
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Nombre de la sociedad o CUIT…"
            className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          />
        </div>

        <div>
          <label
            htmlFor="tipoSociedad"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Tipo de sociedad
          </label>
          <select
            id="tipoSociedad"
            value={tipoSociedadId}
            onChange={(e) => setTipoSociedadId(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          >
            <option value="">Todos</option>
            {filtros?.allTiposSociedad.nodes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="grupoClae"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Grupo de actividad
          </label>
          <select
            id="grupoClae"
            value={grupoClae}
            onChange={(e) => setGrupoClae(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          >
            <option value="">Todos</option>
            {filtros?.allGruposClae.nodes.map((g) => (
              <option key={g.codigo} value={g.codigo}>
                {g.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="departamento"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Departamento
          </label>
          <select
            id="departamento"
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          >
            <option value="">Todos</option>
            {filtros?.allDepartamentos.nodes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:col-span-2">
          <div>
            <label
              htmlFor="desde"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
            >
              Constituida desde
            </label>
            <input
              id="desde"
              type="date"
              value={fechaDesde}
              max={fechaHasta || undefined}
              onChange={(e) => setFechaDesde(e.target.value)}
              className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
            />
          </div>

          <div>
            <label
              htmlFor="hasta"
              className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
            >
              Constituida hasta
            </label>
            <input
              id="hasta"
              type="date"
              value={fechaHasta}
              min={fechaDesde || undefined}
              onChange={(e) => setFechaHasta(e.target.value)}
              className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
            />
          </div>
        </div>

        <div className="flex items-end gap-3 md:col-span-4">
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-vino px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Buscar
          </button>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="cursor-pointer rounded-full px-6 py-3 text-sm font-bold text-carbon/60 transition-colors hover:text-vino"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        {loading && <p className="text-carbon/50">Buscando sociedades…</p>}

        {!loading && called && resultados.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-carbon/50">
            No encontramos sociedades con esos filtros.
          </p>
        )}

        {!loading && resultados.length > 0 && (
          <>
            <p className="mb-4 text-sm text-carbon/50">
              {total > POR_PAGINA
                ? `Mostrando ${resultados.length} sociedades de ${total.toLocaleString("es-AR")}`
                : `${total} sociedad${total === 1 ? "" : "es"} encontrada${total === 1 ? "" : "s"}`}
            </p>
            <div className="overflow-hidden rounded-3xl bg-white">
              {/* Mobile (< sm): una tarjeta por sociedad, con una fila por
                  dato en vez de columnas — en una tabla angosta el nombre se
                  parte en muchas líneas cortas. Desktop sigue con la tabla. */}
              <div className="divide-y divide-carbon/5 sm:hidden">
                {resultados.map((s) => {
                  const principal = s.sociedadActividadesBySociedadId.nodes.find(
                    (a) => a.orden === 1,
                  );
                  return (
                    <div key={s.id} className="px-6 py-4">
                      <Link
                        to={`/sociedad/${s.id}`}
                        className="font-bold text-vino underline-offset-4 hover:underline"
                      >
                        {s.nombre}
                      </Link>
                      <p className="mt-0.5 text-xs text-carbon/50">
                        {s.tipoSociedadByTipoSociedadId?.nombre ?? ""}
                        {s.cuit ? ` · ${formatCuit(s.cuit)}` : ""}
                      </p>
                      <p className="mt-2 text-sm text-carbon/80">
                        {dato(principal?.grupoClaeByClaeGrupo?.nombre)}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-carbon/50">
                        <span>
                          {dato(
                            s.domicilioByDomicilioId?.localidadByLocalidadId
                              ?.departamentoByDepartamentoId?.nombre,
                          )}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{fecha(s.fechaConstitucion)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <table className="hidden w-full text-left text-sm sm:table">
                <thead>
                  <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Actividad principal</th>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">Constitución</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((s) => {
                    const principal = s.sociedadActividadesBySociedadId.nodes.find(
                      (a) => a.orden === 1,
                    );
                    return (
                      <tr key={s.id} className="border-b border-carbon/5 last:border-0">
                        <td className="px-6 py-4">
                          <Link
                            to={`/sociedad/${s.id}`}
                            className="font-bold text-vino underline-offset-4 hover:underline"
                          >
                            {s.nombre}
                          </Link>
                          <span className="block text-xs text-carbon/50">
                            {s.tipoSociedadByTipoSociedadId?.nombre ?? ""}
                            {s.cuit ? ` · ${formatCuit(s.cuit)}` : ""}
                          </span>
                        </td>
                        <td className="px-6 py-4">{dato(principal?.grupoClaeByClaeGrupo?.nombre)}</td>
                        <td className="px-6 py-4">
                          {dato(
                            s.domicilioByDomicilioId?.localidadByLocalidadId
                              ?.departamentoByDepartamentoId?.nombre,
                          )}
                        </td>
                        <td className="px-6 py-4">{fecha(s.fechaConstitucion)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={ejecutarBusqueda} />
          </>
        )}
      </div>
    </>
  );
}

function BusquedaPersonas() {
  const { usuario } = useAuth();
  const [termino, setTermino] = useState("");
  const [departamentoId, setDepartamentoId] = useState("");
  const [fechaNacDesde, setFechaNacDesde] = useState("");
  const [fechaNacHasta, setFechaNacHasta] = useState("");
  const [pagina, setPagina] = useState(1);

  const { data: filtros } = useQuery<DataFiltrosBusquedaAvanzada>(FILTROS_BUSQUEDA_AVANZADA);
  const [buscar, { data, loading, called }] =
    useLazyQuery<DataBusquedaPersonasAvanzada>(BUSCAR_PERSONAS_AVANZADO);

  function ejecutarBusqueda(paginaDestino = 1) {
    setPagina(paginaDestino);
    return buscar({
      variables: {
        termino: termino.trim() || undefined,
        departamentoId: departamentoId ? Number(departamentoId) : undefined,
        fechaNacDesde: fechaNacDesde || undefined,
        fechaNacHasta: fechaNacHasta || undefined,
        first: POR_PAGINA,
        offset: (paginaDestino - 1) * POR_PAGINA,
      },
    });
  }

  // A diferencia de sociedades, acá no hay un default de fecha razonable
  // (filtrar por "nacida hoy" no tiene sentido) — al entrar se muestra la
  // primera página sin filtros, ordenada por nombre.
  useEffect(() => {
    ejecutarBusqueda(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function limpiarFiltros() {
    setTermino("");
    setDepartamentoId("");
    setFechaNacDesde("");
    setFechaNacHasta("");
    setPagina(1);
    buscar({ variables: { first: POR_PAGINA, offset: 0 } });
  }

  const resultados = data?.buscarPersonasAvanzado.nodes ?? [];
  const total = data?.buscarPersonasAvanzado.totalCount ?? 0;
  const totalPaginas = Math.ceil(total / POR_PAGINA);
  const hayFiltrosActivos = Boolean(termino || departamentoId || fechaNacDesde || fechaNacHasta);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          ejecutarBusqueda(1).then((resultado) => {
            if (!usuario) return;
            const cantidad = resultado.data?.buscarPersonasAvanzado.totalCount ?? 0;
            registrarBusqueda("persona_avanzada", termino.trim() || null, cantidad);
          });
          trackEvent("buscar_avanzada", {
            entidad: "personas",
            con_termino: Boolean(termino.trim()),
            departamento: Boolean(departamentoId),
            con_rango_nacimiento: Boolean(fechaNacDesde || fechaNacHasta),
          });
        }}
        className="mt-8 grid gap-5 rounded-3xl bg-white p-7 md:grid-cols-4"
      >
        <div className="md:col-span-4">
          <label
            htmlFor="terminoPersona"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Persona
          </label>
          <input
            id="terminoPersona"
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            placeholder="Nombre de la persona o CUIT/DNI…"
            className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          />
        </div>

        <div>
          <label
            htmlFor="departamentoPersona"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Departamento
          </label>
          <select
            id="departamentoPersona"
            value={departamentoId}
            onChange={(e) => setDepartamentoId(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 bg-white px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          >
            <option value="">Todos</option>
            {filtros?.allDepartamentos.nodes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="nacDesde"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Nacida/o desde
          </label>
          <input
            id="nacDesde"
            type="date"
            value={fechaNacDesde}
            max={fechaNacHasta || undefined}
            onChange={(e) => setFechaNacDesde(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          />
        </div>

        <div>
          <label
            htmlFor="nacHasta"
            className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-carbon/50"
          >
            Nacida/o hasta
          </label>
          <input
            id="nacHasta"
            type="date"
            value={fechaNacHasta}
            min={fechaNacDesde || undefined}
            onChange={(e) => setFechaNacHasta(e.target.value)}
            className="w-full rounded-xl border border-carbon/15 px-3.5 py-2.5 outline-none transition-colors focus:border-vino"
          />
        </div>

        <div className="flex items-end gap-3 md:col-span-4">
          <button
            type="submit"
            className="cursor-pointer rounded-full bg-vino px-8 py-3 text-sm font-bold text-white transition-transform hover:scale-105"
          >
            Buscar
          </button>
          {hayFiltrosActivos && (
            <button
              type="button"
              onClick={limpiarFiltros}
              className="cursor-pointer rounded-full px-6 py-3 text-sm font-bold text-carbon/60 transition-colors hover:text-vino"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </form>

      <div className="mt-10">
        {loading && <p className="text-carbon/50">Buscando personas…</p>}

        {!loading && called && resultados.length === 0 && (
          <p className="rounded-2xl bg-white p-8 text-center text-carbon/50">
            No encontramos personas con esos filtros.
          </p>
        )}

        {!loading && resultados.length > 0 && (
          <>
            <p className="mb-4 text-sm text-carbon/50">
              {total > POR_PAGINA
                ? `Mostrando ${resultados.length} personas de ${total.toLocaleString("es-AR")}`
                : `${total} persona${total === 1 ? "" : "s"} encontrada${total === 1 ? "" : "s"}`}
            </p>
            <div className="overflow-hidden rounded-3xl bg-white">
              {/* Mobile (< sm): una tarjeta por persona, una fila por dato —
                  ver el mismo criterio en BusquedaSociedades. */}
              <div className="divide-y divide-carbon/5 sm:hidden">
                {resultados.map((p) => (
                  <div key={p.id} className="px-6 py-4">
                    <Link
                      to={`/persona/${p.id}`}
                      className="font-bold text-vino underline-offset-4 hover:underline"
                    >
                      {p.nombre}
                    </Link>
                    <p className="mt-0.5 text-xs text-carbon/50">
                      {p.cuit ? formatCuit(p.cuit) : p.documento ? `DNI ${p.documento}` : ""}
                    </p>
                    <p className="mt-2 text-sm text-carbon/80">{dato(p.profesion)}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-2 text-xs text-carbon/50">
                      <span>
                        {dato(p.domicilioByDomicilioId?.localidadByLocalidadId?.departamentoByDepartamentoId?.nombre)}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{fecha(p.fechaNacimiento)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <table className="hidden w-full text-left text-sm sm:table">
                <thead>
                  <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">Profesión</th>
                    <th className="px-6 py-4">Departamento</th>
                    <th className="px-6 py-4">Nacimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {resultados.map((p) => (
                    <tr key={p.id} className="border-b border-carbon/5 last:border-0">
                      <td className="px-6 py-4">
                        <Link
                          to={`/persona/${p.id}`}
                          className="font-bold text-vino underline-offset-4 hover:underline"
                        >
                          {p.nombre}
                        </Link>
                        <span className="block text-xs text-carbon/50">
                          {p.cuit ? formatCuit(p.cuit) : p.documento ? `DNI ${p.documento}` : ""}
                        </span>
                      </td>
                      <td className="px-6 py-4">{dato(p.profesion)}</td>
                      <td className="px-6 py-4">
                        {dato(p.domicilioByDomicilioId?.localidadByLocalidadId?.departamentoByDepartamentoId?.nombre)}
                      </td>
                      <td className="px-6 py-4">{fecha(p.fechaNacimiento)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Paginador pagina={pagina} totalPaginas={totalPaginas} onCambiar={ejecutarBusqueda} />
          </>
        )}
      </div>
    </>
  );
}
