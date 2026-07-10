import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router-dom";
import { GrafoPersona } from "../components/GrafoPersona";
import { Reveal } from "../components/Reveal";
import { SearchBox } from "../components/SearchBox";
import { cuit as formatCuit, dato, enlaceBoletin, fecha, porcentaje, SIN_DATO } from "../lib/format";
import { PERSONA, type DataPersona, type VinculoPersona } from "../lib/queries";

export default function Persona() {
  const { id } = useParams();
  const { data, loading, error } = useQuery<DataPersona>(PERSONA, {
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white pt-18">
        <p className="text-carbon/50">Cargando persona…</p>
      </main>
    );
  }

  const persona = data?.personaFisicaById;

  if (error || !persona) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-humo px-6 pt-18">
        <div className="w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold">No encontramos esa persona</h1>
          <p className="mt-3 mb-8 text-carbon/60">
            Puede que el enlace esté vencido o que la persona no exista en la base. Probá buscarla
            por nombre:
          </p>
          <SearchBox />
        </div>
      </main>
    );
  }

  const domicilio = persona.domicilioByDomicilioId;
  const sociedades = agruparSociedades(persona.vinculosByPersonaId.nodes);

  return (
    <main className="min-h-screen bg-white">
      {/* Encabezado */}
      <section className="bg-vino px-6 pt-32 pb-14 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-white/50">
            {persona.profesion ?? "Persona física"}
          </p>
          <h1 className="text-4xl font-bold md:text-6xl">{persona.nombre}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
            {persona.documento && <span className="text-white/70">DNI {persona.documento}</span>}
            {persona.cuit && <span className="text-white/70">CUIT {formatCuit(persona.cuit)}</span>}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl space-y-20 px-6 py-16">
        {/* Datos generales */}
        <Reveal>
          <section>
            <TituloSeccion>Datos generales</TituloSeccion>
            <dl className="grid gap-x-10 gap-y-6 md:grid-cols-3">
              <Campo etiqueta="DNI" valor={dato(persona.documento)} />
              <Campo
                etiqueta="CUIT"
                valor={persona.cuit ? formatCuit(persona.cuit) : SIN_DATO}
              />
              <Campo etiqueta="Profesión" valor={dato(persona.profesion)} />
              <Campo etiqueta="Fecha de nacimiento" valor={fecha(persona.fechaNacimiento)} />
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
              <Campo etiqueta="Domicilio electrónico" valor={dato(persona.domicilioElectronico)} />
            </dl>
          </section>
        </Reveal>

        {/* Sociedades */}
        <Reveal>
          <section>
            <TituloSeccion>Sociedades</TituloSeccion>
            {sociedades.length === 0 ? (
              <Vacio texto="No forma ni formó parte de ninguna sociedad registrada en la base." />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                      <th className="py-3 pr-4">Sociedad</th>
                      <th className="py-3 pr-4">Rol</th>
                      <th className="py-3 pr-4">Participación</th>
                      <th className="py-3 pr-4">Ingreso</th>
                      <th className="py-3 pr-4">Estado</th>
                      <th className="py-3">Fuente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sociedades.map((s) => (
                      <FilaSociedad key={s.clave} sociedad={s} />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </Reveal>

        {/* Grafo */}
        <Reveal>
          <section>
            <TituloSeccion>Red de vínculos</TituloSeccion>
            <p className="mb-6 -mt-4 text-carbon/60">
              Sociedades de las que {persona.nombre} es o fue socia. Hacé click en una sociedad
              para ver su ficha.
            </p>
            <GrafoPersona personaId={persona.id} nombre={persona.nombre} />
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

// Igual criterio que agruparVinculos en Sociedad.tsx, pero desde el otro
// lado: acá "quién" es fijo (la persona) y se agrupa por sociedad+vigencia,
// para mostrar una sola fila con los roles combinados ("Socio y Presidente")
// en vez de una fila por rol.
interface SociedadAgrupada {
  clave: string;
  sociedad: { id: string; nombre: string } | null;
  roles: string[];
  porcentaje: string | null;
  fechaEntrada: string | null;
  fechaSalida: string | null;
  fuente: { fecha: string; nroEdicion: string | null; enlace: string | null } | null;
}

function agruparSociedades(vinculos: VinculoPersona[]): SociedadAgrupada[] {
  const grupos = new Map<string, SociedadAgrupada>();
  for (const v of vinculos) {
    const sociedadId = v.sociedadBySociedadId?.id ?? `sin-sociedad-${v.id}`;
    const clave = `${sociedadId}-${v.fechaSalida ? "baja" : "vigente"}`;
    const rol = v.rolByRolId?.nombre;
    const boletin = v.actoByActoAltaId?.boletinByBoletinId;
    const fuente = boletin
      ? { fecha: boletin.fecha, nroEdicion: boletin.nroEdicion, enlace: enlaceBoletin(boletin) }
      : null;

    const existente = grupos.get(clave);
    if (existente) {
      if (rol && !existente.roles.includes(rol)) existente.roles.push(rol);
      if (!existente.porcentaje && v.porcentaje) existente.porcentaje = v.porcentaje;
      if (v.fechaEntrada && (!existente.fechaEntrada || v.fechaEntrada < existente.fechaEntrada)) {
        existente.fechaEntrada = v.fechaEntrada;
      }
      if (!existente.fuente && fuente) existente.fuente = fuente;
    } else {
      grupos.set(clave, {
        clave,
        sociedad: v.sociedadBySociedadId,
        roles: rol ? [rol] : [],
        porcentaje: v.porcentaje,
        fechaEntrada: v.fechaEntrada,
        fechaSalida: v.fechaSalida,
        fuente,
      });
    }
  }
  return [...grupos.values()].sort((a, b) => (b.fechaEntrada ?? "").localeCompare(a.fechaEntrada ?? ""));
}

function listaConY(items: string[]): string {
  if (items.length === 0) return SIN_DATO;
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(", ")} y ${items[items.length - 1]}`;
}

function FilaSociedad({ sociedad: s }: { sociedad: SociedadAgrupada }) {
  const vigente = !s.fechaSalida;
  return (
    <tr className="border-b border-carbon/5">
      <td className="py-4 pr-4">
        {s.sociedad ? (
          <Link
            to={`/sociedad/${s.sociedad.id}`}
            className="font-bold text-vino underline-offset-4 hover:underline"
          >
            {s.sociedad.nombre} ↗
          </Link>
        ) : (
          <span className="font-bold">{SIN_DATO}</span>
        )}
      </td>
      <td className="py-4 pr-4">{listaConY(s.roles)}</td>
      <td className="py-4 pr-4">{porcentaje(s.porcentaje)}</td>
      <td className="py-4 pr-4">{fecha(s.fechaEntrada)}</td>
      <td className="py-4 pr-4">
        <span
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            vigente ? "bg-vino/10 text-vino" : "bg-humo text-carbon/50"
          }`}
        >
          {vigente ? "Vigente" : `Baja ${fecha(s.fechaSalida)}`}
        </span>
      </td>
      <td className="py-4">
        {s.fuente?.enlace ? (
          <a
            href={s.fuente.enlace}
            target="_blank"
            rel="noreferrer"
            className="font-bold text-vino underline-offset-4 hover:underline"
          >
            Boletín Oficial{s.fuente.nroEdicion ? ` N.º ${s.fuente.nroEdicion}` : ""} —{" "}
            {fecha(s.fuente.fecha)} ↗
          </a>
        ) : s.fuente ? (
          <span>
            Boletín Oficial{s.fuente.nroEdicion ? ` N.º ${s.fuente.nroEdicion}` : ""} —{" "}
            {fecha(s.fuente.fecha)}
          </span>
        ) : (
          SIN_DATO
        )}
      </td>
    </tr>
  );
}
