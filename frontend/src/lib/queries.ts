import { gql } from "@apollo/client";

// Los ids de sociedades/personas son bigint en la base real, que GraphQL
// expone como el escalar BigInt (viaja serializado como string, no como
// number, para no perder precisión). Se tratan como string en todo el front:
// no se les hace aritmética, solo se muestran y se pasan de vuelta a la API.
export type Id = string;

export const BUSCAR_SOCIEDADES = gql`
  query BuscarSociedades($termino: String!) {
    buscarSociedades(termino: $termino, limite: 8) {
      nodes {
        id
        nombre
        cuit
        tipoSociedadByTipoSociedadId {
          nombre
        }
      }
    }
  }
`;

export interface ResultadoBusqueda {
  id: Id;
  nombre: string;
  cuit: string | null;
  tipoSociedadByTipoSociedadId: { nombre: string } | null;
}

export interface DataBusqueda {
  buscarSociedades: { nodes: ResultadoBusqueda[] };
}

export const BUSCAR_SOCIEDADES_POR_CUIT = gql`
  query BuscarSociedadesPorCuit($termino: String!) {
    buscarSociedadesPorCuit(termino: $termino, limite: 8) {
      nodes {
        id
        nombre
        cuit
        tipoSociedadByTipoSociedadId {
          nombre
        }
      }
    }
  }
`;

export interface DataBusquedaPorCuit {
  buscarSociedadesPorCuit: { nodes: ResultadoBusqueda[] };
}

export const BUSCAR_PERSONAS = gql`
  query BuscarPersonas($termino: String!) {
    buscarPersonas(termino: $termino, limite: 8) {
      nodes {
        id
        nombre
        cuit
        documento
        profesion
      }
    }
  }
`;

export interface ResultadoBusquedaPersona {
  id: Id;
  nombre: string;
  cuit: string | null;
  documento: string | null;
  profesion: string | null;
}

export interface DataBusquedaPersonas {
  buscarPersonas: { nodes: ResultadoBusquedaPersona[] };
}

export const BUSCAR_PERSONAS_POR_CUIT = gql`
  query BuscarPersonasPorCuit($termino: String!) {
    buscarPersonasPorCuit(termino: $termino, limite: 8) {
      nodes {
        id
        nombre
        cuit
        documento
        profesion
      }
    }
  }
`;

export interface DataBusquedaPersonasPorCuit {
  buscarPersonasPorCuit: { nodes: ResultadoBusquedaPersona[] };
}

export const FILTROS_BUSQUEDA_AVANZADA = gql`
  query FiltrosBusquedaAvanzada {
    allGruposClae {
      nodes {
        codigo
        nombre
      }
    }
    allTiposSociedad {
      nodes {
        id
        nombre
      }
    }
    allDepartamentos {
      nodes {
        id
        nombre
      }
    }
  }
`;

export interface OpcionGrupoClae {
  codigo: string;
  nombre: string;
}

export interface OpcionDepartamento {
  id: number;
  nombre: string;
}

export interface OpcionTipoSociedad {
  id: number;
  nombre: string;
}

export interface DataFiltrosBusquedaAvanzada {
  allGruposClae: { nodes: OpcionGrupoClae[] };
  allTiposSociedad: { nodes: OpcionTipoSociedad[] };
  allDepartamentos: { nodes: OpcionDepartamento[] };
}

export const BUSCAR_SOCIEDADES_AVANZADO = gql`
  query BuscarSociedadesAvanzado(
    $termino: String
    $grupoClae: String
    $tipoSociedadId: Int
    $departamentoId: Int
    $fechaDesde: Date
    $fechaHasta: Date
    $first: Int
    $offset: Int
  ) {
    buscarSociedadesAvanzado(
      termino: $termino
      grupoClae: $grupoClae
      tipoSociedadId: $tipoSociedadId
      departamentoId: $departamentoId
      fechaDesde: $fechaDesde
      fechaHasta: $fechaHasta
      first: $first
      offset: $offset
    ) {
      totalCount
      nodes {
        id
        nombre
        cuit
        fechaConstitucion
        tipoSociedadByTipoSociedadId {
          nombre
        }
        sociedadActividadesBySociedadId {
          nodes {
            orden
            grupoClaeByClaeGrupo {
              nombre
            }
          }
        }
        domicilioByDomicilioId {
          localidadByLocalidadId {
            departamentoByDepartamentoId {
              nombre
            }
          }
        }
      }
    }
  }
`;

export interface ResultadoBusquedaAvanzada {
  id: Id;
  nombre: string;
  cuit: string | null;
  fechaConstitucion: string | null;
  tipoSociedadByTipoSociedadId: { nombre: string } | null;
  sociedadActividadesBySociedadId: {
    nodes: Array<{ orden: number | null; grupoClaeByClaeGrupo: { nombre: string } | null }>;
  };
  domicilioByDomicilioId: {
    localidadByLocalidadId: {
      departamentoByDepartamentoId: { nombre: string } | null;
    } | null;
  } | null;
}

