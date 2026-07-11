import { gql } from "@apollo/client";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { apollo } from "../apollo";
import { GrafoExploracion, type TipoNodo } from "../components/GrafoExploracion";
import type { Id } from "../lib/queries";

// Demo por defecto cuando se entra a /exploracion sin sociedad/persona
// puntual (ej. desde un link directo). El resto de las páginas navegan acá
// con /exploracion/:tipo/:id vía el botón "Ver red completa".
const DEMO = { tipo: "sociedad" as TipoNodo, id: "987" as Id, nombre: "Grupo Mdd S.A.S." };

const NOMBRE_SOCIEDAD = gql`
  query NombreSociedadExploracion($id: BigInt!) {
    sociedadById(id: $id) {
      nombre
    }
  }
`;

const NOMBRE_PERSONA = gql`
  query NombrePersonaExploracion($id: BigInt!) {
    personaFisicaById(id: $id) {
      nombre
    }
  }
`;

export default function Exploracion() {
  const { tipo, id } = useParams<{ tipo?: string; id?: string }>();
  const location = useLocation();

  const raizTipo: TipoNodo = tipo === "persona" ? "persona" : tipo === "sociedad" ? "sociedad" : DEMO.tipo;
  const raizId: Id = tipo && id ? id : DEMO.id;
  const esDemo = !tipo || !id;
  const nombreDeNavegacion = (location.state as { nombre?: string } | null)?.nombre;

  const [nombre, setNombre] = useState<string | null>(
    esDemo ? DEMO.nombre : (nombreDeNavegacion ?? null),
  );

  // Si se llega acá directo (recarga de página, link compartido) sin el
  // nombre en el state de navegación, lo pedimos aparte — la query del grafo
  // en sí solo trae aristas, no el nombre del nodo central.
  useEffect(() => {
    setNombre(esDemo ? DEMO.nombre : (nombreDeNavegacion ?? null));
    if (esDemo || nombreDeNavegacion) return;
    let cancelado = false;
    const query = raizTipo === "sociedad" ? NOMBRE_SOCIEDAD : NOMBRE_PERSONA;
    apollo.query({ query, variables: { id: raizId } }).then((resultado) => {
      if (cancelado) return;
      const data = resultado.data as
        | { sociedadById?: { nombre: string } | null; personaFisicaById?: { nombre: string } | null }
        | undefined;
      const nombreResuelto = data?.sociedadById?.nombre ?? data?.personaFisicaById?.nombre ?? "(sin nombre)";
      setNombre(nombreResuelto);
    });
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [raizTipo, raizId, esDemo, nombreDeNavegacion]);

  return (
    <div className="fixed top-18 right-0 bottom-0 left-0 bg-humo">
      {nombre ? (
        <GrafoExploracion raizTipo={raizTipo} raizId={raizId} raizNombre={nombre} />
      ) : (
        <div className="flex h-full items-center justify-center text-sm text-carbon/60">Cargando…</div>
      )}
    </div>
  );
}
