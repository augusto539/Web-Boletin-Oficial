import type { ReactNode } from "react";

// Sección final compartida por las tres páginas de /informes. El texto es
// deliberadamente específico (no un genérico "los datos pueden variar")
// porque la idea es que alguien pueda entender, sin escribirnos, por qué un
// número puntual puede no coincidir con lo que ve en el Boletín. `children`
// permite que una página agregue una explicación propia (ver
// InformeDepartamentosActivos.tsx) dentro de la misma sección, en vez de
// duplicar el bloque completo.
export function FuenteDatos({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-lg font-bold">Fuente y metodología</h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-carbon/70">
        <p>
          Este informe se elabora a partir de las publicaciones del Boletín Oficial de Mendoza —
          específicamente los edictos de constitución, modificación y demás actos societarios que
          la provincia publica de forma pública. Un proceso de extracción automatizado procesa
          cada publicación y estructura la información (nombre, domicilio, capital, actividad,
          fecha de constitución) en la base de datos que alimenta tanto la búsqueda del sitio como
          este informe.
        </p>
        <p>
          Por tratarse de datos extraídos de forma automatizada a partir de texto publicado en
          formatos heterogéneos a lo largo de los años, pueden existir imprecisiones. Distinguimos
          dos fuentes de error:
        </p>
        <p>
          <strong className="text-carbon">Errores del Boletín de origen.</strong> El proceso de
          extracción no corrige ni verifica el contenido de la publicación: si el Boletín Oficial
          publicó un dato con un error de tipeo, una fecha inconsistente o un capital mal
          transcripto, ese mismo error se refleja en nuestra base.
        </p>
        <p>
          <strong className="text-carbon">Limitaciones del proceso de extracción.</strong> Cuando
          un dato del Boletín es ambiguo, está incompleto o redactado de una forma que el proceso
          automatizado no puede interpretar con certeza, optamos por dejarlo sin informar antes
          que asignarle un valor que podría ser incorrecto.
        </p>
        {children}
        <p>
          Este y el resto de los informes de esta sección son agregados estadísticos construidos
          sobre esa misma base, así que heredan sus limitaciones. Para un caso puntual,
          recomendamos verificar el dato contra la ficha de la sociedad correspondiente — que cita
          la publicación de origen del Boletín — o contra el Boletín Oficial directamente.
        </p>
      </div>
    </div>
  );
}
