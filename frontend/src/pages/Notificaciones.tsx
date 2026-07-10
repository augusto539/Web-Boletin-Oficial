import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cuit as formatCuit, fecha } from "../lib/format";
import {
  BUSCAR_PERSONAS,
  BUSCAR_PERSONAS_POR_CUIT,
  BUSCAR_SOCIEDADES,
  BUSCAR_SOCIEDADES_POR_CUIT,
  type DataBusqueda,
  type DataBusquedaPersonas,
  type DataBusquedaPersonasPorCuit,
  type DataBusquedaPorCuit,
  type Id,
} from "../lib/queries";

// Solo UI por ahora: no hay tabla de notificaciones en la base ni envío de
// mails. La lista se guarda en localStorage para poder mostrar/borrar algo
// mientras se define el backend (una tabla de notificaciones + un job que
// las cruce contra los boletines nuevos).
const CLAVE_STORAGE = "notificaciones_activas";

// Mock: hasta que haya sesión real, mostramos un mail de ejemplo. En el
// producto final este campo no se pide en el formulario — se usa
// automáticamente el mail con el que la persona se registró.
const EMAIL_CUENTA = "vos@tu-mail.com";

type TipoEntidad = "sociedad" | "persona";
type ModoBusqueda = "nombre" | "cuit";

interface EntidadElegida {
  tipo: TipoEntidad;
  // null cuando la notificación se crea a mano para un CUIT/DNI que no
  // encontramos en la base (todavía no tiene ficha propia).
  id: Id | null;
  nombre: string;
  cuit: string | null;
}

interface Notificacion extends EntidadElegida {
  clave: string;
  creadaEl: string;
}

function cargarNotificaciones(): Notificacion[] {
  try {
    const crudo = localStorage.getItem(CLAVE_STORAGE);
    return crudo ? (JSON.parse(crudo) as Notificacion[]) : [];
  } catch {
    return [];
  }
}

function guardarNotificaciones(notificaciones: Notificacion[]) {
  localStorage.setItem(CLAVE_STORAGE, JSON.stringify(notificaciones));
}

const MIN_CARACTERES: Record<ModoBusqueda, number> = { nombre: 2, cuit: 3 };

// Dos notificaciones son "la misma" si comparten id (cuando la entidad
// tiene ficha en la base) o, para las cargadas a mano sin id, si comparten
// tipo y CUIT/DNI (comparando solo dígitos).
function coincide(a: EntidadElegida, b: EntidadElegida): boolean {
  if (a.tipo !== b.tipo) return false;
  if (a.id !== null && b.id !== null) return a.id === b.id;
  if (a.id !== null || b.id !== null) return false;
  const digitosA = (a.cuit ?? "").replace(/\D/g, "");
  const digitosB = (b.cuit ?? "").replace(/\D/g, "");
  return digitosA !== "" && digitosA === digitosB;
}

// Un solo campo de búsqueda (como en Búsqueda avanzada): si el término es
// mayormente dígitos lo tratamos como CUIT/DNI, si no, como nombre.
function pareceCuitODni(termino: string): boolean {
  const digitos = termino.replace(/\D/g, "");
  return digitos.length >= 3 && digitos.length >= termino.replace(/\s/g, "").length - 2;
}

