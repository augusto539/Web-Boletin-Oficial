import { useQuery } from "@apollo/client/react";
import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { GRAFO, type DataGrafo, type Id } from "../lib/queries";

const COLORES: Record<string, string> = {
  sociedad: "#691824",
  persona: "#191d20",
  escribano: "#8a2433",
};

const FACTOR_ZOOM = 1.2;

function idNodo(tipo: string | null, id: Id | null): string {
  return `${tipo ?? "x"}-${id ?? "0"}`;
}

// La base real tiene ~100 variantes de nombres de rol (Socio, Socia, Socia
// Comanditada, Accionista, Socio Cedente...), así que la detección es por
// substring, no por catálogo cerrado.
function esSocio(relacion: string | null): boolean {
  return /soci[oa]|accionista/i.test(relacion ?? "");
}

// Los escribanos ya no son un tipo de nodo aparte (origen_tipo siempre es
// 'persona' o 'sociedad' en la vista real) — se detectan por el texto de la
// relación ("Escribano interviniente" desde el acto, o el rol "Escribano").
function esEscribano(relacion: string | null): boolean {
  return /escribano/i.test(relacion ?? "");
}

export function GrafoSociedad({ sociedadId, nombre }: { sociedadId: Id; nombre: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const navigate = useNavigate();
  const { data, loading } = useQuery<DataGrafo>(GRAFO, { variables: { id: sociedadId } });

  useEffect(() => {
    if (!contenedor.current || !data) return;

    const aristas = data.grafoDeSociedad.nodes;
    const central = idNodo("sociedad", sociedadId);

    // relacion describe el rol del ORIGEN de la arista respecto del destino
    // (ej: "López es Director Titular DE Inversiones del Oeste"), así que
    // solo se cuelga del nodo origen — nunca del destino, que no tiene ese
    // rol, es quien lo recibe.
    const relacionesPorNodo = new Map<string, Set<string>>();
    function registrarRelacion(clave: string, relacion: string | null) {
      if (clave === central || !relacion) return;
      if (!relacionesPorNodo.has(clave)) relacionesPorNodo.set(clave, new Set());
      relacionesPorNodo.get(clave)!.add(relacion);
    }
    for (const a of aristas) {
      registrarRelacion(idNodo(a.origenTipo, a.origenId), a.relacion);
    }

    const nodos = new Map<string, cytoscape.ElementDefinition>();
    nodos.set(central, {
      data: { id: central, label: nombre, tipo: "sociedad", central: true },
    });

    function agregarNodo(tipo: string | null, id: Id | null, nombreNodo: string | null) {
      const clave = idNodo(tipo, id);
      if (clave === central || nodos.has(clave)) return;
      const relaciones = [...(relacionesPorNodo.get(clave) ?? [])];
      const escribano = relaciones.some(esEscribano);
      const label = relaciones.length > 0
        ? `${nombreNodo ?? "(sin nombre)"}\n(${relaciones.join(", ")})`
        : (nombreNodo ?? "(sin nombre)");
      nodos.set(clave, {
        data: { id: clave, label, tipo: tipo ?? "x", central: false, escribano },
      });
    }
    for (const a of aristas) {
      agregarNodo(a.origenTipo, a.origenId, a.origenNombre);
      agregarNodo(a.destinoTipo, a.destinoId, a.destinoNombre);
    }

    const elementos: cytoscape.ElementDefinition[] = [
      ...nodos.values(),
      ...aristas.map((a, i) => ({
        data: {
          id: `e${i}`,
          source: idNodo(a.origenTipo, a.origenId),
          target: idNodo(a.destinoTipo, a.destinoId),
          socio: esSocio(a.relacion),
        },
      })),
    ];

    const cy = cytoscape({
      container: contenedor.current,
      elements: elementos,
      // El zoom con la rueda del mouse se maneja a mano (ver el listener de
      // wheel más abajo) para que scrollear la página sobre el grafo no quede
      // atrapado haciendo zoom en vez de scrollear.
      userZoomingEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: "node",
          style: {
            "background-color": (n: cytoscape.NodeSingular) =>
              n.data("escribano") ? COLORES.escribano : (COLORES[n.data("tipo") as string] ?? "#999"),
            // +10% de área clickeable/arrastrable respecto del tamaño visual
            // original (26px / 46px), para que cueste menos "fallarle" al
            // nodo y terminar arrastrando el fondo (todo el grafo) en vez de
            // moverlo a él.
            width: (n: cytoscape.NodeSingular) => (n.data("central") ? 46 : 26) * 1.1,
            height: (n: cytoscape.NodeSingular) => (n.data("central") ? 46 : 26) * 1.1,
            label: "data(label)",
            "font-size": 11,
            "font-family": "Arial, Helvetica, sans-serif",
            color: "#191d20",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "text-wrap": "wrap",
            "text-max-width": "140",
            // El texto también cuenta como parte "agarrable" del nodo (si
            // no, clickear el nombre debajo del nodo cae al fondo y termina
            // arrastrando el grafo entero).
            "text-events": "yes",
            // Por encima de aristas y de las etiquetas de otros nodos, para
            // que siempre gane el click el nodo y no lo que esté detrás.
            "z-index": 10,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#d8c6ca",
            "curve-style": "bezier",
            // Más separación entre aristas paralelas (ej: una persona que es
            // socia Y presidenta de la misma sociedad) para que la línea
            // sólida y la punteada no se solapen y se puedan distinguir.
            "control-point-step-size": 60,
            "line-style": (e: cytoscape.EdgeSingular) => (e.data("socio") ? "solid" : "dashed"),
            // Arista dirigida: la flecha apunta de quien tiene el rol (origen)
            // hacia la sociedad donde lo tiene (destino).
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#d8c6ca",
            "arrow-scale": 0.9,
            "z-index": 0,
          },
        },
        // Sin overlay de "toque" al hacer click/tap sobre nodos o aristas.
        {
          selector: ":active",
          style: {
            "overlay-opacity": 0,
          },
        },
      ],
      layout: {
        name: "cose",
        animate: false,
        padding: 40,
        // idealEdgeLength fija la longitud de "reposo" de cada arista; el
        // default de Cytoscape es 32px. Ver la respuesta en el chat sobre
        // nodeDimensionsIncludeLabels y gravity para otros parámetros que
        // también afectan qué tan cerca quedan los nodos del central.
        idealEdgeLength: 32 * 2,
        nodeRepulsion: 4048,
      },
    });
    cyRef.current = cy;
    const contenedorEl = contenedor.current;

    // Click en otro nodo del grafo → navegar a su ficha (sociedad o persona).
    cy.on("tap", "node", (evento) => {
      const nodo = evento.target;
      if (nodo.data("central")) return;
      const tipo = nodo.data("tipo");
      const id = String(nodo.id()).split("-")[1];
      if (!id) return;
      if (tipo === "sociedad") navigate(`/sociedad/${id}`);
      else if (tipo === "persona") navigate(`/persona/${id}`);
    });

    // Cursor de mano + tooltip al pasar el mouse sobre un nodo navegable (no
    // el central, que no tiene a dónde ir).
    const tooltip = document.createElement("div");
    tooltip.style.cssText = `
      position: absolute;
      pointer-events: none;
      background: #191d20;
      color: #fff;
      font-size: 12px;
      font-family: Arial, Helvetica, sans-serif;
      padding: 4px 10px;
      border-radius: 6px;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 20;
      transform: translate(-50%, -135%);
    `;
    contenedorEl.style.position = "relative";
    contenedorEl.appendChild(tooltip);
    let tooltipTimeout: ReturnType<typeof setTimeout> | undefined;

    cy.on("mouseover", "node", (evento) => {
      const nodo = evento.target;
      const tipo = nodo.data("tipo");
      const navegable = (tipo === "sociedad" || tipo === "persona") && !nodo.data("central");
      contenedorEl.style.cursor = navegable ? "pointer" : "default";
      if (!navegable) return;
      tooltip.textContent = tipo === "sociedad" ? "Ir a sociedad" : "Ir a persona";
      const pos = nodo.renderedPosition();
      tooltip.style.left = `${pos.x}px`;
      tooltip.style.top = `${pos.y}px`;
      tooltipTimeout = setTimeout(() => {
        tooltip.style.opacity = "1";
      }, 500);
    });
    cy.on("mouseout", "node", () => {
      contenedorEl.style.cursor = "default";
      clearTimeout(tooltipTimeout);
      tooltip.style.opacity = "0";
    });
    // Si arrastran/paneás el grafo con el nodo bajo el cursor, no dejar el
    // tooltip pegado en una posición vieja.
    cy.on("pan zoom drag", () => {
      clearTimeout(tooltipTimeout);
      tooltip.style.opacity = "0";
    });

    // Zoom solo con ctrl/cmd + rueda (o pellizco de trackpad, que el
    // navegador reporta como wheel+ctrlKey); un scroll normal deja pasar el
    // evento sin tocarlo para que el scroll suave global (Lenis, en
    // lib/scroll.ts) lo procese como scroll de página, igual que en el resto
    // del sitio. stopPropagation en la rama de zoom evita que ese mismo
    // evento además le llegue a Lenis y mueva la página a la vez que se hace zoom.
    function alHacerWheel(e: WheelEvent) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      e.stopPropagation();
      const rect = contenedorEl.getBoundingClientRect();
      const factor = e.deltaY < 0 ? FACTOR_ZOOM : 1 / FACTOR_ZOOM;
      cy.zoom({
        level: cy.zoom() * factor,
        renderedPosition: { x: e.clientX - rect.left, y: e.clientY - rect.top },
      });
    }
    contenedorEl.addEventListener("wheel", alHacerWheel, { passive: false });

    return () => {
      contenedorEl.removeEventListener("wheel", alHacerWheel);
      clearTimeout(tooltipTimeout);
      tooltip.remove();
      cy.destroy();
      cyRef.current = null;
    };
  }, [data, sociedadId, nombre, navigate]);

  function zoom(factor: number) {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({
      level: cy.zoom() * factor,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
  }

  function ajustarVista() {
    cyRef.current?.fit(undefined, 40);
  }

  const vacio = !loading && (data?.grafoDeSociedad.nodes.length ?? 0) === 0;

  return (
    <div>
      <div className="relative">
        <div
          ref={contenedor}
          className="h-[480px] w-full rounded-3xl bg-humo"
          role="img"
          aria-label={`Red de vínculos de ${nombre}`}
        />
        <div className="absolute right-3 bottom-3 flex flex-col overflow-hidden rounded-xl bg-white shadow-md">
          <button
            type="button"
            onClick={() => zoom(FACTOR_ZOOM)}
            aria-label="Acercar"
            className="cursor-pointer border-b border-carbon/10 px-3 py-2 text-lg font-bold text-carbon transition-colors hover:bg-humo hover:text-vino"
          >
            +
          </button>
          <button
            type="button"
            onClick={ajustarVista}
            aria-label="Ajustar vista"
            className="cursor-pointer border-b border-carbon/10 px-3 py-1.5 text-xs text-carbon transition-colors hover:bg-humo hover:text-vino"
          >
            ⤢
          </button>
          <button
            type="button"
            onClick={() => zoom(1 / FACTOR_ZOOM)}
            aria-label="Alejar"
            className="cursor-pointer px-3 py-2 text-lg font-bold text-carbon transition-colors hover:bg-humo hover:text-vino"
          >
            −
          </button>
        </div>
      </div>
      {loading && <p className="mt-3 text-sm text-carbon/50">Cargando red de vínculos…</p>}
      {vacio && (
        <p className="mt-3 text-sm text-carbon/50">
          Esta sociedad todavía no tiene vínculos registrados en la base.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-5 text-sm text-carbon/70">
        <Leyenda color={COLORES.sociedad} texto="Sociedad" />
        <Leyenda color={COLORES.persona} texto="Persona física" />
        <Leyenda color={COLORES.escribano} texto="Escribano" />
      </div>
      <div className="mt-2 flex flex-wrap gap-5 text-sm text-carbon/70">
        <LeyendaLinea punteada={false} texto="Es socio de" />
        <LeyendaLinea punteada texto="Otro vínculo (autoridad, escribano, etc.)" />
      </div>
      <p className="mt-2 max-w-2xl text-xs text-carbon/50">
        La flecha indica el sentido del vínculo: va desde quien tiene el rol hacia la sociedad
        donde lo tiene. Por ejemplo, una flecha de "Juan Pérez" hacia "Empresa S.A." significa que
        Juan Pérez es socio (o autoridad) de Empresa S.A. — no al revés.
      </p>
    </div>
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      {texto}
    </span>
  );
}

function LeyendaLinea({ punteada, texto }: { punteada: boolean; texto: string }) {
  return (
    <span className="flex items-center gap-2">
      <svg width="28" height="10" aria-hidden="true">
        <line
          x1="2"
          y1="5"
          x2="20"
          y2="5"
          stroke="#8a7a7e"
          strokeWidth="2"
          strokeDasharray={punteada ? "4,3" : undefined}
        />
        <polygon points="20,1 26,5 20,9" fill="#8a7a7e" />
      </svg>
      {texto}
    </span>
  );
}
