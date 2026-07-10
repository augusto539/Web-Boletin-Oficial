import { useQuery } from "@apollo/client/react";
import cytoscape from "cytoscape";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../lib/analytics";
import { GRAFO_PERSONA, type DataGrafoPersona, type Id } from "../lib/queries";

const COLORES: Record<string, string> = {
  sociedad: "#691824",
  persona: "#191d20",
};

const FACTOR_ZOOM = 1.2;

function idNodo(tipo: string | null, id: Id | null): string {
  return `${tipo ?? "x"}-${id ?? "0"}`;
}

function esSocio(relacion: string | null): boolean {
  return /soci[oa]|accionista/i.test(relacion ?? "");
}

// Grafo de 1 solo salto: en vw_grafo_aristas el origen siempre es esta misma
// persona (grafo_de_persona filtra por eso) y el destino siempre una
// sociedad, así que acá los roles describen "qué es esta persona EN esa
// sociedad" — se cuelgan del nodo destino, al revés que en GrafoSociedad
// (donde el origen varía y el destino es siempre la sociedad central).
export function GrafoPersona({ personaId, nombre }: { personaId: Id; nombre: string }) {
  const contenedor = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const navigate = useNavigate();
  const { data, loading } = useQuery<DataGrafoPersona>(GRAFO_PERSONA, { variables: { id: personaId } });

  useEffect(() => {
    if (!contenedor.current || !data) return;

    const aristas = data.grafoDePersona.nodes;
    const central = idNodo("persona", personaId);

    const rolesPorSociedad = new Map<string, Set<string>>();
    for (const a of aristas) {
      if (!a.relacion) continue;
      const clave = idNodo(a.destinoTipo, a.destinoId);
      if (!rolesPorSociedad.has(clave)) rolesPorSociedad.set(clave, new Set());
      rolesPorSociedad.get(clave)!.add(a.relacion);
    }

    const nodos = new Map<string, cytoscape.ElementDefinition>();
    nodos.set(central, {
      data: { id: central, label: nombre, tipo: "persona", central: true },
    });
    for (const a of aristas) {
      const clave = idNodo(a.destinoTipo, a.destinoId);
      if (nodos.has(clave)) continue;
      const roles = [...(rolesPorSociedad.get(clave) ?? [])];
      const label = roles.length > 0
        ? `${a.destinoNombre ?? "(sin nombre)"}\n(${roles.join(", ")})`
        : (a.destinoNombre ?? "(sin nombre)");
      nodos.set(clave, {
        data: { id: clave, label, tipo: a.destinoTipo ?? "x", central: false },
      });
    }

    const elementos: cytoscape.ElementDefinition[] = [
      ...nodos.values(),
      ...aristas.map((a, i) => ({
        data: {
          id: `e${i}`,
          source: central,
          target: idNodo(a.destinoTipo, a.destinoId),
          socio: esSocio(a.relacion),
        },
      })),
    ];

    const cy = cytoscape({
      container: contenedor.current,
      elements: elementos,
      userZoomingEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: "node",
          style: {
            "background-color": (n: cytoscape.NodeSingular) => COLORES[n.data("tipo") as string] ?? "#999",
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
            "text-events": "yes",
            "z-index": 10,
          },
        },
        {
          selector: "edge",
          style: {
            width: 1.5,
            "line-color": "#d8c6ca",
            "curve-style": "bezier",
            "control-point-step-size": 60,
            "line-style": (e: cytoscape.EdgeSingular) => (e.data("socio") ? "solid" : "dashed"),
            "target-arrow-shape": "triangle",
            "target-arrow-color": "#d8c6ca",
            "arrow-scale": 0.9,
            "z-index": 0,
          },
        },
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
        idealEdgeLength: 32 * 2,
        nodeRepulsion: 4048,
      },
    });
    cyRef.current = cy;
    const contenedorEl = contenedor.current;

    cy.on("tap", "node", (evento) => {
      const nodo = evento.target;
      if (nodo.data("tipo") === "sociedad" && !nodo.data("central")) {
        const id = String(nodo.id()).split("-")[1];
        if (id) {
          trackEvent("grafo_interaccion", { accion: "click_nodo", origen: "persona", tipo_destino: "sociedad" });
          navigate(`/sociedad/${id}`);
        }
      }
    });

    const tooltip = document.createElement("div");
    tooltip.textContent = "Ir a sociedad";
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
      const navegable = nodo.data("tipo") === "sociedad" && !nodo.data("central");
      contenedorEl.style.cursor = navegable ? "pointer" : "default";
      if (!navegable) return;
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
    cy.on("pan zoom drag", () => {
      clearTimeout(tooltipTimeout);
      tooltip.style.opacity = "0";
    });

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
  }, [data, personaId, nombre, navigate]);

  function zoom(factor: number) {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({
      level: cy.zoom() * factor,
      renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 },
    });
    trackEvent("grafo_interaccion", { accion: factor > 1 ? "zoom_in" : "zoom_out", origen: "persona" });
  }

  function ajustarVista() {
    cyRef.current?.fit(undefined, 40);
    trackEvent("grafo_interaccion", { accion: "ajustar_vista", origen: "persona" });
  }

  const vacio = !loading && (data?.grafoDePersona.nodes.length ?? 0) === 0;

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
          Esta persona todavía no tiene vínculos societarios registrados en la base.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-5 text-sm text-carbon/70">
        <Leyenda color={COLORES.persona} texto="Persona física" />
        <Leyenda color={COLORES.sociedad} texto="Sociedad" />
      </div>
      <div className="mt-2 flex flex-wrap gap-5 text-sm text-carbon/70">
        <LeyendaLinea punteada={false} texto="Es socio de" />
        <LeyendaLinea punteada texto="Otro vínculo (autoridad, escribano, etc.)" />
      </div>
      <p className="mt-2 max-w-2xl text-xs text-carbon/50">
        La flecha va desde {nombre} hacia cada sociedad de la que forma o formó parte.
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