export default function Notificaciones() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

  useEffect(() => {
    setNotificaciones(cargarNotificaciones());
  }, []);

  function agregarNotificacion(entidad: EntidadElegida) {
    setNotificaciones((prev) => {
      if (prev.some((n) => coincide(n, entidad))) return prev;
      const siguiente = [
        ...prev,
        { ...entidad, clave: crypto.randomUUID(), creadaEl: new Date().toISOString() },
      ];
      guardarNotificaciones(siguiente);
      return siguiente;
    });
  }

  function eliminarNotificacion(clave: string) {
    setNotificaciones((prev) => {
      const siguiente = prev.filter((n) => n.clave !== clave);
      guardarNotificaciones(siguiente);
      return siguiente;
    });
  }

  const yaNotificada = (entidad: EntidadElegida) =>
    notificaciones.some((n) => coincide(n, entidad));

  return (
    <main className="min-h-screen bg-humo px-6 pt-32 pb-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold md:text-5xl">Notificaciones</h1>
        <p className="mt-3 text-lg text-carbon/60">
          Programá un aviso sobre una sociedad o una persona y te escribimos apenas aparezca en un
          boletín nuevo.
        </p>

        <NuevaNotificacion onElegir={agregarNotificacion} yaNotificada={yaNotificada} />

        <section className="mt-8 rounded-3xl bg-white p-7">
          <h2 className="mb-5 text-2xl font-bold">Notificaciones activas</h2>
          {notificaciones.length === 0 ? (
            <p className="py-4 text-carbon/50">Todavía no programaste ninguna notificación.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-carbon/10 text-xs uppercase tracking-widest text-carbon/50">
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Nombre</th>
                    <th className="px-6 py-4">CUIT</th>
                    <th className="px-6 py-4">Programada</th>
                    <th className="px-6 py-4">Aviso a</th>
                    <th className="px-6 py-4" />
                  </tr>
                </thead>
                <tbody>
                  {notificaciones.map((n) => (
                    <tr key={n.clave} className="border-b border-carbon/5 last:border-0">
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            n.tipo === "sociedad" ? "bg-vino/10 text-vino" : "bg-humo text-carbon/70"
                          }`}
                        >
                          {n.tipo === "sociedad" ? "Sociedad" : "Persona"}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold">
                        {n.tipo === "sociedad" && n.id !== null ? (
                          <Link
                            to={`/sociedad/${n.id}`}
                            className="text-vino underline-offset-4 hover:underline"
                          >
                            {n.nombre}
                          </Link>
                        ) : (
                          n.nombre
                        )}
                        {n.id === null && (
                          <span className="ml-2 rounded-full bg-humo px-2.5 py-0.5 text-xs font-normal text-carbon/50">
                            sin ficha en la base
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-carbon/60">
                        {n.cuit ? formatCuit(n.cuit) : "—"}
                      </td>
                      <td className="px-6 py-4 text-carbon/60">
                        {fecha(n.creadaEl.slice(0, 10))}
                      </td>
                      <td className="px-6 py-4 text-carbon/60">{EMAIL_CUENTA}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => eliminarNotificacion(n.clave)}
                          className="cursor-pointer text-sm font-bold text-carbon/40 transition-colors hover:text-vino"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function NuevaNotificacion({
  onElegir,
  yaNotificada,
}: {
  onElegir: (entidad: EntidadElegida) => void;
  yaNotificada: (entidad: EntidadElegida) => boolean;
}) {
  const [tipo, setTipo] = useState<TipoEntidad>("sociedad");
  const [termino, setTermino] = useState("");
  const modo: ModoBusqueda = pareceCuitODni(termino) ? "cuit" : "nombre";
  const [abierto, setAbierto] = useState(false);
  const [confirmacion, setConfirmacion] = useState("");
  const [nombreManual, setNombreManual] = useState("");
  const contenedor = useRef<HTMLDivElement>(null);

  const [buscarSociedadesPorNombre, socNombre] = useLazyQuery<DataBusqueda>(BUSCAR_SOCIEDADES);
  const [buscarSociedadesPorCuit, socCuit] = useLazyQuery<DataBusquedaPorCuit>(
    BUSCAR_SOCIEDADES_POR_CUIT,
  );
  const [buscarPersonasPorNombre, perNombre] = useLazyQuery<DataBusquedaPersonas>(BUSCAR_PERSONAS);
  const [buscarPersonasPorCuit, perCuit] = useLazyQuery<DataBusquedaPersonasPorCuit>(
    BUSCAR_PERSONAS_POR_CUIT,
  );

  const loading =
    tipo === "sociedad"
      ? modo === "nombre"
        ? socNombre.loading
        : socCuit.loading
      : modo === "nombre"
        ? perNombre.loading
        : perCuit.loading;

  const resultados: EntidadElegida[] =
    tipo === "sociedad"
      ? modo === "nombre"
        ? (socNombre.data?.buscarSociedades.nodes ?? []).map((r) => ({
            tipo: "sociedad" as const,
            id: r.id,
            nombre: r.nombre,
            cuit: r.cuit,
          }))
        : (socCuit.data?.buscarSociedadesPorCuit.nodes ?? []).map((r) => ({
            tipo: "sociedad" as const,
            id: r.id,
            nombre: r.nombre,
            cuit: r.cuit,
          }))
      : modo === "nombre"
        ? (perNombre.data?.buscarPersonas.nodes ?? []).map((r) => ({
            tipo: "persona" as const,
            id: r.id,
            nombre: r.nombre,
            cuit: r.cuit,
          }))
        : (perCuit.data?.buscarPersonasPorCuit.nodes ?? []).map((r) => ({
            tipo: "persona" as const,
            id: r.id,
            nombre: r.nombre,
            cuit: r.cuit,
          }));

  useEffect(() => {
    const limpio = termino.trim();
    if (limpio.length < MIN_CARACTERES[modo]) {
      setAbierto(false);
      return;
    }
    const timer = setTimeout(() => {
      if (tipo === "sociedad") {
        if (modo === "nombre") buscarSociedadesPorNombre({ variables: { termino: limpio } });
        else buscarSociedadesPorCuit({ variables: { termino: limpio } });
      } else {
        if (modo === "nombre") buscarPersonasPorNombre({ variables: { termino: limpio } });
        else buscarPersonasPorCuit({ variables: { termino: limpio } });
      }
      setAbierto(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [
    termino,
    modo,
    tipo,
    buscarSociedadesPorNombre,
    buscarSociedadesPorCuit,
    buscarPersonasPorNombre,
    buscarPersonasPorCuit,
  ]);

  useEffect(() => {
    function alClickearAfuera(e: MouseEvent) {
      if (contenedor.current && !contenedor.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", alClickearAfuera);
    return () => document.removeEventListener("mousedown", alClickearAfuera);
  }, []);

  function cambiarTipo(nuevo: TipoEntidad) {
    setTipo(nuevo);
    setTermino("");
    setAbierto(false);
    setConfirmacion("");
    setNombreManual("");
  }

  function confirmarYAgregar(entidad: EntidadElegida) {
    if (yaNotificada(entidad)) {
      setConfirmacion(
        `Ya tenés una notificación activa para ${entidad.tipo === "sociedad" ? "esa sociedad" : "esa persona"}.`,
      );
      return;
    }
    onElegir(entidad);
    setConfirmacion(`Listo, te avisaremos por mail a ${EMAIL_CUENTA} cuando corresponda.`);
  }

  function elegir(entidad: EntidadElegida) {
    setAbierto(false);
    setTermino("");
    confirmarYAgregar(entidad);
  }

  function elegirManual() {
    const digitos = termino.replace(/\D/g, "");
    if (digitos.length < 7) return;
    const nombre =
      nombreManual.trim() || `${tipo === "sociedad" ? "Sociedad" : "Persona"} sin ficha (CUIT/DNI ${digitos})`;
    confirmarYAgregar({ tipo, id: null, nombre, cuit: digitos });
    setAbierto(false);
    setTermino("");
    setNombreManual("");
  }

  return (
    <section className="mt-8 rounded-3xl bg-white p-7">
      <h2 className="mb-5 text-2xl font-bold">Nueva notificación</h2>

      <div className="mb-4 flex gap-1.5">
        {(["sociedad", "persona"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => cambiarTipo(t)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              tipo === t ? "bg-vino text-white" : "bg-humo text-carbon/60 hover:bg-carbon/10"
            }`}
          >
            {t === "sociedad" ? "Sociedad" : "Persona"}
          </button>
        ))}
      </div>

      <div ref={contenedor} className="relative">
        <div className="flex items-center rounded-full border border-carbon/15 p-2">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            onFocus={() => termino.trim().length >= MIN_CARACTERES[modo] && setAbierto(true)}
            placeholder={
              tipo === "sociedad" ? "Nombre de la sociedad o CUIT…" : "Nombre de la persona o CUIT/DNI…"
            }
            className="w-full bg-transparent px-4 py-2 text-carbon outline-none placeholder:text-carbon/40"
          />
        </div>

        {abierto && (
          <ul className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl bg-white text-left shadow-2xl">
            {loading && <li className="px-5 py-3 text-sm text-carbon/50">Buscando…</li>}
            {!loading && resultados.length === 0 && (
              <li className="px-5 py-3 text-sm text-carbon/50">
                No encontramos {tipo === "sociedad" ? "sociedades" : "personas"} con ese{" "}
                {modo === "nombre" ? "nombre" : "CUIT/DNI"}.
              </li>
            )}
            {!loading && resultados.length === 0 && modo === "cuit" && termino.replace(/\D/g, "").length >= 7 && (
              <li className="border-t border-carbon/10 px-5 py-4">
                <p className="mb-2 text-sm text-carbon/60">
                  ¿No está en la base? Podés programar la notificación igual para ese CUIT/DNI.
                </p>
                <input
                  type="text"
                  value={nombreManual}
                  onChange={(e) => setNombreManual(e.target.value)}
                  placeholder={`Nombre de ${tipo === "sociedad" ? "la sociedad" : "la persona"} (opcional)`}
                  className="mt-5 mb-2.5 w-full rounded-xl border border-carbon/15 px-3.5 py-2 text-sm outline-none transition-colors focus:border-vino"
                />
                <button
                  type="button"
                  onClick={elegirManual}
                  className="cursor-pointer rounded-full bg-carbon px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-carbon/80"
                >
                  Notificar este CUIT/DNI de todas formas
                </button>
              </li>
            )}
            {resultados.map((r) => (
              <li key={r.id}>
                <button
                  type="button"
                  onClick={() => elegir(r)}
                  className="flex w-full cursor-pointer items-baseline justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-humo"
                >
                  <span className="font-bold text-carbon">{r.nombre}</span>
                  <span className="shrink-0 text-xs text-carbon/50">
                    {r.cuit ? formatCuit(r.cuit) : ""}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mt-4 text-sm text-carbon/50">
        Elegí una {tipo === "sociedad" ? "sociedad" : "persona"} de la lista para programar la
        notificación. Te avisaremos por mail a <strong>{EMAIL_CUENTA}</strong> (el mail con el que
        te registraste) cuando aparezca en un boletín nuevo.
      </p>

      {confirmacion && (
        <p className="mt-4 rounded-xl bg-humo p-4 text-sm text-carbon/70">{confirmacion}</p>
      )}
    </section>
  );
}
