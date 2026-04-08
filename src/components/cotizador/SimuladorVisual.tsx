interface SimuladorVisualProps {
  tipologia: "corrediza" | "abrir" | "puerta_abrir" | "fijo";
  ancho: number;
  alto: number;
  colorHex: string;
}

export function SimuladorVisual({ tipologia, ancho, alto, colorHex }: SimuladorVisualProps) {
  // Para que el SVG siempre esté centrado y dentro del contenedor de manera responsiva,
  // definiremos un viewBox calculado en base al ancho y alto real elegidos.
  
  // Si las dimensiones son 0 o no válidas, usamos defaults razonables para pre-visualizar
  const w = ancho > 0 ? ancho : 1500;
  const h = alto > 0 ? alto : 1200;
  
  // Definimos marco y perfiles (más o menos anchos según la línea en vida real, pero aquí lo haremos estándar)
  const marcoWidth = Math.max(20, w * 0.04);
  const zocaloBottom = Math.max(30, w * 0.05);

  return (
    <div className="w-full bg-slate-50 border rounded-lg p-6 shadow-sm flex items-center justify-center relative overflow-hidden group">
      {/* Marca de Agua V|K Isotipo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
        <span className="font-heading font-black text-[25vw] text-primary tracking-tighter mix-blend-multiply">
          V<span className="text-accent">|</span>K
        </span>
      </div>

      <svg
        viewBox={`0 0 ${w + 100} ${h + 100}`}
        className="w-full h-full max-h-[70vh] md:max-h-[60vh] transition-all duration-700 ease-in-out drop-shadow-2xl z-10"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="metallic" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colorHex} />
            <stop offset="50%" stopColor={colorHex} stopOpacity="0.8" />
            <stop offset="100%" stopColor={colorHex} />
          </linearGradient>
        </defs>

        <g transform="translate(50, 50)">
          {/* MARCO EXTERIOR */}
          <rect x="0" y="0" width={w} height={h} fill="url(#metallic)" stroke="#1f2937" strokeWidth="2" />
          
          {tipologia === "corrediza" && (
            <>
              {/* HOJA IZQUIERDA (Atrás) */}
              <rect x={marcoWidth} y={marcoWidth} width={(w/2) - (marcoWidth/2) + 10} height={h - marcoWidth - zocaloBottom} fill="url(#metallic)" stroke="#374151" strokeWidth="2" />
              <rect x={marcoWidth*2} y={marcoWidth*2} width={(w/2) - (marcoWidth*2) - 5} height={h - zocaloBottom - marcoWidth*3} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
              
              {/* HOJA DERECHA (Adelante) */}
              <rect x={(w/2) - (marcoWidth/2) - 10} y={marcoWidth} width={(w/2) + (marcoWidth/2) - marcoWidth + 10} height={h - marcoWidth - zocaloBottom} fill="url(#metallic)" stroke="#374151" strokeWidth="2" />
              <rect x={(w/2) + 5} y={marcoWidth*2} width={(w/2) - marcoWidth*2 - 15} height={h - zocaloBottom - marcoWidth*3} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
              
              {/* CRUCE CENTRAL (línea de encuentro) */}
              <line x1={w/2} y1={marcoWidth} x2={w/2} y2={h - marcoWidth - zocaloBottom} stroke="#4b5563" strokeWidth="1.5" strokeDasharray="5,3" />
              
              {/* CIERRES LATERALES */}
              <rect x={marcoWidth} y={marcoWidth} width={marcoWidth} height={marcoWidth*2} fill="#4b5563" rx="2" />
              <rect x={marcoWidth} y={h - marcoWidth - zocaloBottom - marcoWidth*2} width={marcoWidth} height={marcoWidth*2} fill="#4b5563" rx="2" />
              <rect x={w - marcoWidth*2} y={marcoWidth} width={marcoWidth} height={marcoWidth*2} fill="#4b5563" rx="2" />
              <rect x={w - marcoWidth*2} y={h - marcoWidth - zocaloBottom - marcoWidth*2} width={marcoWidth} height={marcoWidth*2} fill="#4b5563" rx="2" />
              
              {/* Tirador Cierre Centro */}
              <rect x={(w/2) - (marcoWidth/3) + 5} y={(h/2) - 50} width={marcoWidth/1.5} height={100} fill="#4b5563" rx="5" />
            </>
          )}

          {tipologia === "abrir" && (
            <>
              {/* HOJA DE ABRIR */}
              <rect x={marcoWidth} y={marcoWidth} width={w - marcoWidth*2} height={h - marcoWidth - zocaloBottom} fill="url(#metallic)" stroke="#374151" strokeWidth="2" />
              {/* Vidrio */}
              <rect x={marcoWidth*2} y={marcoWidth*2} width={w - marcoWidth*4} height={h - zocaloBottom - marcoWidth*3} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
              
              {/* BISAGRAS IZQUIERDA */}
              <rect x={marcoWidth} y={h/2 - marcoWidth*2} width={marcoWidth/2} height={marcoWidth*4} fill="#4b5563" rx="1" />
              <rect x={marcoWidth} y={h/2 - marcoWidth*6} width={marcoWidth/2} height={marcoWidth*4} fill="#4b5563" rx="1" />
              <rect x={marcoWidth} y={h/2 + marcoWidth*2} width={marcoWidth/2} height={marcoWidth*4} fill="#4b5563" rx="1" />
              
              {/* MANIJA DERECHA (picaporte) */}
              <rect x={w - marcoWidth*3} y={h/2 - marcoWidth*4} width={marcoWidth} height={marcoWidth*8} fill="#4b5563" rx="2" />
              <circle cx={w - marcoWidth*2.5} cy={h/2} r={marcoWidth/2} fill="#1f2937" />
              
              {/* INDICADOR DE APERTURA (líneas punteadas formando triángulo) */}
              <polyline points={`${w - marcoWidth*3},${h/2 - marcoWidth*2} ${w - marcoWidth*5},${h/2} ${w - marcoWidth*3},${h/2 + marcoWidth*2}`} fill="none" stroke="#4b5563" strokeWidth="1.5" strokeDasharray="3,2" />
              <polygon points={`${w - marcoWidth*5},${h/2} ${w - marcoWidth*6},${h/2 - marcoWidth} ${w - marcoWidth*6},${h/2 + marcoWidth}`} fill="#4b5563" />
            </>
          )}

          {tipologia === "puerta_abrir" && (
            <>
              {/* PUERTA DE ABRIR */}
              {/* Zócalo inferior ancho al ras del piso */}
              <rect x={0} y={h - zocaloBottom} width={w} height={zocaloBottom} fill="#8B5A2B" stroke="#5D4037" strokeWidth="2" />
              
              {/* Marco perimetral (sin marco inferior) */}
              <rect x={marcoWidth} y={marcoWidth} width={w - marcoWidth*2} height={h - marcoWidth - zocaloBottom} fill="url(#metallic)" stroke="#374151" strokeWidth="2" />
              {/* Vidrio */}
              <rect x={marcoWidth*2} y={marcoWidth*2} width={w - marcoWidth*4} height={h - zocaloBottom - marcoWidth*3} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
              
              {/* BISAGRAS IZQUIERDA (sutiles) */}
              <rect x={marcoWidth} y={h/2 - marcoWidth*4} width={marcoWidth/2} height={marcoWidth*8} fill="#4b5563" rx="1" />
              <rect x={marcoWidth} y={h/2 - marcoWidth*10} width={marcoWidth/2} height={marcoWidth*8} fill="#4b5563" rx="1" />
              <rect x={marcoWidth} y={h/2 + marcoWidth*4} width={marcoWidth/2} height={marcoWidth*8} fill="#4b5563" rx="1" />
              
              {/* MANIJÓN LARGO (picaporte realista) */}
              <rect x={w - marcoWidth*3} y={h/2 - marcoWidth*8} width={marcoWidth} height={marcoWidth*16} fill="#4b5563" rx="3" />
              <circle cx={w - marcoWidth*2.5} cy={h/2} r={marcoWidth} fill="#1f2937" />
              <rect x={w - marcoWidth*3.5} y={h/2 - marcoWidth*2} width={marcoWidth*2} height={marcoWidth*4} fill="#1f2937" rx="2" />
            </>
          )}

          {tipologia === "fijo" && (
            <>
              {/* PAÑO FIJO - marco simple + vidrio con reflejo sutil */}
              <rect x={marcoWidth} y={marcoWidth} width={w - marcoWidth*2} height={h - marcoWidth - zocaloBottom} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
              
              {/* Reflejo diagonal (líneas finas) */}
              <line x1={marcoWidth} y1={marcoWidth} x2={marcoWidth + (w - marcoWidth*2)*0.3} y2={marcoWidth + (h - marcoWidth - zocaloBottom)*0.3} stroke="white" strokeWidth="1" strokeOpacity="0.3" />
              <line x1={marcoWidth + (w - marcoWidth*2)*0.1} y1={marcoWidth} x2={marcoWidth + (w - marcoWidth*2)*0.4} y2={marcoWidth + (h - marcoWidth - zocaloBottom)*0.3} stroke="white" strokeWidth="1" strokeOpacity="0.3" />
              <line x1={marcoWidth} y1={marcoWidth + (h - marcoWidth - zocaloBottom)*0.1} x2={marcoWidth + (w - marcoWidth*2)*0.3} y2={marcoWidth + (h - marcoWidth - zocaloBottom)*0.4} stroke="white" strokeWidth="1" strokeOpacity="0.3" />
            </>
          )}
        </g>
      </svg>
      
      {/* Indicadores de Medidas on Hover */}
      <div className="absolute bottom-2 right-4 text-xs font-mono text-muted-foreground bg-white/80 px-2 py-1 rounded shadow-sm opacity-50 group-hover:opacity-100 transition-opacity">
        {w} x {h} mm
      </div>
    </div>
  );
}
