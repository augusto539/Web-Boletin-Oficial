import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apollo } from "../apollo";
import { trackEvent } from "../lib/analytics";
import { useAuth } from "../lib/auth";
import { useAccionConSesion } from "../lib/useAccionConSesion";
import { ModalRegistro } from "./auth/ModalRegistro";
import { DescargarIcon } from "./DescargarIcon";
import {
  GRAFO,
  GRAFO_LOTE,
  GRAFO_PERSONA,
  GRAFO_PERSONA_LOTE,
  type Arista,
  type DataGrafo,
  type DataGrafoLote,
  type DataGrafoPersona,
  type DataGrafoPersonaLote,
  type Id,
} from "../lib/queries";

const COLORES: Record<string, string> = {
  sociedad: "#691824",
  persona: "#191d20",
  escribano: "#8a2433",
};
const GRIS_SIN_ACTOS = "#c9c9c9";

const FACTOR_ZOOM = 1.2;
// Tope de expansiones (individuales + "expandir todo") por sesión de
// exploración para usuarios no admin -- cada expansión dispara una o más
// queries GraphQL nuevas, así que sin límite un usuario anónimo podría
// recorrer buena parte del grafo completo desde una sola sociedad.
const LIMITE_EXPANSIONES = 3;

export type TipoNodo = "sociedad" | "persona";

function idNodo(tipo: string | null, id: Id | null): string {
  return `${tipo ?? "x"}-${id ?? "0"}`;
}

// La base real tiene ~100 variantes de nombres de rol (Socio, Socia, Socia
// Comanditada, Accionista, Socio Cedente...), así que la detección es por
// substring, no por catálogo cerrado.
function esSocio(relacion: string | null): boolean {
  return /soci[oa]|accionista/i.test(relacion ?? "");
}

function esEscribano(relacion: string | null): boolean {
  return /escribano/i.test(relacion ?? "");
}

interface Menu {
  x: number;
  y: number;
  clave: string;
  tipo: TipoNodo;
  id: Id;
  yaExpandido: boolean;
}

// Snapshot del grafo completo (elementos + los mapas internos que arman las
// etiquetas) para poder "retraer" una expansión masiva — es la única forma
// de deshacer, porque fusionarAristas es aditivo por diseño.
interface Snapshot {
  elementos: cytoscape.ElementDefinition[];
  nombres: [string, string][];
  tipos: [string, string][];
  relaciones: [string, string[]][];
  aristasVistas: string[];
  expandidos: string[];
  sinActos: string[];
}

async function obtenerAristas(tipo: TipoNodo, id: Id): Promise<Arista[]> {
  if (tipo === "sociedad") {
    const resultado = await apollo.query<DataGrafo>({
      query: GRAFO,
      variables: { id },
      fetchPolicy: "network-only",
    });
    return resultado.data?.grafoDeSociedad.nodes ?? [];
  }
  const resultado = await apollo.query<DataGrafoPersona>({
    query: GRAFO_PERSONA,
    variables: { id },
    fetchPolicy: "network-only",
  });
  return resultado.data?.grafoDePersona.nodes ?? [];
}

// Versión en lote de obtenerAristas: agrupa los pendientes por tipo y pide
// las aristas de todos los de un mismo tipo en una sola query (grafoDe*Lote,
// ver 046_grafo_batch.sql), en vez de una query por nodo. Como máximo 2
// requests (uno para sociedades, uno para personas) sin importar cuántos
// nodos haya que expandir. Devuelve un Map clave->aristas para que
// fusionarAristas siga pudiendo procesar cada nodo por separado (necesita
// saber qué aristas corresponden a cuál, para el posicionamiento radial).
async function obtenerAristasLote(
  pendientes: { clave: string; tipo: TipoNodo; id: Id }[],
): Promise<Map<string, Arista[]>> {
  const idsSociedad = pendientes.filter((p) => p.tipo === "sociedad").map((p) => p.id);
  const idsPersona = pendientes.filter((p) => p.tipo === "persona").map((p) => p.id);

  const porNodo = new Map<string, Arista[]>();
  const agregar = (tipo: TipoNodo, aristas: { raizId: Id | null }[] & Arista[]) => {
    for (const arista of aristas) {
      const clave = idNodo(tipo, arista.raizId);
      const lista = porNodo.get(clave);
      if (lista) lista.push(arista);
      else porNodo.set(clave, [arista]);
    }
  };

  const promesas: Promise<void>[] = [];
  if (idsSociedad.length > 0) {
    promesas.push(
      apollo
        .query<DataGrafoLote>({ query: GRAFO_LOTE, variables: { ids: idsSociedad }, fetchPolicy: "network-only" })
        .then((r) => agregar("sociedad", r.data?.grafoDeSociedadesLote.nodes ?? [])),
    );
  }
  if (idsPersona.length > 0) {
    promesas.push(
      apollo
        .query<DataGrafoPersonaLote>({ query: GRAFO_PERSONA_LOTE, variables: { ids: idsPersona }, fetchPolicy: "network-only" })
        .then((r) => agregar("persona", r.data?.grafoDePersonasLote.nodes ?? [])),
    );
  }
  await Promise.all(promesas);
  return porNodo;
}

