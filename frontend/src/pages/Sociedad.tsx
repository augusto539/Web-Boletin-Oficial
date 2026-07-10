import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { FlechaIcon } from "../components/FlechaIcon";
import { GrafoSociedad } from "../components/GrafoSociedad";
import { Reveal } from "../components/Reveal";
import { SearchBox } from "../components/SearchBox";
import {
  cuit as formatCuit,
  dato,
  enlaceBoletin,
  fecha,
  moneda,
  porcentaje,
  siNo,
  SIN_DATO,
} from "../lib/format";
import { SOCIEDAD, type Acto, type Actividad, type DataSociedad, type Vinculo } from "../lib/queries";

export default function Sociedad() {
  const { id } = useParams();
  const { data, loading, error } = useQuery<DataSociedad>(SOCIEDAD, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white pt-18">
        <p className="text-carbon/50">Cargando sociedad…</p>
      </main>
    );
  }

  const sociedad = data?.sociedadById;

  if (error || !sociedad) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-18">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold">No encontramos esa sociedad</h1>
          <p className="mt-3 mb-8 text-carbon/60">
            Puede que el enlace esté vencido o que la sociedad no exista en la base. Probá buscarla
            por nombre:
          </p>
          <SearchBox />
        </div>
      </main>
    );
  }

  const domicilio = sociedad.domicilioByDomicilioId;
  const actividades = [...sociedad.sociedadActividadesBySociedadId.nodes].sort(
    (a, b) => (a.orden ?? 99) - (b.orden ?? 99),
  );
  const vinculos = agruparVinculos(sociedad.vinculosBySociedadId.nodes);
  const actos = agruparActos(sociedad.actosBySociedadId.nodes);

  return (
    <main className="min-h-screen bg-white">
      {/* Encabezado */}
      <section className="bg-vino px-6 pt-32 pb-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/50">
            {sociedad.tipoSociedadByTipoSociedadId?.nombre ?? "Sociedad"}
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">{sociedad.nombre}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {sociedad.cuit && <span className="text-white/70">CUIT {formatCuit(sociedad.cuit)}</span>}
            {sociedad.fechaConstitucion && (
              <span className="text-white/70">
                Constituida el {fecha(sociedad.fechaConstitucion)}
              </span>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
        {/* Datos generales */}
        <Reveal>
          <section>
            <TituloSeccion>Datos generales</TituloSeccion>
            <dl className="grid gap-x-10 gap-y-6 md:grid-cols-3">
              <Campo etiqueta="Capital inicial" valor={moneda(sociedad.capitalInicial)} />
              <Campo etiqueta="Empleador" valor={siNo(sociedad.empleador)} />
              <Campo
                etiqueta="Impuesto a las Ganancias"
                valor={dato(sociedad.estadoGananciasByEstadoGananciasId?.nombre)}
              />
              <Campo etiqueta="IVA" valor={dato(sociedad.estadoIvaByEstadoIvaId?.nombre)} />
              <Campo
                etiqueta="Cotejo con ARCA"
                valor={dato(sociedad.tipoMatchArcaByTipoMatchArcaId?.nombre)}
              />
              <Campo
                etiqueta="Domicilio"
                valor={
                  domicilio
                    ? `${domicilio.domicilioCompleto}${
                        domicilio.localidadByLocalidadId
                          ? ` (${domicilio.localidadByLocalidadId.nombre}${
                              domicilio.localidadByLocalidadId.departamentoByDepartamentoId
                                ? `, ${domicilio.localidadByLocalidadId.departamentoByDepartamentoId.nombre}`
                                : ""
                            })`
                          : ""
                      }`
                    : SIN_DATO
                }
              />
              <div className="md:col-span-3">
                <Campo etiqueta="Objeto social" valor={dato(sociedad.objetoSocial)} />
              </div>
            </dl>
          </section>
        </Reveal>

        {/* Actividades CLAE */}
        <Reveal>
          <section>
            <TituloSeccion>Actividades (CLAE)</TituloSeccion>
            {actividades.length === 0 ? (
              <Vacio texto="Sin actividades registradas." />
            ) : (
              <ul className="flex flex-wrap gap-3">
                {actividades.map((a) => (
                  <EtiquetaActividad key={a.id} actividad={a} />
                ))}
              </ul>
            )}
          </section>
        </Reveal>

        {/* Vínculos */}
        <Reveal>
          <section>
            <TituloSeccion>Socios y autoridades</TituloSeccion>
            {vinculos.length === 0 ? (
              <Vacio texto="Sin vínculos registrados. El Boletín no siempre publica la nómina completa." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                      <th className="py-3 pr-4">Nombre</th>
                      <th className="py-3 pr-4">Rol</th>
                      <th className="py-3 pr-4">Participación</th>
                      <th className="py-3 pr-4">Ingreso</th>
                      <th className="py-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vinculos.map((v) => (
                      <FilaVinculo key={v.clave} vinculo={v} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Reveal>

        {/* Historial de actos */}
        <Reveal>
          <section>
            <TituloSeccion>Historial de actos</TituloSeccion>
            {actos.length === 0 ? (
              <Vacio texto="Sin actos registrados." />
            ) : (
              <ol className="relative space-y-10 border-l-2 border-humo pl-8">
                {actos.map((acto) => (
                  <ItemActo key={acto.clave} acto={acto} />
                ))}
              </ol>
            )}
          </section>
        </Reveal>

        {/* Grafo */}
        <Reveal>
          <section>
            <TituloSeccion>Red de vínculos</TituloSeccion>
            <p className="mb-6 -mt-4 text-carbon/60">
              Personas y sociedades conectadas con {sociedad.nombre}. Hacé click en otra sociedad
              para explorar su red.
            </p>
            <GrafoSociedad sociedadId={sociedad.id} nombre={sociedad.nombre} />
          </section>
        </Reveal>
      </div>
    </main>
  );
}

function TituloSeccion({ children }: { children: React.ReactNode }) {
  return <h2 className="mb-8 text-3xl font-bold">{children}</h2>;
}

function Campo({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  const vacio = valor === SIN_DATO;
  return (
    <div>
      <dt className="text-xs uppercase tracking-widest text-carbon/50">{etiqueta}</dt>
      <dd className={`mt-1.5 leading-relaxed ${vacio ? "text-carbon/35" : "text-carbon"}`}>
        {vacio ? "No publicado" : valor}
      </dd>
    </div>
  );
}

function Vacio({ texto }: { texto: string }) {
  return <p className="rounded-2xl bg-humo p-6 text-sm text-carbon/50">{texto}</p>;
}

function EtiquetaActividad({ actividad: a }: { actividad: Actividad }) {
  const principal = a.orden === 1;
  const baja = a.estado === "BD";
  return (
    <li
      className={`rounded-full px-5 py-2.5 text-sm ${
        baja
          ? "bg-humo text-carbon/40 line-through"
          : principal
            ? "bg-vino font-bold text-white"
            : "bg-humo text-carbon"
      }`}
    >
      {a.actividadClaeByClaeCodigo
        ? `${a.actividadClaeByClaeCodigo.codigo} — ${a.actividadClaeByClaeCodigo.descripcion}`
        : SIN_DATO}
      {a.grupoClaeByClaeGrupo && (
        <span className="opacity-70"> ({a.grupoClaeByClaeGrupo.nombre})</span>
      )}
      {principal && " · principal"}
    </li>
  );
}

// Una misma persona puede tener varios vínculos con la misma sociedad al
// mismo tiempo (ej: Socio y Presidente, dados de alta juntos o por separado).
// Se agrupan por "quién es" + vigencia para mostrar una sola fila con los
// roles combinados ("Socio y Presidente") en vez de una fila por rol.
interface VinculoAgrupado {
  clave: string;
  personaFisicaByPersonaId: Vinculo["personaFisicaByPersonaId"];
  sociedadBySociedadMiembroId: Vinculo["sociedadBySociedadMiembroId"];
  nombreJuridicoFallback: string | null;
  cuitJuridicoFallback: string | null;
  roles: string[];
  porcentaje: string | null;
  fechaEntrada: string | null;
  fechaSalida: string | null;
}

function agruparVinculos(vinculos: Vinculo[]): VinculoAgrupado[] {
  const grupos = new Map<string, VinculoAgrupado>();
  for (const v of vinculos) {
    const quien =
      v.personaFisicaByPersonaId?.id ??
      v.sociedadBySociedadMiembroId?.id ??
      `fallback-${v.nombreJuridicoFallback}`;
    const clave = `${quien}-${v.fechaSalida ? "baja" : "vigente"}`;
    const existente = grupos.get(clave);
    const rol = v.rolByRolId?.nombre;
    if (existente) {
      if (rol && !existente.roles.includes(rol)) existente.roles.push(rol);
      if (!existente.porcentaje && v.porcentaje) existente.porcentaje = v.porcentaje;
      if (v.fechaEntrada && (!existente.fechaEntrada || v.fechaEntrada < existente.fechaEntrada)) {
        existente.fechaEntrada = v.fechaEntrada;
      }
    } else {
      grupos.set(clave, {
        clave,
        personaFisicaByPersonaId: v.personaFisicaByPersonaId,
        sociedadBySociedadMiembroId: v.sociedadBySociedadMiembroId,
        nombreJuridicoFallback: v.nombreJuridicoFallback,
        cuitJuridicoFallback: v.cuitJuridicoFallback,
        roles: rol ? [rol] : [],
        porcentaje: v.porcentaje,
        fechaEntrada: v.fechaEntrada,
        fechaSalida: v.fechaSalida,
      });
    }
  }
  return [...grupos.values()];
}

// "Socio" / "Socio y Presidente" / "Socio, Presidente y Apoderado"
function listaConY(items: string[]): string {
  if (items.length === 0) return SIN_DATO;
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function FilaVinculo({ vinculo: v }: { vinculo: VinculoAgrupado }) {
  const vigente = !v.fechaSalida;
  return (
    <tr className="border-b border-carbon/5">
      <td className="py-4 pr-4">
        {v.personaFisicaByPersonaId ? (
          <>
            <Link
              to={`/persona/${v.personaFisicaByPersonaId.id}`}
              className="font-bold text-vino underline-offset-4 hover:underline"
            >
              {v.personaFisicaByPersonaId.nombre} <FlechaIcon className="ml-1" />
            </Link>
            {v.personaFisicaByPersonaId.profesion && (
              <span className="block text-xs text-carbon/50">
                {v.personaFisicaByPersonaId.profesion}
              </span>
            )}
          </>
        ) : v.sociedadBySociedadMiembroId ? (
          <Link
            to={`/sociedad/${v.sociedadBySociedadMiembroId.id}`}
            className="font-bold text-vino underline-offset-4 hover:underline"
          >
            {v.sociedadBySociedadMiembroId.nombre} <FlechaIcon className="ml-1" />
          </Link>
        ) : (
          <>
            <span className="font-bold">{v.nombreJuridicoFallback ?? SIN_DATO}</span>
            <span className="ml-2 rounded-full bg-humo px-2.5 py-0.5 text-xs text-carbon/50">
              aún no relevada
            </span>
            {v.cuitJuridicoFallback && (
              <span className="block text-xs text-carbon/50">CUIT {formatCuit(v.cuitJuridicoFallback)}</span>
            )}
          </>
        )}
      </td>
      <td className="py-4 pr-4">{listaConY(v.roles)}</td>
      <td className="py-4 pr-4">{porcentaje(v.porcentaje)}</td>
      <td className="py-4 pr-4">{fecha(v.fechaEntrada)}</td>
      <td className="py-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            vigente ? "bg-vino/10 text-vino" : "bg-humo text-carbon/50"
          }`}
        >
          {vigente ? "Vigente" : `Baja ${fecha(v.fechaSalida)}`}
        </span>
      </td>
    </tr>
  );
}

// El pipeline a veces carga el mismo acto dos veces (ej: el mismo aviso
// procesado de más de un boletín, o duplicado en la misma edición). Se
// agrupan por contenido — sin la fecha del acto ni el boletín, que son
// justamente los datos que pueden variar entre duplicados — y se muestran
// una sola vez, listando todas las fechas/fuentes que lo citan.
interface ActoAgrupado {
  clave: string;
  tipoActoByTipoActoId: Acto["tipoActoByTipoActoId"];
  descripcion: string | null;
  capitalAnterior: string | null;
  capitalNuevo: string | null;
  personaFisicaByEscribanoId: Acto["personaFisicaByEscribanoId"];
  registroNotarial: string | null;
  fechasActo: string[];
  fuentes: Array<{ fecha: string; nroEdicion: string | null; enlace: string | null }>;
  fechaOrden: string;
}

function agruparActos(actos: Acto[]): ActoAgrupado[] {
  const grupos = new Map<string, ActoAgrupado>();
  for (const a of actos) {
    const clave = [
      a.tipoActoByTipoActoId?.nombre ?? "",
      a.descripcion ?? "",
      a.capitalAnterior ?? "",
      a.capitalNuevo ?? "",
      a.personaFisicaByEscribanoId?.nombre ?? "",
      a.registroNotarial ?? "",
    ].join("|");

    const boletin = a.boletinByBoletinId;
    const fuente = boletin
      ? { fecha: boletin.fecha, nroEdicion: boletin.nroEdicion, enlace: enlaceBoletin(boletin) }
      : null;
    const fechaActo = a.fechaActo ?? a.fechaPublicacion;

    const existente = grupos.get(clave);
    if (existente) {
      if (fechaActo && !existente.fechasActo.includes(fechaActo)) existente.fechasActo.push(fechaActo);
      if (fuente && !existente.fuentes.some((f) => f.fecha === fuente.fecha)) {
        existente.fuentes.push(fuente);
      }
      if (a.fechaPublicacion && a.fechaPublicacion > existente.fechaOrden) {
        existente.fechaOrden = a.fechaPublicacion;
      }
    } else {
      grupos.set(clave, {
        clave,
        tipoActoByTipoActoId: a.tipoActoByTipoActoId,
        descripcion: a.descripcion,
        capitalAnterior: a.capitalAnterior,
        capitalNuevo: a.capitalNuevo,
        personaFisicaByEscribanoId: a.personaFisicaByEscribanoId,
        registroNotarial: a.registroNotarial,
        fechasActo: fechaActo ? [fechaActo] : [],
        fuentes: fuente ? [fuente] : [],
        fechaOrden: a.fechaPublicacion ?? "",
      });
    }
  }
  return [...grupos.values()].sort((a, b) => b.fechaOrden.localeCompare(a.fechaOrden));
}

function ItemActo({ acto }: { acto: ActoAgrupado }) {
  return (
    <li className="relative">
      <span className="absolute top-1.5 -left-[39px] h-3.5 w-3.5 rounded-full bg-vino" />
      <p className="text-xs uppercase tracking-widest text-carbon/50">
        {acto.fechasActo.length > 1
          ? acto.fechasActo.map((f) => fecha(f)).join(" y ")
          : fecha(acto.fechasActo[0])}
      </p>
      <h3 className="mt-1 text-xl font-bold">{acto.tipoActoByTipoActoId?.nombre ?? "Acto"}</h3>
      {acto.descripcion && <p className="mt-1 text-carbon/70">{acto.descripcion}</p>}
      {(acto.capitalAnterior || acto.capitalNuevo) && (
        <p className="mt-1 text-sm text-carbon/60">
          Capital: {moneda(acto.capitalAnterior)} → {moneda(acto.capitalNuevo)}
        </p>
      )}
      {acto.personaFisicaByEscribanoId && (
        <p className="mt-1 text-sm text-carbon/60">
          Escribano/a: {acto.personaFisicaByEscribanoId.nombre}
          {acto.registroNotarial ? ` · ${acto.registroNotarial}` : ""}
        </p>
      )}
      {acto.fuentes.length > 0 && (
        <p className="mt-2 text-sm">
          <span className="text-carbon/50">{acto.fuentes.length > 1 ? "Fuentes: " : "Fuente: "}</span>
          {acto.fuentes.map((f, i) => (
            <span key={f.fecha}>
              {i > 0 && ", "}
              {f.enlace ? (
                <a
                  href={f.enlace}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-vino underline-offset-4 hover:underline"
                >
                  Boletín Oficial{f.nroEdicion ? ` N.º ${f.nroEdicion}` : ""} — {fecha(f.fecha)}{" "}
                  <FlechaIcon className="ml-1" />
                </a>
              ) : (
                <span>
                  Boletín Oficial{f.nroEdicion ? ` N.º ${f.nroEdicion}` : ""} — {fecha(f.fecha)}
                </span>
              )}
            </span>
          ))}
        </p>
      )}
    </li>
  );
}
