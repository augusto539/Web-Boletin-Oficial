// Layout radial determinístico para diagramas de grafo chicos (ej. el k-core
// del holding energético del informe de Análisis de Redes: 15 sociedades + 6
// personas + 1 domicilio).
//
// A propósito NO usa Cytoscape (que sí usan GrafoSociedad/GrafoPersona/
// GrafoExploracion para los grafos interactivos de navegación): esos son
// exploratorios y con layout de fuerzas, que reordena en cada render. Acá el
// grafo es contenido fijo de un informe y tiene que verse idéntico siempre —
// y, sobre todo, tiene que poder renderizarse también en el PDF, donde
// Cytoscape no existe. Mismo criterio que graficoDona.ts: matemática pura acá,
// dos renderers finitos (web + PDF) que la consumen igual.

export type TipoNodo = "sociedad" | "persona" | "domicilio";

export interface NodoGrafo {
  id: string;
  etiqueta: string;
  tipo: TipoNodo;
}

export interface AristaGrafo {
  origen: string;
  destino: string;
}

export interface NodoPosicionado extends NodoGrafo {
  x: number;
  y: number;
  radio: number;
  /** Posición y anclaje del texto, ya resuelto según el ángulo del nodo. */
  textoX: number;
  textoY: number;
  anclaje: "start" | "middle" | "end";
}

export interface AristaPosicionada {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface LayoutGrafo {
  nodos: NodoPosicionado[];
  aristas: AristaPosicionada[];
}

export const RADIO_NODO: Record<TipoNodo, number> = {
  sociedad: 17,
  persona: 15,
  domicilio: 21,
};

/**
 * Ubica los nodos en tres capas concéntricas: el domicilio al centro, las
 * personas en un anillo interno y las sociedades en el externo — la forma que
 * hace legible una estructura "muchas sociedades comparten el mismo puñado de
 * personas y una dirección".
 *
 * Las etiquetas de los anillos se colocan hacia AFUERA del nodo, con el
 * anclaje elegido según el ángulo (izquierda del diagrama → texto que termina
 * en el nodo, derecha → texto que arranca en él), así los nombres largos
 * crecen hacia el borde y nunca hacia el centro lleno de aristas.
 */
export function calcularLayoutRadial(
  nodos: NodoGrafo[],
  aristas: AristaGrafo[],
  ancho: number,
  alto: number,
  radioExterno: number,
  radioInterno: number,
): LayoutGrafo {
  const cx = ancho / 2;
  const cy = alto / 2;

  const sociedades = nodos.filter((n) => n.tipo === "sociedad");
  const personas = nodos.filter((n) => n.tipo === "persona");
  const domicilios = nodos.filter((n) => n.tipo === "domicilio");

  const posicionados = new Map<string, NodoPosicionado>();

  function ubicarEnAnillo(lista: NodoGrafo[], radio: number, anguloInicial: number, separacionTexto: number) {
    lista.forEach((n, i) => {
      // -PI/2 de base: el primer nodo arranca arriba, no a la derecha.
      const angulo = anguloInicial + (i / Math.max(1, lista.length)) * Math.PI * 2;
      const x = cx + radio * Math.cos(angulo);
      const y = cy + radio * Math.sin(angulo);
      const radioNodo = RADIO_NODO[n.tipo];
      const distanciaTexto = radioNodo + separacionTexto;
      const cosAng = Math.cos(angulo);
      posicionados.set(n.id, {
        ...n,
        x,
        y,
        radio: radioNodo,
        textoX: x + distanciaTexto * cosAng,
        // +3 centra verticalmente el texto respecto de la línea de base.
        textoY: y + distanciaTexto * Math.sin(angulo) + 3,
        // Cerca de la vertical el texto queda justo arriba o abajo del nodo:
        // ahí centrarlo se ve mejor que empujarlo a un costado.
        anclaje: Math.abs(cosAng) < 0.3 ? "middle" : cosAng > 0 ? "start" : "end",
      });
    });
  }

  ubicarEnAnillo(sociedades, radioExterno, -Math.PI / 2, 7);
  ubicarEnAnillo(personas, radioInterno, -Math.PI / 2 + Math.PI / personas.length, 6);

  domicilios.forEach((n) => {
    const radioNodo = RADIO_NODO[n.tipo];
    posicionados.set(n.id, {
      ...n,
      x: cx,
      y: cy,
      radio: radioNodo,
      textoX: cx,
      textoY: cy + radioNodo + 13,
      anclaje: "middle",
    });
  });

  const aristasPosicionadas: AristaPosicionada[] = [];
  for (const a of aristas) {
    const o = posicionados.get(a.origen);
    const d = posicionados.get(a.destino);
    // Una arista que apunta a un id inexistente se ignora en silencio en vez
    // de romper el render del informe entero.
    if (!o || !d) continue;
    aristasPosicionadas.push({ x1: o.x, y1: o.y, x2: d.x, y2: d.y });
  }

  return { nodos: [...posicionados.values()], aristas: aristasPosicionadas };
}
