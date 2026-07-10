import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BUSCAR_SOCIEDADES,
  BUSCAR_SOCIEDADES_POR_CUIT,
  type DataBusqueda,
  type DataBusquedaPorCuit,
  type Id,
} from "../lib/queries";
import { cuit as formatCuit } from "../lib/format";

type Modo = "nombre" | "cuit";

const MIN_CARACTERES: Record<Modo, number> = { nombre: 2, cuit: 3 };

// Buscador con autocomplete: por nombre (fuzzy, pg_trgm) o por CUIT (solo dígitos).
// `sobreOscuro` ajusta los colores cuando el fondo detrás es el vino del hero.
// `mostrarAvanzada` oculta el link cuando el buscador ya está dentro de esa página.
export function SearchBox({
  sobreOscuro = false,
  mostrarAvanzada = true,
}: {
  sobreOscuro?: boolean;
  mostrarAvanzada?: boolean;
}) {
  const [modo, setModo] = useState<Modo>("nombre");
  const [termino, setTermino] = useState("");
  const [abierto, setAbierto] = useState(false);
  const contenedor = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const [buscarPorNombre, porNombre] = useLazyQuery<DataBusqueda>(BUSCAR_SOCIEDADES);
  const [buscarPorCuit, porCuit] = useLazyQuery<DataBusquedaPorCuit>(BUSCAR_SOCIEDADES_POR_CUIT);

  const loading = modo === "nombre" ? porNombre.loading : porCuit.loading;
  const resultados =
    modo === "nombre"
      ? (porNombre.data?.buscarSociedades.nodes ?? [])
      : (porCuit.data?.buscarSociedadesPorCuit.nodes ?? []);

  useEffect(() => {
    const limpio = termino.trim();
    if (limpio.length < MIN_CARACTERES[modo]) {
      setAbierto(false);
      return;
    }
    const timer = setTimeout(() => {
      if (modo === "nombre") {
        buscarPorNombre({ variables: { termino: limpio } });
      } else {
        buscarPorCuit({ variables: { termino: limpio } });
      }
      setAbierto(true);
    }, 250);
    return () => clearTimeout(timer);
  }, [termino, modo, buscarPorNombre, buscarPorCuit]);

  useEffect(() => {
    function alClickearAfuera(e: MouseEvent) {
      if (contenedor.current && !contenedor.current.contains(e.target as Node)) {
        setAbierto(false);
      }
    }
    document.addEventListener("mousedown", alClickearAfuera);
    return () => document.removeEventListener("mousedown", alClickearAfuera);
  }, []);

  function elegir(id: Id) {
    setAbierto(false);
    setTermino("");
    navigate(`/sociedad/${id}`);
  }

  function cambiarModo(nuevo: Modo) {
    setModo(nuevo);
    setTermino("");
    setAbierto(false);
  }

  return (
    <div ref={contenedor} className="relative w-full max-w-xl">
      <div className="mb-2.5 flex gap-1.5">
        {(["nombre", "cuit"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => cambiarModo(m)}
            className={`cursor-pointer rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${
              modo === m
                ? sobreOscuro
                  ? "bg-white text-vino"
                  : "bg-vino text-white"
                : sobreOscuro
                  ? "bg-white/15 text-white hover:bg-white/25"
                  : "bg-humo text-carbon/60 hover:bg-carbon/10"
            }`}
          >
            {m === "nombre" ? "Por nombre" : "Por CUIT"}
          </button>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (resultados.length > 0) elegir(resultados[0].id);
        }}
      >
        <div className="flex items-center rounded-full bg-white p-2 shadow-xl shadow-black/20">
          <input
            type="text"
            value={termino}
            onChange={(e) => setTermino(e.target.value)}
            onFocus={() => termino.trim().length >= MIN_CARACTERES[modo] && setAbierto(true)}
            placeholder={
              modo === "nombre" ? "Buscá una sociedad por nombre…" : "Buscá por CUIT (ej: 30-71555222-1)…"
            }
            className="w-full bg-transparent px-4 py-2 text-carbon outline-none placeholder:text-carbon/40"
            aria-label={modo === "nombre" ? "Buscar sociedad por nombre" : "Buscar sociedad por CUIT"}
          />
          <button
            type="submit"
            className="shrink-0 cursor-pointer rounded-full bg-vino px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-vino-oscuro"
          >
            Buscar
          </button>
        </div>
      </form>

      {abierto && (
        <ul className="absolute inset-x-0 top-full z-40 mt-2 overflow-hidden rounded-2xl bg-white text-left shadow-2xl">
          {loading && <li className="px-5 py-3 text-sm text-carbon/50">Buscando…</li>}
          {!loading && resultados.length === 0 && (
            <li className="px-5 py-3 text-sm text-carbon/50">
              No encontramos sociedades por {modo === "nombre" ? "ese nombre" : "ese CUIT"}.
            </li>
          )}
          {resultados.map((r) => (
            <li key={r.id}>
              <button
                onClick={() => elegir(r.id)}
                className="flex w-full cursor-pointer items-baseline justify-between gap-4 px-5 py-3 text-left transition-colors hover:bg-humo"
              >
                <span className="font-bold text-carbon">{r.nombre}</span>
                <span className="shrink-0 text-xs text-carbon/50">
                  {r.tipoSociedadByTipoSociedadId?.nombre ?? ""}
                  {r.cuit ? ` · ${formatCuit(r.cuit)}` : ""}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {mostrarAvanzada && (
        <div className="mt-3 text-center">
          <Link
            to="/busqueda-avanzada"
            className={`text-sm underline-offset-4 transition-colors hover:underline ${
              sobreOscuro ? "text-white/70 hover:text-white" : "text-carbon/60 hover:text-vino"
            }`}
          >
            Búsqueda avanzada →
          </Link>
        </div>
      )}
    </div>
  );
}
