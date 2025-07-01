/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.css',
  ],
  theme: {
    extend: {
      colors: {
        // Alien Tech Color Palette
        'alien-black': '#0a0a23', // deep sci-fi black
        'alien-dark': '#1a1a1a',
        'alien-gray': '#2a2a2a',
        'alien-green': '#00ff41',
        'alien-green-glow': '#00ff41',
        'alien-cyan': '#00ffff',
        'alien-cyan-glow': '#00ffff',
        'alien-purple': '#8a2be2',
        'alien-purple-glow': '#8a2be2',
        'alien-plasma': '#ff00ff',
        'alien-void': '#1a0033',
        'alien-neon': '#00ff88',
        'alien-neon-glow': '#00ff88',
        // Glass effect colors
        'glass-dark': 'rgba(26, 26, 26, 0.8)',
        'glass-darker': 'rgba(10, 10, 10, 0.9)',
        'glass-border': 'rgba(0, 255, 65, 0.3)',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'audiowide': ['Audiowide', 'cursive'],
        'mono': ['JetBrains Mono', 'monospace'],
        'sci-fi': ['Orbitron', 'Audiowide', 'monospace'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
        'scan-wipe': 'scan-wipe 0.8s ease-out',
        'glitch-flicker': 'glitch-flicker 0.3s ease-in-out',
        'hexagon-float': 'hexagon-float 20s linear infinite',
        'border-glow': 'border-glow 3s ease-in-out infinite',
        'static-flicker': 'static-flicker 0.1s ease-in-out',
        'particle-trail': 'particle-trail 0.6s ease-out',
        'cursor-glow': 'cursor-glow 1s ease-in-out infinite alternate',
        'particle-fade': 'particle-fade 0.6s ease-out forwards',
      },
      keyframes: {
        'glow-pulse': {
          '0%': { 
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41, 0 0 15px #00ff41',
            textShadow: '0 0 5px #00ff41'
          },
          '100%': { 
            boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
            textShadow: '0 0 10px #00ff41, 0 0 20px #00ff41'
          }
        },
        'scan-wipe': {
          '0%': { 
            clipPath: 'inset(0 100% 0 0)',
            opacity: '0'
          },
          '50%': { 
            opacity: '1'
          },
          '100%': { 
            clipPath: 'inset(0 0% 0 0)',
            opacity: '1'
          }
        },
        'glitch-flicker': {
          '0%, 100%': { 
            transform: 'translate(0)',
            opacity: '1'
          },
          '10%': { 
            transform: 'translate(-2px, 2px)',
            opacity: '0.8'
          },
          '20%': { 
            transform: 'translate(2px, -2px)',
            opacity: '0.9'
          },
          '30%': { 
            transform: 'translate(-2px, -2px)',
            opacity: '0.7'
          },
          '40%': { 
            transform: 'translate(2px, 2px)',
            opacity: '1'
          }
        },
        'hexagon-float': {
          '0%': { transform: 'translateY(0px) rotate(0deg)' },
          '100%': { transform: 'translateY(-100vh) rotate(360deg)' }
        },
        'border-glow': {
          '0%, 100%': { 
            borderColor: 'rgba(0, 255, 65, 0.3)',
            boxShadow: '0 0 5px rgba(0, 255, 65, 0.3)'
          },
          '50%': { 
            borderColor: 'rgba(0, 255, 65, 0.8)',
            boxShadow: '0 0 15px rgba(0, 255, 65, 0.8)'
          }
        },
        'static-flicker': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' }
        },
        'particle-trail': {
          '0%': { 
            transform: 'scale(1)',
            opacity: '1'
          },
          '100%': { 
            transform: 'scale(0)',
            opacity: '0'
          }
        },
        'cursor-glow': {
          '0%': { 
            boxShadow: '0 0 5px #00ff41, 0 0 10px #00ff41',
            transform: 'scale(1)'
          },
          '100%': { 
            boxShadow: '0 0 10px #00ff41, 0 0 20px #00ff41, 0 0 30px #00ff41',
            transform: 'scale(1.2)'
          }
        },
        'particle-fade': {
          '0%': { 
            opacity: '0.8',
            transform: 'scale(1) translate(-50%, -50%)'
          },
          '100%': { 
            opacity: '0',
            transform: 'scale(0.5) translate(-50%, -50%)'
          }
        }
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundImage: {
        'hexagon-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300ff41' fill-opacity='0.05'%3E%3Cpath d='M30 0l30 17.32v34.64L30 69.28 0 51.96V17.32L30 0z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        'circuit-pattern': "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%2300ff41' stroke-width='0.5' stroke-opacity='0.1'%3E%3Cpath d='M10 10h20v20h-20z'/%3E%3Cpath d='M70 70h20v20h-20z'/%3E%3Cpath d='M10 70h20v20h-20z'/%3E%3Cpath d='M70 10h20v20h-20z'/%3E%3Cline x1='30' y1='20' x2='70' y2='20'/%3E%3Cline x1='30' y1='80' x2='70' y2='80'/%3E%3Cline x1='20' y1='30' x2='20' y2='70'/%3E%3Cline x1='80' y1='30' x2='80' y2='70'/%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
