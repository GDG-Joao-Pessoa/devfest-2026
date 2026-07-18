import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: '#08080f',
        'bg-grad-top': '#141426',
        surface: 'rgba(255,255,255,0.03)',
        'surface-border': 'rgba(255,255,255,0.08)',
        text: '#f2f2f7',
        'text-muted': 'rgba(242,242,247,0.66)',
        'text-dim': 'rgba(242,242,247,0.5)',
        hairline: 'rgba(255,255,255,0.08)',
        gblue: '#4285F4',
        ggreen: '#34A853',
        gyellow: '#FBBC04',
        gred: '#EA4335'
      },
      boxShadow: {
        glow: '0 12px 34px -10px rgba(66,133,244,0.6)',
        float: '0 24px 60px -24px rgba(0,0,0,0.8)'
      },
      fontFamily: {
        sora: ['var(--font-sora)', 'sans-serif'],
        figtree: ['var(--font-figtree)', 'sans-serif'],
        ibm: ['var(--font-ibm)', 'monospace']
      },
      backgroundImage: {
        'hero-radial': 'radial-gradient(circle at top, rgba(66,133,244,0.12), transparent 32%), radial-gradient(circle at 20% 20%, rgba(52,168,83,0.08), transparent 24%), radial-gradient(circle at 80% 15%, rgba(251,188,4,0.08), transparent 24%), radial-gradient(circle at 50% 85%, rgba(234,67,53,0.08), transparent 30%)'
      }
    }
  },
  plugins: []
};

export default config;