export interface DataBusquedaAvanzada {
  buscarSociedadesAvanzado: { totalCount: number; nodes: ResultadoBusquedaAvanzada[] };
}

export const ESTADISTICAS = gql`
  query Estadisticas {
    estadisticasUltimoAnio {
      sociedadesNuevas
      personasInvolucradas
      grupoClaeMasActivo
      desde
      hasta
    }
  }
`;

export interface DataEstadisticas {
  estadisticasUltimoAnio: {
    sociedadesNuevas: number;
    personasInvolucradas: number;
    grupoClaeMasActivo: string | null;
    desde: string | null;
    hasta: string | null;
  } | null;
}

export const SOCIEDAD = gql`
  query Sociedad($id: BigInt!) {
    sociedadById(id: $id) {
      id
      nombre
      cuit
      empleador
      fechaConstitucion
      capitalInicial
      objetoSocial
      tipoSociedadByTipoSociedadId {
        nombre
      }
      estadoGananciasByEstadoGananciasId {
        nombre
      }
      estadoIvaByEstadoIvaId {
        nombre
      }
      tipoMatchArcaByTipoMatchArcaId {
        nombre
      }
      domicilioByDomicilioId {
        domicilioCompleto
        localidadByLocalidadId {
          nombre
          departamentoByDepartamentoId {
            nombre
          }
        }
      }
      sociedadActividadesBySociedadId {
        nodes {
          id
          orden
          estado
          actividadClaeByClaeCodigo {
            codigo
            descripcion
          }
          grupoClaeByClaeGrupo {
            nombre
          }
        }
      }
      vinculosBySociedadId {
        nodes {
          id
          porcentaje
          fechaEntrada
          fechaSalida
          nombreJuridicoFallback
          cuitJuridicoFallback
          rolByRolId {
            nombre
          }
          personaFisicaByPersonaId {
            id
            nombre
            profesion
          }
          sociedadBySociedadMiembroId {
            id
            nombre
          }
        }
      }
      actosBySociedadId {
        nodes {
          id
          fechaActo
          fechaPublicacion
          descripcion
          capitalAnterior
          capitalNuevo
          registroNotarial
          tipoActoByTipoActoId {
            nombre
          }
          personaFisicaByEscribanoId {
            nombre
          }
          boletinByBoletinId {
            fecha
            idPdf
          }
        }
      }
    }
  }
`;

export interface Vinculo {
  id: Id;
  porcentaje: string | null;
  fechaEntrada: string | null;
  fechaSalida: string | null;
  nombreJuridicoFallback: string | null;
  cuitJuridicoFallback: string | null;
  rolByRolId: { nombre: string } | null;
  personaFisicaByPersonaId: { id: Id; nombre: string; profesion: string | null } | null;
  sociedadBySociedadMiembroId: { id: Id; nombre: string } | null;
}

export interface Acto {
  id: Id;
  fechaActo: string | null;
  fechaPublicacion: string | null;
  descripcion: string | null;
  capitalAnterior: string | null;
  capitalNuevo: string | null;
  registroNotarial: string | null;
  tipoActoByTipoActoId: { nombre: string } | null;
  personaFisicaByEscribanoId: { nombre: string } | null;
  boletinByBoletinId: {
    fecha: string;
    idPdf: string | null;
  } | null;
}

export interface Actividad {
  id: Id;
  orden: number | null;
  estado: string | null;
  actividadClaeByClaeCodigo: { codigo: string; descripcion: string } | null;
  grupoClaeByClaeGrupo: { nombre: string } | null;
}

export interface Sociedad {
  id: Id;
  nombre: string;
  cuit: string | null;
  empleador: boolean | null;
  fechaConstitucion: string | null;
  capitalInicial: string | null;
  objetoSocial: string | null;
  tipoSociedadByTipoSociedadId: { nombre: string } | null;
  estadoGananciasByEstadoGananciasId: { nombre: string } | null;
  estadoIvaByEstadoIvaId: { nombre: string } | null;
  tipoMatchArcaByTipoMatchArcaId: { nombre: string } | null;
  domicilioByDomicilioId: {
    domicilioCompleto: string;
    localidadByLocalidadId: {
      nombre: string;
      departamentoByDepartamentoId: { nombre: string } | null;
    } | null;
  } | null;
  sociedadActividadesBySociedadId: { nodes: Actividad[] };
  vinculosBySociedadId: { nodes: Vinculo[] };
  actosBySociedadId: { nodes: Acto[] };
}

export interface DataSociedad {
  sociedadById: Sociedad | null;
}

export const GRAFO = gql`
  query Grafo($id: BigInt!) {
    grafoDeSociedad(sociedadId: $id) {
      nodes {
        origenTipo
        origenId
        origenNombre
        destinoTipo
        destinoId
        destinoNombre
        relacion
      }
    }
  }
`;

