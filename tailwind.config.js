/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#03061a',
          900: '#06091f',
          800: '#0a1133',
          700: '#0f1a4d',
        },
        electric: {
          400: '#5aa6ff',
          500: '#2563eb',
          600: '#1e40af',
        },
        gold: {
          400: '#f0c674',
          500: '#d4a24c',
          600: '#b07c2c',
        },
        glass: {
          DEFAULT: 'rgba(255,255,255,0.06)',
          strong: 'rgba(255,255,255,0.10)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['Montserrat', 'system-ui', 'sans-serif'],
        // mono alias kept for backwards compat — points at Montserrat now.
        mono: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-glow': 'radial-gradient(circle at center, rgba(37,99,235,0.25), transparent 70%)',
        'gold-line': 'linear-gradient(90deg, transparent, rgba(212,162,76,0.6), transparent)',
      },
      boxShadow: {
        'glow-blue': '0 0 40px -10px rgba(37,99,235,0.6), 0 0 80px -20px rgba(90,166,255,0.35)',
        'glow-gold': '0 0 40px -10px rgba(212,162,76,0.5), 0 0 80px -20px rgba(240,198,116,0.3)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.05)',
      },
      backdropBlur: {
        xs: '2px',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spinSlow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        floaty: 'floaty 6s ease-in-out infinite',
        shine: 'shine 3s linear infinite',
        spinSlow: 'spinSlow 30s linear infinite',
      },
    },
  },
  plugins: [],
}
