interface SimuladorVisualProps {
  tipologia: "corrediza" | "abrir" | "fijo";
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
    <div className="w-full bg-slate-50 border rounded-lg p-6 shadow-sm aspect-video flex items-center justify-center relative overflow-hidden group">
      {/* Marca de Agua V|K Isotipo */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none">
        <span className="font-heading font-black text-[25vw] text-primary tracking-tighter mix-blend-multiply">
          V<span className="text-accent">|</span>K
        </span>
      </div>

      <svg 
        viewBox={`0 0 ${w + 100} ${h + 100}`} 
        className="w-full h-full max-h-[400px] transition-all duration-700 ease-in-out drop-shadow-2xl z-10"
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
              
              {/* Manija Herradura / Picaporte */}
              <path d={`M ${marcoWidth*2.5} ${h/2} C ${marcoWidth*3.5} ${h/2 - 20}, ${marcoWidth*3.5} ${h/2 + 20}, ${marcoWidth*2.5} ${h/2 + 40}`} fill="none" stroke="#4b5563" strokeWidth="8" strokeLinecap="round" />
            </>
          )}

          {tipologia === "fijo" && (
            <>
              {/* PAÑO FIJO - solo vidrio clavado al marco */}
              <rect x={marcoWidth} y={marcoWidth} width={w - marcoWidth*2} height={h - marcoWidth - zocaloBottom} fill="url(#glassGradient)" stroke="#9ca3af" strokeWidth="1" />
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