export interface Arista {
  origenTipo: string | null;
  origenId: Id | null;
  origenNombre: string | null;
  destinoTipo: string | null;
  destinoId: Id | null;
  destinoNombre: string | null;
  relacion: string | null;
}

export interface DataGrafo {
  grafoDeSociedad: { nodes: Arista[] };
}

// Los listados de admin (sociedades/personas, incluidas las ocultas) viven
// en frontend/src/lib/adminApi.ts vía REST (boletin_auth bypassea la RLS de
// habeas data), no acá — este GraphQL siempre pasa por boletin_api, que
// nunca devuelve filas con oculta=true.

// --- Persona física (ficha) ------------------------------------------------

export const PERSONA = gql`
  query Persona($id: BigInt!) {
    personaFisicaById(id: $id) {
      id
      nombre
      tipoDocumento
      documento
      cuit
      profesion
      fechaNacimiento
      domicilioElectronico
      domicilioByDomicilioId {
        domicilioCompleto
        localidadByLocalidadId {
          nombre
          departamentoByDepartamentoId {
            nombre
          }
        }
      }
      vinculosByPersonaId {
        nodes {
          id
          porcentaje
          fechaEntrada
          fechaSalida
          rolByRolId {
            nombre
          }
          sociedadBySociedadId {
            id
            nombre
          }
          actoByActoAltaId {
            boletinByBoletinId {
              fecha
              idPdf
            }
          }
        }
      }
    }
  }
`;

export interface VinculoPersona {
  id: Id;
  porcentaje: string | null;
  fechaEntrada: string | null;
  fechaSalida: string | null;
  rolByRolId: { nombre: string } | null;
  sociedadBySociedadId: { id: Id; nombre: string } | null;
  actoByActoAltaId: {
    boletinByBoletinId: {
      fecha: string;
      idPdf: string | null;
    } | null;
  } | null;
}

export interface PersonaFisica {
  id: Id;
  nombre: string;
  tipoDocumento: string | null;
  documento: string | null;
  cuit: string | null;
  profesion: string | null;
  fechaNacimiento: string | null;
  domicilioElectronico: string | null;
  domicilioByDomicilioId: {
    domicilioCompleto: string;
    localidadByLocalidadId: {
      nombre: string;
      departamentoByDepartamentoId: { nombre: string } | null;
    } | null;
  } | null;
  vinculosByPersonaId: { nodes: VinculoPersona[] };
}

export interface DataPersona {
  personaFisicaById: PersonaFisica | null;
}

export const GRAFO_PERSONA = gql`
  query GrafoPersona($id: BigInt!) {
    grafoDePersona(personaId: $id) {
      nodes {
        origenTipo
        origenId
        origenNombre
        destinoTipo
        destinoId
        destinoNombre
        relacion
      }
    }
  }
`;

export interface DataGrafoPersona {
  grafoDePersona: { nodes: Arista[] };
}

// --- Búsqueda avanzada de personas -----------------------------------------

export const BUSCAR_PERSONAS_AVANZADO = gql`
  query BuscarPersonasAvanzado(
    $termino: String
    $departamentoId: Int
    $fechaNacDesde: Date
    $fechaNacHasta: Date
    $first: Int
    $offset: Int
  ) {
    buscarPersonasAvanzado(
      termino: $termino
      departamentoId: $departamentoId
      fechaNacDesde: $fechaNacDesde
      fechaNacHasta: $fechaNacHasta
      first: $first
      offset: $offset
    ) {
      totalCount
      nodes {
        id
        nombre
        documento
        cuit
        profesion
        fechaNacimiento
        domicilioByDomicilioId {
          localidadByLocalidadId {
            departamentoByDepartamentoId {
              nombre
            }
          }
        }
      }
    }
  }
`;

export interface ResultadoBusquedaPersonaAvanzada {
  id: Id;
  nombre: string;
  documento: string | null;
  cuit: string | null;
  profesion: string | null;
  fechaNacimiento: string | null;
  domicilioByDomicilioId: {
    localidadByLocalidadId: {
      departamentoByDepartamentoId: { nombre: string } | null;
    } | null;
  } | null;
}

export interface DataBusquedaPersonasAvanzada {
  buscarPersonasAvanzado: { totalCount: number; nodes: ResultadoBusquedaPersonaAvanzada[] };
}

// --- Landing: números en vivo ----------------------------------------------

export const ESTADISTICAS_LANDING = gql`
  query EstadisticasLanding {
    allSociedades {
      totalCount
    }
    allPersonasFisicas {
      totalCount
    }
    allActos {
      totalCount
    }
    allBoletines(first: 1, orderBy: [FECHA_DESC]) {
      nodes {
        fecha
      }
    }
  }
`;

export interface DataEstadisticasLanding {
  allSociedades: { totalCount: number };
  allPersonasFisicas: { totalCount: number };
  allActos: { totalCount: number };
  allBoletines: { nodes: Array<{ fecha: string }> };
}
