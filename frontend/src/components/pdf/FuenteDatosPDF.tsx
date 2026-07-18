import { Text, View } from "@react-pdf/renderer";
import { estilosPDF as e } from "./estilosPDF";

// Versión resumida de FuenteDatos.tsx (la explicación completa vive en la
// página web) — acá el espacio es limitado, así que se prioriza que quede
// claro de dónde sale el dato y que puede tener errores, con un link a la
// versión completa en vez de reproducir el texto entero.
export function FuenteDatosPDF({ extra }: { extra?: string }) {
  return (
    <View style={e.seccion} wrap={false}>
      <Text style={e.tituloSeccion}>Fuente y metodología</Text>
      <Text style={{ fontSize: 9, color: "#444444", lineHeight: 1.5 }}>
        Este informe se elabora a partir de las publicaciones del Boletín Oficial de Mendoza,
        procesadas por un proceso de extracción automatizado. Pueden existir imprecisiones por
        errores del Boletín de origen (que la extracción no corrige) o por domicilios y datos
        ambiguos que el proceso automatizado prefiere dejar sin informar antes que asignar de
        forma incorrecta.
        {extra ? ` ${extra}` : ""} Más detalle en ingcome.com.ar/informes.
      </Text>
    </View>
  );
}
