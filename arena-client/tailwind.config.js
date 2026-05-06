/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        pulseFast: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.95, transform: 'scale(0.99)' },
        },
        headShake: {
            '0%': { transform: 'translateX(0)' },
            '6.5%': { transform: 'translateX(-6px) rotateY(-9deg)' },
            '18.5%': { transform: 'translateX(5px) rotateY(7deg)' },
            '31.5%': { transform: 'translateX(-3px) rotateY(-5deg)' },
            '43.5%': { transform: 'translateX(2px) rotateY(3deg)' },
            '50%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(30px) scale(0.9)' },
          '100%': { opacity: 1, transform: 'translateX(0) scale(1)' },
        },
        // NEW: Makes the VS text explode during a clash
        clashExplode: {
          '0%': { transform: 'scale(1)', textShadow: '0px 0px 0px rgba(255,255,0,0)' },
          '50%': { transform: 'scale(1.8)', color: '#fbbf24', textShadow: '0px 0px 20px rgba(255,255,0,1)' },
          '100%': { transform: 'scale(1)', textShadow: '0px 0px 0px rgba(255,255,0,0)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.4s ease-out',
        pulseFast: 'pulseFast 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        headShake: 'headShake 0.5s ease-in-out',
        slideInRight: 'slideInRight 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
        clashExplode: 'clashExplode 0.6s ease-in-out forwards',
      },
    },
  },
  plugins: [],
}