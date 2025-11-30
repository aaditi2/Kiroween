/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Spooky color palette
        'spooky-black': '#0a0a0a',
        'spooky-black-light': '#1a1a1a',
        'spooky-purple': '#a855f7',
        'spooky-purple-light': '#c084fc',
        'spooky-purple-dark': '#7e22ce',
        'spooky-green': '#10b981',
        'spooky-green-light': '#34d399',
        'spooky-red': '#ef4444',
        'spooky-red-light': '#f87171',
        'spooky-orange': '#f59e0b',
        'spooky-orange-light': '#fbbf24',
      },
      fontFamily: {
        creepster: ["'Creepster'", "cursive"],
        mono: ["'Space Mono'", "monospace"],
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(168, 85, 247, 0.5)',
        'glow-purple-intense': '0 0 30px rgba(168, 85, 247, 0.8)',
        'glow-green': '0 0 20px rgba(16, 185, 129, 0.5)',
        'glow-green-intense': '0 0 30px rgba(16, 185, 129, 0.8)',
        'glow-red': '0 0 20px rgba(239, 68, 68, 0.5)',
        'glow-red-intense': '0 0 30px rgba(239, 68, 68, 0.8)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'float-slow': 'float 4s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'fog-move': 'fogMove 20s linear infinite',
        'particle-drift': 'particleDrift 15s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        fogMove: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        particleDrift: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translate(100px, -100px) rotate(360deg)', opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};