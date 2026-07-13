import cytoscape from "cytoscape";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apollo } from "../apollo";
import { trackEvent } from "../lib/analytics";
import {
  GRAFO,
  GRAFO_PERSONA,
  type Arista,
  type DataGrafo,
  type DataGrafoPersona,
  type Id,
} from "../lib/queries";

const COLORES: Record<string, string> = {
  sociedad: "#691824",
  persona: "#191d20",
  escribano: "#8a2433",
};

const FACTOR_ZOOM = 1.2;

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
      const resultados = await Promise.all(pendientes.map((n) => obtenerAristas(n.tipo, n.id)));

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
      pendientes.forEach((nodo, i) => {
        const { idsNuevos } = fusionarAristas(cy, resultados[i], nodo.clave, centro);
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
        data: { id: clave, label: etiqueta(clave), tipo, central: clave === central, escribano: relaciones.some(esEscribano) },
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
              n.data("escribano") ? COLORES.escribano : (COLORES[n.data("tipo") as string] ?? "#999"),
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
    return `${conteo.sociedades} sociedad${conteo.sociedades === 1 ? "" : "es"} · ${conteo.personas} persona${conteo.personas === 1 ? "" : "s"} en pantalla`;
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

  // Exporta exactamente lo que se está viendo (no todo el grafo aunque haya
  // nodos fuera de cámara): es una "foto de esta vista", coherente con lo que
  // el usuario tiene en pantalla en ese momento. cy.png() solo captura el
  // canvas del grafo, así que el panel "Explorando X" (HTML superpuesto) se
  // redibuja a mano sobre un canvas compuesto nuevo.
  async function descargarImagen() {
    const cy = cyRef.current;
    if (!cy) return;

    const escala = 2;
    const dataUrlGrafo = cy.png({ scale: escala, bg: "#efefef" });

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

    // Mismos márgenes/padding que el overlay HTML (top-5 left-5, p-4),
    // escalados x2 para que coincidan en proporción con la resolución 2x.
    const margen = 20 * escala;
    const padding = 16 * escala;
    const anchoPanel = 340 * escala;

    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 12 * escala;
    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    dibujarRectRedondeado(ctx, margen, margen, anchoPanel, 96 * escala, 16 * escala);
    ctx.fill();
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;

    const textoX = margen + padding;
    const anchoTexto = anchoPanel - padding * 2;
    let cursorY = margen + padding;

    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(25, 29, 32, 0.5)";
    ctx.font = `bold ${11 * escala}px sans-serif`;
    ctx.fillText("EXPLORANDO", textoX, cursorY);
    cursorY += 22 * escala;

    ctx.fillStyle = "#191d20";
    ctx.font = `bold ${18 * escala}px sans-serif`;
    ctx.fillText(truncarTexto(ctx, raizNombre, anchoTexto), textoX, cursorY);
    cursorY += 30 * escala;

    ctx.fillStyle = "#691824";
    ctx.font = `bold ${12 * escala}px sans-serif`;
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

      <div className="pointer-events-none absolute top-5 left-5 max-w-sm rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-widest text-carbon/50">Explorando</p>
        <p className="text-lg font-bold text-carbon">{raizNombre}</p>
        <p className="mt-1 text-xs text-carbon/60">
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

      {/* Controles de prueba: expandir todo el grafo visible un nivel, o
          deshacer la última expansión masiva. No son para el usuario final. */}
      <div className="absolute top-5 right-5 flex flex-col items-end gap-2">
        <div className="flex overflow-hidden rounded-2xl bg-white/90 shadow-md backdrop-blur">
          <button
            type="button"
            onClick={expandirTodos}
            disabled={expandiendo || cargando}
            title="Expandir todos los nodos visibles un nivel"
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
          onClick={descargarImagen}
          disabled={cargando || vacio}
          title="Descargar esta vista como imagen"
          className="cursor-pointer rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-bold text-carbon shadow-md backdrop-blur transition-colors hover:bg-white disabled:cursor-not-allowed disabled:text-carbon/30"
        >
          ⭳ Descargar imagen
        </button>
        {expandiendo && (
          <div className="rounded-full bg-white/90 px-4 py-2 text-xs font-bold text-carbon/70 shadow-md">
            Expandiendo…
          </div>
        )}
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
            disabled={menu.yaExpandido || expandiendo}
            className="block w-full cursor-pointer border-t border-carbon/10 px-5 py-3 text-left text-sm font-bold text-carbon transition-colors hover:bg-humo disabled:cursor-not-allowed disabled:text-carbon/30 disabled:hover:bg-transparent"
          >
            {menu.yaExpandido ? "Ya expandido" : "Expandir grafo"}
          </button>
        </div>
      )}

      <div className="absolute right-5 bottom-5 flex flex-col overflow-hidden rounded-xl bg-white shadow-md">
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

      <div className="pointer-events-none absolute bottom-5 left-5 flex flex-col gap-2 rounded-2xl bg-white/90 p-4 shadow-md backdrop-blur">
        <Leyenda color={COLORES.sociedad} texto="Sociedad" />
        <Leyenda color={COLORES.persona} texto="Persona física" />
        <Leyenda color={COLORES.escribano} texto="Escribano" />
        <LeyendaLinea punteada={false} texto="Es socio de" />
        <LeyendaLinea punteada texto="Otro vínculo" />
      </div>
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
