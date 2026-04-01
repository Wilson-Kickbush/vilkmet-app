// Componente Logo VILKMET — SVG vectorial basado en identidad de marca
// Isotipo: Rectángulo con V | K (barra naranja como separador de marca)

interface VilkmetLogoProps {
  variant?: "isotipo" | "horizontal" | "vertical";
  theme?: "dark" | "light"; // dark = colores para fondo oscuro, light = para fondo claro
  width?: number;
  height?: number;
  className?: string;
}

export function VilkmetLogo({
  variant = "horizontal",
  theme = "light",
  width,
  height,
  className = "",
}: VilkmetLogoProps) {
  const primary = theme === "dark" ? "#FFFFFF" : "#1A3A52";
  const accent = "#E85D04";

  if (variant === "isotipo") {
    return (
      <svg
        viewBox="0 0 80 60"
        width={width ?? 64}
        height={height ?? 48}
        className={className}
        aria-label="VILKMET Isotipo"
        role="img"
      >
        {/* Marco rectángulo */}
        <rect x="2" y="2" width="76" height="56" fill="none" stroke={primary} strokeWidth="3" />
        {/* Letra V */}
        <text
          x="14"
          y="44"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="36"
          fontWeight="900"
          fill={primary}
        >
          V
        </text>
        {/* Línea divisoria naranja */}
        <line x1="40" y1="10" x2="40" y2="50" stroke={accent} strokeWidth="4" />
        {/* Letra K */}
        <text
          x="44"
          y="44"
          fontFamily="Arial Black, Arial, sans-serif"
          fontSize="36"
          fontWeight="900"
          fill={primary}
        >
          K
        </text>
      </svg>
    );
  }

  if (variant === "vertical") {
    return (
      <svg
        viewBox="0 0 200 160"
        width={width ?? 140}
        height={height ?? 112}
        className={className}
        aria-label="VILKMET Logo Vertical"
        role="img"
      >
        {/* Isotipo centrado */}
        <g transform="translate(60, 8)">
          <rect x="2" y="2" width="76" height="56" fill="none" stroke={primary} strokeWidth="3" />
          <text x="14" y="44" fontFamily="Arial Black, Arial, sans-serif" fontSize="36" fontWeight="900" fill={primary}>V</text>
          <line x1="40" y1="10" x2="40" y2="50" stroke={accent} strokeWidth="4" />
          <text x="44" y="44" fontFamily="Arial Black, Arial, sans-serif" fontSize="36" fontWeight="900" fill={primary}>K</text>
        </g>
        {/* Wordmark */}
        <text
          x="100"
          y="96"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="22"
          fontWeight="700"
          letterSpacing="10"
          fill={primary}
        >
          VILKMET
        </text>
        {/* Tagline */}
        <text
          x="100"
          y="118"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          fontSize="6.5"
          letterSpacing="1"
          fill={theme === "dark" ? "rgba(255,255,255,0.6)" : "#6B7280"}
        >
          ABERTURAS QUE PROTEGEN Y EMBELLECEN TU HOGAR
        </text>
      </svg>
    );
  }

  // variant === "horizontal" (default)
  return (
    <svg
      viewBox="0 0 280 70"
      width={width ?? 200}
      height={height ?? 50}
      className={className}
      aria-label="VILKMET Logo"
      role="img"
    >
      {/* Isotipo */}
      <g transform="translate(5, 5)">
        <rect x="2" y="2" width="60" height="44" fill="none" stroke={primary} strokeWidth="2.5" />
        <text x="10" y="34" fontFamily="Arial Black, Arial, sans-serif" fontSize="28" fontWeight="900" fill={primary}>V</text>
        <line x1="31" y1="8" x2="31" y2="38" stroke={accent} strokeWidth="3.5" />
        <text x="35" y="34" fontFamily="Arial Black, Arial, sans-serif" fontSize="28" fontWeight="900" fill={primary}>K</text>
      </g>
      {/* Wordmark */}
      <text
        x="82"
        y="32"
        fontFamily="Arial, sans-serif"
        fontSize="22"
        fontWeight="800"
        letterSpacing="4"
        fill={primary}
      >
        VILKMET
      </text>
      {/* Tagline Simplificado */}
      <text
        x="82"
        y="48"
        fontFamily="Arial, sans-serif"
        fontSize="8"
        fontWeight="600"
        letterSpacing="1.5"
        fill={theme === "dark" ? "rgba(255,255,255,0.7)" : "#6B7280"}
      >
        ABERTURAS DE AUTOR
      </text>
    </svg>
  );
}