export function GrafoExploracion({
  raizTipo,
  raizId,
  raizNombre,
}: {
  raizTipo: TipoNodo;
  raizId: Id;
  raizNombre: string;
}) {
  const contenedor = useRef<HTMLDivElement>(null);
  const cyRef = useRef<cytoscape.Core | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Estado acumulado del grafo a través de múltiples expansiones. Vive en
  // refs (no en React state) porque cytoscape es la fuente de verdad visual;
  // React solo necesita re-renderear para el menú contextual y los mensajes.
  const nombresPorNodoRef = useRef(new Map<string, string>());
  const tiposPorNodoRef = useRef(new Map<string, string>());
  const relacionesPorNodoRef = useRef(new Map<string, Set<string>>());
  // Claves de nodos-sociedad sin actos propios capturados (recién promovidos
  // desde un socio jurídico sin resolver — ver 036_socios_juridicos.sql),
  // para pintarlos gris. Igual criterio que el resto de estos refs: se arma
  // incrementalmente en fusionarAristas, no se recalcula desde cero.
  const sinActosPorNodoRef = useRef(new Set<string>());
  const aristasVistasRef = useRef(new Set<string>());
  const expandidosRef = useRef(new Set<string>());
  const centralRef = useRef(idNodo(raizTipo, raizId));
  // Historial de snapshots para "retraer": cada expansión masiva (expandirTodos)
  // empuja el estado previo acá antes de mutar el grafo.
  const historialRef = useRef<Snapshot[]>([]);

  const [cargando, setCargando] = useState(true);
  const [expandiendo, setExpandiendo] = useState(false);
  const [vacio, setVacio] = useState(false);
  const [menu, setMenu] = useState<Menu | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [conteo, setConteo] = useState({ sociedades: 0, personas: 0 });
  const [puedeRetraer, setPuedeRetraer] = useState(false);
  // Solo se usa en mobile (el botón que la togglea es sm:hidden): en desktop
  // la referencia de nodos/aristas siempre está expandida, sin este estado.
  const [leyendaAbierta, setLeyendaAbierta] = useState(false);
  const { modalAbierto, ejecutar, alExito, cerrar } = useAccionConSesion();
  const { usuario } = useAuth();
  // Cuenta expansiones exitosas (individuales + "expandir todo") sin bajar
  // al retraer -- si bajara, alcanzaría con expandir y retraer para esquivar
  // el límite sin perder las queries ya gastadas del lado del servidor.
  const [expansionesUsadas, setExpansionesUsadas] = useState(0);
  const limiteExpansionesAlcanzado = !usuario?.admin && expansionesUsadas >= LIMITE_EXPANSIONES;

  function mostrarMensaje(texto: string) {
    setMensaje(texto);
    setTimeout(() => setMensaje((actual) => (actual === texto ? null : actual)), 2500);
  }

  function actualizarConteo(cy: cytoscape.Core) {
    setConteo({
      sociedades: cy.nodes().filter((n) => n.data("tipo") === "sociedad").length,
      personas: cy.nodes().filter((n) => n.data("tipo") === "persona").length,
    });
  }

  // Guarda una foto completa del grafo (elementos + los mapas que arman las
  // etiquetas) para poder deshacer con retraerUnPaso.
  function guardarSnapshot(cy: cytoscape.Core) {
    historialRef.current.push({
      elementos: cy.elements().map((ele) => ele.json() as unknown as cytoscape.ElementDefinition),
      nombres: [...nombresPorNodoRef.current.entries()],
      tipos: [...tiposPorNodoRef.current.entries()],
      relaciones: [...relacionesPorNodoRef.current.entries()].map(
        ([clave, set]) => [clave, [...set]] as [string, string[]],
      ),
      aristasVistas: [...aristasVistasRef.current],
      expandidos: [...expandidosRef.current],
      sinActos: [...sinActosPorNodoRef.current],
    });
    setPuedeRetraer(true);
  }

  function retraerUnPaso() {
    const cy = cyRef.current;
    const snapshot = historialRef.current.pop();
    if (!cy || !snapshot) {
      mostrarMensaje("No hay nada para retraer.");
      return;
    }
    cy.elements().remove();
    cy.add(snapshot.elementos);
    nombresPorNodoRef.current = new Map(snapshot.nombres);
    tiposPorNodoRef.current = new Map(snapshot.tipos);
    relacionesPorNodoRef.current = new Map(snapshot.relaciones.map(([clave, valores]) => [clave, new Set(valores)]));
    aristasVistasRef.current = new Set(snapshot.aristasVistas);
    expandidosRef.current = new Set(snapshot.expandidos);
    sinActosPorNodoRef.current = new Set(snapshot.sinActos);
    cy.layout({ name: "cose", animate: false, fit: true, padding: 40, idealEdgeLength: 64, nodeRepulsion: 200048 }).run();
    actualizarConteo(cy);
    setPuedeRetraer(historialRef.current.length > 0);
    trackEvent("grafo_interaccion", { accion: "retraer", origen: "exploracion" });
  }

  // Expande de una sola vez todos los nodos visibles que todavía no fueron
  // expandidos — un "salto" hacia afuera en toda la red a la vez. Pensado
  // para probar cómo se comporta el layout con crecimientos grandes.
  async function expandirTodos() {
    const cy = cyRef.current;
    if (!cy || expandiendo || cargando) return;
    if (limiteExpansionesAlcanzado) {
      mostrarMensaje(`Alcanzaste el límite de ${LIMITE_EXPANSIONES} expansiones para esta vista.`);
      return;
    }
    const pendientes = cy
      .nodes()
      .filter((n) => (n.data("tipo") === "sociedad" || n.data("tipo") === "persona") && !expandidosRef.current.has(n.id()))
      .map((n) => ({
        clave: n.id() as string,
        tipo: n.data("tipo") as TipoNodo,
        id: String(n.id()).split("-")[1] as Id,
      }));

    if (pendientes.length === 0) {
      mostrarMensaje("Todos los nodos visibles ya están expandidos.");
      return;
    }

    guardarSnapshot(cy);
    setExpandiendo(true);
    trackEvent("grafo_interaccion", {
      accion: "expandir_todos",
      origen: "exploracion",
      cantidad: pendientes.length,
    });
    try {
      const porNodo = await obtenerAristasLote(pendientes);

      // Centroide de TODO lo que ya está en pantalla (antes de agregar nada
      // de esta tanda), fijo para todo el batch. Antes cada llamada a
      // fusionarAristas recalculaba el "centro" a partir de la posición del
      // nodo central/raíz — pero ese nodo no siempre queda geométricamente
      // en el medio de su propio cluster (depende de dónde lo dejó el cose
      // inicial, que arranca en posiciones aleatorias), así que el sentido
      // "hacia afuera" salía a veces bien y a veces mal. El centroide de
      // todos los nodos viejos es una referencia mucho más estable.
      const nodosViejos = cy.nodes();
      let centro = { x: 0, y: 0 };
      if (nodosViejos.length > 0) {
        let sumaX = 0;
        let sumaY = 0;
        nodosViejos.forEach((n) => {
          const p = n.position();
          sumaX += p.x;
          sumaY += p.y;
        });
        centro = { x: sumaX / nodosViejos.length, y: sumaY / nodosViejos.length };
      }

      const idsNuevosTotal: string[] = [];
      pendientes.forEach((nodo) => {
        const { idsNuevos } = fusionarAristas(cy, porNodo.get(nodo.clave) ?? [], nodo.clave, centro);
        idsNuevosTotal.push(...idsNuevos);
        expandidosRef.current.add(nodo.clave);
      });

      if (idsNuevosTotal.length > 0) {
        // Versiones anteriores (ambas fallaban): bloqueaban los nodos viejos
        // (viejos.lock()) y corrían cose solo sobre los nuevos. Con la
        // repulsión altísima (200048) los nodos nuevos eran empujados por
        // todo el cluster viejo bloqueado y salían despedidos al hueco más
        // grande — casi siempre abajo a la derecha — sin importar la
        // posición radial inicial. La pista era que "Retraer" quedaba limpio
        // justo porque NO bloquea nada (cose global con todo libre).
        //
        // Ahora hacemos lo mismo que retraer: cose completo, sin bloquear,
        // partiendo de la posición radial ya seteada en fusionarAristas
        // (randomize:false) para conservar el sesgo direccional. Al estar
        // todo libre, el layout se equilibra en conjunto en vez de exiliar a
        // los nuevos a un rincón.
        // const nuevos = cy.nodes().filter((n) => idsNuevosTotal.includes(n.id()));
        // const viejos = cy.nodes().difference(nuevos);
        // viejos.lock();  ← esto era lo que rompía todo
        cy.layout({
          name: "cose",
          animate: true,
          animationDuration: 600,
          fit: true,
          padding: 40,
          idealEdgeLength: 64,
          nodeRepulsion: 200048,
          randomize: false,
        }).run();
        setExpansionesUsadas((n) => n + 1);
      } else {
        mostrarMensaje("Sin vínculos nuevos para mostrar.");
      }
      actualizarConteo(cy);
    } finally {
      setExpandiendo(false);
    }
  }

  // Suma nodos/aristas nuevos al cytoscape ya creado, sin tocar lo existente.
  // `origenClave` (si viene) es el nodo que disparó la expansión: los nodos
  // nuevos arrancan cerca suyo para que el layout incremental no los tire
  // lejos del punto donde el usuario está mirando.
  function fusionarAristas(
    cy: cytoscape.Core,
    aristas: Arista[],
    origenClave?: string,
    centroFijo?: { x: number; y: number },
  ) {
    const central = centralRef.current;
    const nodosTocados = new Set<string>();

    for (const a of aristas) {
      const claveOrigen = idNodo(a.origenTipo, a.origenId);
      const claveDestino = idNodo(a.destinoTipo, a.destinoId);
      if (a.origenNombre) nombresPorNodoRef.current.set(claveOrigen, a.origenNombre);
      if (a.destinoNombre) nombresPorNodoRef.current.set(claveDestino, a.destinoNombre);
      if (a.origenTipo) tiposPorNodoRef.current.set(claveOrigen, a.origenTipo);
      if (a.destinoTipo) tiposPorNodoRef.current.set(claveDestino, a.destinoTipo);
      if (a.origenSinActos) sinActosPorNodoRef.current.add(claveOrigen);
      if (a.destinoSinActos) sinActosPorNodoRef.current.add(claveDestino);

      if (claveOrigen !== central && a.relacion) {
        if (!relacionesPorNodoRef.current.has(claveOrigen)) {
          relacionesPorNodoRef.current.set(claveOrigen, new Set());
        }
        const set = relacionesPorNodoRef.current.get(claveOrigen)!;
        if (!set.has(a.relacion)) {
          set.add(a.relacion);
          nodosTocados.add(claveOrigen);
        }
      }
    }

    function etiqueta(clave: string): string {
      if (clave === central) return raizNombre;
      const nombreNodo = nombresPorNodoRef.current.get(clave) ?? "(sin nombre)";
      const relaciones = [...(relacionesPorNodoRef.current.get(clave) ?? [])];
      return relaciones.length > 0 ? `${nombreNodo}\n(${relaciones.join(", ")})` : nombreNodo;
    }

    const clavesMencionadas = new Set<string>();
    for (const a of aristas) {
      clavesMencionadas.add(idNodo(a.origenTipo, a.origenId));
      clavesMencionadas.add(idNodo(a.destinoTipo, a.destinoId));
    }

    const posicionBase = origenClave ? cy.getElementById(origenClave) : null;
    const base = posicionBase && posicionBase.length > 0 ? posicionBase.position() : null;

    // Paso 1 de la expansión radial: en vez de un jitter aleatorio sin
    // dirección alrededor del padre (versión anterior, comentada abajo), cada
    // nodo nuevo arranca desplazado desde su padre en la dirección
    // centro→padre — así el crecimiento sigue el cuadrante del padre en vez
    // de depender de dónde el layout de fuerzas encuentre lugar libre.
    // Primera versión: usaba la posición del nodo central/raíz como
    // "centro", pero ese nodo no siempre queda geométricamente en el medio
    // de su propio cluster (depende del cose inicial, que es aleatorio) —
    // por eso a veces salía bien y a veces no. Ahora expandirTodos pasa un
    // centroide fijo de todos los nodos existentes (más estable); si no
    // viene (expandirNodo, expansión de un solo nodo), se usa el nodo
    // central como antes.
    // const nodoCentral = cy.getElementById(central);
    // const centro = nodoCentral.length > 0 ? nodoCentral.position() : { x: 0, y: 0 };
    const centro =
      centroFijo ??
      (() => {
        const nodoCentral = cy.getElementById(central);
        return nodoCentral.length > 0 ? nodoCentral.position() : { x: 0, y: 0 };
      })();

    // Todos los nodos nuevos de este llamado comparten el mismo padre (mismo
    // `base`), así que sin abanico terminarían todos en el mismo ángulo — una
    // cuña angosta y amontonada cuando un padre tiene muchos hijos nuevos a
    // la vez. Se reparten en un arco de 90° alrededor de la dirección
    // centro→padre, cada uno a una distancia levemente distinta para que no
    // quede un arco perfecto.
    const clavesNuevas = [...clavesMencionadas].filter((clave) => cy.getElementById(clave).length === 0);
    const anguloBase = (() => {
      if (!base) return 0;
      const dx = base.x - centro.x;
      const dy = base.y - centro.y;
      const distanciaAlCentro = Math.hypot(dx, dy);
      return distanciaAlCentro > 1 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
    })();
    const ARCO_TOTAL = Math.PI / 2;

    const nodosNuevos: cytoscape.ElementDefinition[] = [];
    clavesNuevas.forEach((clave, indice) => {
      const relaciones = [...(relacionesPorNodoRef.current.get(clave) ?? [])];
      const tipo = tiposPorNodoRef.current.get(clave) ?? "x";
      const def: cytoscape.ElementDefinition = {
        data: {
          id: clave,
          label: etiqueta(clave),
          tipo,
          central: clave === central,
          escribano: relaciones.some(esEscribano),
          sinActos: sinActosPorNodoRef.current.has(clave),
        },
      };
      if (base) {
        // Versión anterior (mismo ángulo para todos los hermanos, solo jitter):
        // const dx = base.x - centro.x;
        // const dy = base.y - centro.y;
        // const distanciaAlCentro = Math.hypot(dx, dy);
        // const angulo = distanciaAlCentro > 1 ? Math.atan2(dy, dx) : Math.random() * Math.PI * 2;
        // const radialOffset = 220;
        // def.position = {
        //   x: base.x + Math.cos(angulo) * radialOffset + (Math.random() - 0.5) * 60,
        //   y: base.y + Math.sin(angulo) * radialOffset + (Math.random() - 0.5) * 60,
        // };
        const desvio = clavesNuevas.length > 1 ? (indice / (clavesNuevas.length - 1) - 0.5) * ARCO_TOTAL : 0;
        const angulo = anguloBase + desvio;
        const radialOffset = 220 + (Math.random() - 0.5) * 60;
        def.position = {
          x: base.x + Math.cos(angulo) * radialOffset,
          y: base.y + Math.sin(angulo) * radialOffset,
        };
      }
      nodosNuevos.push(def);
    });

    const aristasNuevas: cytoscape.ElementDefinition[] = [];
    for (const a of aristas) {
      const source = idNodo(a.origenTipo, a.origenId);
      const target = idNodo(a.destinoTipo, a.destinoId);
      const clave = `${source}=>${target}=>${a.relacion ?? ""}`;
      if (aristasVistasRef.current.has(clave)) continue;
      aristasVistasRef.current.add(clave);
      aristasNuevas.push({ data: { id: clave, source, target, socio: esSocio(a.relacion) } });
    }

    cy.add([...nodosNuevos, ...aristasNuevas]);

    for (const clave of nodosTocados) {
      const nodo = cy.getElementById(clave);
      if (nodo.length === 0 || nodo.data("central")) continue;
      nodo.data("label", etiqueta(clave));
    }

    return { idsNuevos: nodosNuevos.map((n) => n.data.id as string) };
  }

  useEffect(() => {
    if (!contenedor.current) return;
    let cancelado = false;

    const cy = cytoscape({
      container: contenedor.current,
      elements: [],
      userZoomingEnabled: false,
      autounselectify: true,
      style: [
        {
          selector: "node",
          style: {
            "background-color": (n: cytoscape.NodeSingular) =>
              n.data("escribano")
                ? COLORES.escribano
                : n.data("sinActos")
                  ? GRIS_SIN_ACTOS
                  : (COLORES[n.data("tipo") as string] ?? "#999"),
            width: (n: cytoscape.NodeSingular) => (n.data("central") ? 52 : 30) * 1.1,
            height: (n: cytoscape.NodeSingular) => (n.data("central") ? 52 : 30) * 1.1,
            label: "data(label)",
            "font-size": 12,
            "font-family": "Arial, Helvetica, sans-serif",
            color: "#191d20",
            "text-valign": "bottom",
            "text-margin-y": 6,
            "text-wrap": "wrap",
            "text-max-width": "160",
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
        { selector: ":active", style: { "overlay-opacity": 0 } },
      ],
    });
    cyRef.current = cy;
    const contenedorEl = contenedor.current;

    // Nodo central siempre presente, aunque la carga inicial no traiga aristas.
    cy.add({ data: { id: centralRef.current, label: raizNombre, tipo: raizTipo, central: true } });

    async function cargarInicial() {
      try {
        const aristas = await obtenerAristas(raizTipo, raizId);
        if (cancelado) return;
        fusionarAristas(cy, aristas);
        // El nodo central se crea antes de tener las aristas (línea de arriba
        // del componente), así que fusionarAristas nunca lo toca —
        // sinActosPorNodoRef ya está poblado acá, se aplica a mano.
        if (sinActosPorNodoRef.current.has(centralRef.current)) {
          cy.getElementById(centralRef.current).data("sinActos", true);
        }
        expandidosRef.current.add(centralRef.current);
        cy.layout({
          name: "cose",
          animate: false,
          fit: true,
          padding: 40,
          idealEdgeLength: 64,
          nodeRepulsion: 200048,
        }).run();
        setVacio(aristas.length === 0);
        actualizarConteo(cy);
      } finally {
        if (!cancelado) setCargando(false);
      }
    }
    cargarInicial();

    function cerrarMenu() {
      setMenu(null);
    }

    cy.on("tap", "node", (evento) => {
      const nodo = evento.target;
      const tipo = nodo.data("tipo");
      if (tipo !== "sociedad" && tipo !== "persona") return;
      const id = String(nodo.id()).split("-")[1];
      if (!id) return;
      const clave = nodo.id() as string;
      const pos = nodo.renderedPosition();
      setMenu({ x: pos.x, y: pos.y, clave, tipo, id, yaExpandido: expandidosRef.current.has(clave) });
    });

    cy.on("tap", (evento) => {
      if (evento.target === cy) cerrarMenu();
    });
    cy.on("pan zoom drag", cerrarMenu);

    // Cursor de mano al pasar sobre un nodo clickeable.
    cy.on("mouseover", "node", (evento) => {
      const tipo = evento.target.data("tipo");
      contenedorEl.style.cursor = tipo === "sociedad" || tipo === "persona" ? "pointer" : "default";
    });
    cy.on("mouseout", "node", () => {
      contenedorEl.style.cursor = "default";
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
      cancelado = true;
      contenedorEl.removeEventListener("wheel", alHacerWheel);
      cy.destroy();
      cyRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raizTipo, raizId, raizNombre]);

  // Cierra el menú si se clickea afuera de él (el propio cytoscape ya cierra
  // en tap sobre fondo/pan/zoom; esto cubre clicks sobre la UI de alrededor).
  useEffect(() => {
    if (!menu) return;
    function alClickearAfuera(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenu(null);
    }
    function alPresionarEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setMenu(null);
    }
    document.addEventListener("mousedown", alClickearAfuera);
    document.addEventListener("keydown", alPresionarEscape);
    return () => {
      document.removeEventListener("mousedown", alClickearAfuera);
      document.removeEventListener("keydown", alPresionarEscape);
    };
  }, [menu]);

  function irAFicha() {
    if (!menu) return;
    trackEvent("grafo_interaccion", { accion: "ir_a_ficha", origen: "exploracion", tipo: menu.tipo });
    navigate(menu.tipo === "sociedad" ? `/sociedad/${menu.id}` : `/persona/${menu.id}`);
  }

  async function expandirNodo() {
    if (!menu || menu.yaExpandido || expandiendo) return;
    if (limiteExpansionesAlcanzado) {
      mostrarMensaje(`Alcanzaste el límite de ${LIMITE_EXPANSIONES} expansiones para esta vista.`);
      setMenu(null);
      return;
    }
    const cy = cyRef.current;
    if (!cy) return;
    const { tipo, id, clave } = menu;
    setExpandiendo(true);
    trackEvent("grafo_interaccion", { accion: "expandir_nodo", origen: "exploracion", tipo });
    try {
      const aristas = await obtenerAristas(tipo, id);
      const { idsNuevos } = fusionarAristas(cy, aristas, clave);
      expandidosRef.current.add(clave);

      if (idsNuevos.length > 0) {
        const nuevos = cy.nodes().filter((n) => idsNuevos.includes(n.id()));
        const viejos = cy.nodes().difference(nuevos);
        viejos.lock();
        cy.layout({
          name: "cose",
          animate: true,
          animationDuration: 400,
          fit: true,
          padding: 40,
          idealEdgeLength: 64,
          nodeRepulsion: 200048,
          randomize: false,
        }).run();
        viejos.unlock();
        actualizarConteo(cy);
        setExpansionesUsadas((n) => n + 1);
      } else {
        mostrarMensaje("Sin vínculos nuevos para mostrar acá.");
      }
    } finally {
      setExpandiendo(false);
      setMenu(null);
    }
  }

  function zoom(factor: number) {
    const cy = cyRef.current;
    if (!cy) return;
    cy.zoom({ level: cy.zoom() * factor, renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
    trackEvent("grafo_interaccion", { accion: factor > 1 ? "zoom_in" : "zoom_out", origen: "exploracion" });
  }

  function ajustarVista() {
    cyRef.current?.fit(undefined, 40);
    trackEvent("grafo_interaccion", { accion: "ajustar_vista", origen: "exploracion" });
  }

  function textoConteo(): string {
    const base = `${conteo.sociedades} sociedad${conteo.sociedades === 1 ? "" : "es"} · ${conteo.personas} persona${conteo.personas === 1 ? "" : "s"} en pantalla`;
    if (usuario?.admin) {
      return `${base} · ${expansionesUsadas} expansi${expansionesUsadas === 1 ? "ón" : "ones"}`;
    }
    return `${base} · ${expansionesUsadas}/${LIMITE_EXPANSIONES} expansiones`;
  }

  function dibujarRectRedondeado(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    radio: number,
  ) {
    ctx.beginPath();
    ctx.moveTo(x + radio, y);
    ctx.arcTo(x + w, y, x + w, y + h, radio);
    ctx.arcTo(x + w, y + h, x, y + h, radio);
    ctx.arcTo(x, y + h, x, y, radio);
    ctx.arcTo(x, y, x + w, y, radio);
    ctx.closePath();
  }

  function truncarTexto(ctx: CanvasRenderingContext2D, texto: string, anchoMax: number): string {
    if (ctx.measureText(texto).width <= anchoMax) return texto;
    let recortado = texto;
    while (recortado.length > 1 && ctx.measureText(`${recortado}…`).width > anchoMax) {
      recortado = recortado.slice(0, -1);
    }
    return `${recortado}…`;
  }

  // Exporta el grafo COMPLETO (full: true), no la foto del viewport actual:
  // con "foto de lo que ves" el tamaño de letra en la imagen dependía de
  // cuánto zoom-out tenías al momento de descargar -- con el grafo muy
  // expandido, cada nodo quedaba tan chico en pantalla que la exportación
  // salía ilegible (issue detectado en sesión: la imagen más expandida
  // pesaba MENOS que una más chica, porque a igual resolución de lienzo
  // había menos detalle nítido por nodo, no más).
  //
  // La escala efectiva se calcula A MANO (no se le pasan maxWidth/maxHeight
  // a cy.png junto con scale): probado en sesión que cuando le das los tres
  // juntos, Cytoscape usa el "scale" fijo tal cual e IGNORA
  // maxWidth/maxHeight -- esos dos solo sirven para autocalcular la escala
  // cuando "scale" no viene seteado. Con un grafo de 1841 nodos (10
  // expansiones) eso generó una imagen de 12098x13330px (46 Mb en base64)
  // en vez de respetar el tope de 4096, y esa imagen a veces ni siquiera
  // llegaba a cargar como <img> (el error "No se pudo generar la imagen
  // del grafo" que se ve en consola es exactamente ese fallo de decodificar
  // una imagen demasiado grande). calidadGrafo es la densidad de píxeles
  // por unidad de modelo que se busca idealmente (independiente del zoom
  // actual en pantalla); MAX_* son el tope real de tamaño -- si el grafo es
  // muy grande, se resigna densidad para entrar en el tope, nunca se sube
  // la escala por encima de calidadGrafo. cy.png() solo captura el canvas
  // del grafo, así que el panel "Explorando X" (HTML superpuesto) se
  // redibuja a mano sobre un canvas compuesto nuevo.
  async function descargarImagen() {
    const cy = cyRef.current;
    if (!cy) return;

    const calidadGrafo = 2;
    const MAX_ANCHO = 4096;
    const MAX_ALTO = 4096;
    // cy.png() multiplica el "scale" que le pasamos por el pixelRatio del
    // renderer (por defecto, el devicePixelRatio del navegador -- no
    // documentado en los tipos de Cytoscape, lo confirmamos empíricamente
    // en sesión: con dpr=2 el resultado salía EXACTO al doble de lo
    // calculado). Sin este factor, cualquiera con pantalla retina/HiDPI
    // (2x, 3x) se vuelve a pasar del tope sin que se note en una pantalla
    // normal -- hay que dividirlo acá para que el tope valga sobre el
    // tamaño FINAL, no sobre un intermedio que Cytoscape todavía va a
    // multiplicar de nuevo puertas adentro.
    const dpr = window.devicePixelRatio || 1;
    const bb = cy.elements().boundingBox();
    const escalaGrafo = Math.min(calidadGrafo, MAX_ANCHO / (bb.w * dpr), MAX_ALTO / (bb.h * dpr));

    const dataUrlGrafo = cy.png({ full: true, scale: escalaGrafo, bg: "#efefef" });

    const imgGrafo = new Image();
    await new Promise<void>((resolve, reject) => {
      imgGrafo.onload = () => resolve();
      imgGrafo.onerror = () => reject(new Error("No se pudo generar la imagen del grafo."));
      imgGrafo.src = dataUrlGrafo;
    });

    const canvas = document.createElement("canvas");
    canvas.width = imgGrafo.width;
    canvas.height = imgGrafo.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(imgGrafo, 0, 0);

    // El panel ya NO se escala con el tamaño del grafo exportado -- antes
    // "escala" servía doble propósito (grafo y panel) porque los dos salían
    // de fotografiar el mismo viewport a 2x. Ahora el grafo se exporta
    // completo, a un tamaño que varía con su extensión real (puede ser
    // chico o gigante), así que el panel usa su propio factor de nitidez
    // fijo (calidadPanel, "retina" del panel en sí) y se lo acota a un
    // ancho máximo relativo al lienzo final, para que no lo tape por
    // completo en exportaciones chicas (grafos con pocos nodos).
    const calidadPanel = 2;
    const margen = 20 * calidadPanel;
    const padding = 16 * calidadPanel;
    const anchoPanel = Math.min(340 * calidadPanel, canvas.width * 0.55);

    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12 * calidadPanel;
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    dibujarRectRedondeado(ctx, margen, margen, anchoPanel, 96 * calidadPanel, 16 * calidadPanel);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const textoX = margen + padding;
    const anchoTexto = anchoPanel - padding * 2;
    let cursorY = margen + padding;

    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(25, 29, 32, 0.5)";
    ctx.font = `bold ${11 * calidadPanel}px sans-serif`;
    ctx.fillText("EXPLORANDO", textoX, cursorY);
    cursorY += 22 * calidadPanel;

    ctx.fillStyle = "#191d20";
    ctx.font = `bold ${18 * calidadPanel}px sans-serif`;
    ctx.fillText(truncarTexto(ctx, raizNombre, anchoTexto), textoX, cursorY);
    cursorY += 30 * calidadPanel;

    ctx.fillStyle = "#691824";
    ctx.font = `bold ${12 * calidadPanel}px sans-serif`;
    ctx.fillText(truncarTexto(ctx, textoConteo(), anchoTexto), textoX, cursorY);

    const nombreArchivo = raizNombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const enlace = document.createElement("a");
    enlace.href = canvas.toDataURL("image/png");
    enlace.download = `red-${nombreArchivo || "exploracion"}.png`;
    enlace.click();

    trackEvent("grafo_interaccion", { accion: "descargar_imagen", origen: "exploracion" });
  }

  return (
    <div className="relative h-full w-full">
      <div ref={contenedor} className="h-full w-full bg-humo" role="img" aria-label={`Red de vínculos de ${raizNombre}`} />

      <div className="pointer-events-none absolute inset-x-3 top-3 max-w-sm rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur sm:inset-x-auto sm:top-5 sm:left-5">
        <p className="text-xs font-bold uppercase tracking-widest text-carbon/50">Explorando</p>
        <p className="text-lg font-bold text-carbon">{raizNombre}</p>
        {/* "Click"/"Ctrl+rueda" no aplican a touch, y en mobile este panel ya
            compite por espacio con los controles — afuera. */}
        <p className="mt-1 hidden text-xs text-carbon/60 sm:block">
          Click en un nodo para ver opciones · Ctrl/Cmd + rueda para zoom
        </p>
        <p className="mt-2 text-xs font-bold text-vino">{textoConteo()}</p>
      </div>

      {cargando && (
        <div className="absolute inset-0 flex items-center justify-center bg-humo/70">
          <p className="text-sm text-carbon/60">Cargando red de vínculos…</p>
        </div>
      )}
      {!cargando && vacio && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <p className="rounded-2xl bg-white/90 px-6 py-4 text-sm text-carbon/60 shadow-md">
            Esta sociedad todavía no tiene vínculos registrados en la base.
          </p>
        </div>
      )}

      {/* Controles de prueba (expandir todo/retraer/descargar) + la
          referencia de nodos y aristas. En mobile van los tres agrupados en
          una sola columna en la esquina inferior izquierda, con el mismo
          margen (12px, bottom-3/left-3) que el cartel "Explorando" de
          arriba, al mismo nivel que los controles de zoom (abajo a la
          derecha) — de abajo hacia arriba: Expandir/Retraer, Descargar,
          Referencias (flex-col-reverse: el primer hijo en el DOM queda
          anclado abajo). En desktop cada pieza vuelve a su posición
          original (arriba a la derecha las dos primeras, abajo a la
          izquierda la leyenda) — los "contents" sacan a cada una del flujo
          de esta columna en sm: para que se posicionen de forma
          independiente, como antes. */}
      <div className="absolute bottom-3 left-3 flex flex-col-reverse items-start gap-2 sm:contents">
        <div className="contents sm:absolute sm:top-5 sm:right-5 sm:flex sm:flex-col sm:items-end sm:gap-2">
          <div className="flex overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur">
            <button
              type="button"
              onClick={expandirTodos}
              disabled={expandiendo || cargando || limiteExpansionesAlcanzado}
              title={
                limiteExpansionesAlcanzado
                  ? `Alcanzaste el límite de ${LIMITE_EXPANSIONES} expansiones para esta vista`
                  : "Expandir todos los nodos visibles un nivel"
              }
              className="cursor-pointer px-4 py-2.5 text-sm font-bold text-carbon transition-colors hover:bg-humo disabled:cursor-not-allowed disabled:text-carbon/30 disabled:hover:bg-transparent"
            >
              ▲ Expandir todo
            </button>
            <button
              type="button"
              onClick={retraerUnPaso}
              disabled={!puedeRetraer || expandiendo || cargando}
              title="Deshacer la última expansión masiva"
              className="cursor-pointer border-l border-carbon/10 px-4 py-2.5 text-sm font-bold text-carbon transition-colors hover:bg-humo disabled:cursor-not-allowed disabled:text-carbon/30 disabled:hover:bg-transparent"
            >
              ▼ Retraer
            </button>
          </div>
          <button
            type="button"
            onClick={() => ejecutar(descargarImagen)}
            disabled={cargando || vacio}
            title="Descargar esta vista como imagen"
            className="cursor-pointer rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-bold text-carbon shadow-md backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-carbon/30"
          >
            <DescargarIcon /> Descargar imagen
          </button>
          {expandiendo && (
            <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-carbon/70 shadow-md">
              Expandiendo…
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => setLeyendaAbierta((a) => !a)}
          className="cursor-pointer rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-carbon shadow-md backdrop-blur sm:hidden"
        >
          Referencias {leyendaAbierta ? "▲" : "▼"}
        </button>
        <div
          className={`pointer-events-none ${leyendaAbierta ? "flex" : "hidden"} flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur sm:absolute sm:bottom-5 sm:left-5 sm:flex`}
        >
          <Leyenda color={COLORES.sociedad} texto="Sociedad" />
          <Leyenda color={COLORES.persona} texto="Persona física" />
          <Leyenda color={COLORES.escribano} texto="Escribano" />
          <Leyenda color={GRIS_SIN_ACTOS} texto="Sociedad sin actos propios (mencionada como socia)" />
          <LeyendaLinea punteada={false} texto="Es socio de" />
          <LeyendaLinea punteada texto="Otro vínculo" />
        </div>
      </div>
      {mensaje && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 rounded-full bg-carbon px-4 py-2 text-xs font-bold text-white shadow-lg">
          {mensaje}
        </div>
      )}

      {menu && (
        <div
          ref={menuRef}
          className="absolute z-30 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl"
          style={{ left: menu.x, top: menu.y + 24 }}
        >
          <button
            type="button"
            onClick={irAFicha}
            className="block w-full cursor-pointer px-5 py-3 text-left text-sm font-bold text-carbon transition-colors hover:bg-humo"
          >
            Ir a la página de la {menu.tipo === "sociedad" ? "sociedad" : "persona"}
          </button>
          <button
            type="button"
            onClick={expandirNodo}
            disabled={menu.yaExpandido || expandiendo || limiteExpansionesAlcanzado}
            className="block w-full cursor-pointer border-t border-carbon/10 px-5 py-3 text-left text-sm font-bold text-carbon transition-colors hover:bg-humo disabled:cursor-not-allowed disabled:text-carbon/30 disabled:hover:bg-transparent"
          >
            {menu.yaExpandido
              ? "Ya expandido"
              : limiteExpansionesAlcanzado
                ? `Límite de ${LIMITE_EXPANSIONES} expansiones alcanzado`
                : "Expandir grafo"}
          </button>
        </div>
      )}

      {/* right-3/bottom-3 en mobile: mismo margen (12px) que el cartel
          "Explorando" y que el grupo de Expandir/Descargar/Referencias, al
          mismo nivel — quedan uno al lado del otro, no superpuestos. */}
      <div className="absolute right-3 bottom-3 flex flex-col overflow-hidden rounded-xl bg-white shadow-md sm:right-5 sm:bottom-5">
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

      {modalAbierto && (
        <ModalRegistro
          titulo="Registrate gratis para descargar"
          onExito={alExito}
          onCerrar={cerrar}
        />
      )}
    </div>
  );
}

function Leyenda({ color, texto }: { color: string; texto: string }) {
  return (
    <span className="flex items-center gap-2 text-xs text-carbon/70">
      <span className="inline-block h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: color }} />
      {texto}
    </span>
  );
}

function LeyendaLinea({ punteada, texto }: { punteada: boolean; texto: string }) {
  return (
    <span className="flex items-center gap-2 text-xs text-carbon/70">
      <svg width="24" height="10" aria-hidden="true" className="shrink-0">
        <line
          x1="2"
          y1="5"
          x2="18"
          y2="5"
          stroke="#8a7a7e"
          strokeWidth="2"
          strokeDasharray={punteada ? "4,3" : undefined}
        />
        <polygon points="18,1 24,5 18,9" fill="#8a7a7e" />
      </svg>
      {texto}
    </span>
  );
}
