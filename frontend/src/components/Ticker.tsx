const ITEMS = [
  "Boletín Oficial de Mendoza",
  "ARCA",
  "Constituciones",
  "Autoridades",
  "Cesiones de cuotas",
  "Aumentos de capital",
  "Red de vínculos",
];

// Cinta continua estilo ventriloc, separando el hero de las estadísticas.
// 4 copias (no 2): con textos cortos, una sola copia de ITEMS puede ser más
// angosta que pantallas grandes, y con solo 2 copias el scroll se queda sin
// contenido para tapar el hueco cerca del final de cada ciclo. La animación
// se mueve -25% (el ancho de 1 copia sobre 4), así que necesita que 3 copias
// cubran el viewport — margen de sobra incluso en monitores ultra-wide.
export function Ticker() {
  const cuadruple = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-carbon py-3.5" aria-hidden="true">
      <div className="animate-ticker flex w-max items-center">
        {cuadruple.map((item, i) => (
          <span
            key={i}
            className="flex items-center whitespace-nowrap text-xs uppercase tracking-[0.25em] text-white/70"
          >
            <span className="px-6">{item}</span>
            <span className="text-vino-claro">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
