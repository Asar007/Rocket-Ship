/**
 * MSE Engineers brand mark — hexagram + monogram.
 *
 * Rebuilt as inline SVG so the star and the 'MSE' / 'ENGINEERING' text
 * are mathematically nested rather than baked into a fixed-proportion
 * PNG. Stays crisp at any size and scales without overflow.
 */
export default function BrandMark({ className = '', glow = true }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label="Madras Swastic Engineers"
    >
      <defs>
        <linearGradient id="bm-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f6d18e" />
          <stop offset="55%" stopColor="#d4a24c" />
          <stop offset="100%" stopColor="#a36f1f" />
        </linearGradient>
        <radialGradient id="bm-core" cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="rgba(240,198,116,0.18)" />
          <stop offset="60%" stopColor="rgba(240,198,116,0.05)" />
          <stop offset="100%" stopColor="rgba(240,198,116,0)" />
        </radialGradient>
        <filter id="bm-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Soft inner glow under the star */}
      <circle cx="100" cy="100" r="78" fill="url(#bm-core)" />

      {/* Hexagram — two overlapping triangles, perfect equilateral pair */}
      <g
        fill="none"
        stroke="url(#bm-stroke)"
        strokeWidth="3.4"
        strokeLinejoin="round"
        strokeLinecap="round"
        filter={glow ? 'url(#bm-glow)' : undefined}
      >
        <polygon points="100,12 180.5,148 19.5,148" />
        <polygon points="100,188 19.5,52 180.5,52" />
      </g>

      {/* MSE monogram — sits in the central hexagonal void */}
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fontSize="38"
        fontWeight="700"
        letterSpacing="1"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fill="url(#bm-stroke)"
      >
        MSE
      </text>

      {/* Engineering tagline — small caps, below the monogram */}
      <text
        x="100"
        y="125"
        textAnchor="middle"
        fontSize="8.5"
        letterSpacing="3"
        fontWeight="500"
        fontFamily="Montserrat, system-ui, sans-serif"
        fill="url(#bm-stroke)"
      >
        ENGINEERING
      </text>
    </svg>
  )
}
