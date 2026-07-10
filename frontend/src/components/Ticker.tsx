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
export function Ticker() {
  const doble = [...ITEMS, ...ITEMS];
  return (
    <div className="overflow-hidden bg-carbon py-3.5" aria-hidden="true">
      <div className="animate-ticker flex w-max items-center">
        {doble.map((item, i) => (
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
