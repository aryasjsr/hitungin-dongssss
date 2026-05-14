/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#fbf9f4',
          surface: '#ffffff',
          elevated: '#f0eee9',
          overlay: '#e4e2dd'
        },
        border: {
          DEFAULT: '#000000',
          subtle: '#747871'
        },
        accent: {
          primary: '#061907',
          secondary: '#3f6652',
          soft: '#c1edd2',
          hover: '#1a2e1a'
        },
        brand: {
          success: '#22c55e',
          warning: '#f59e0b',
          error: '#ba1a1a',
          info: '#3f6652'
        },
        text: {
          primary: '#061907',
          secondary: '#434841',
          muted: '#747871',
          inverse: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Archivo Narrow', 'Arial Narrow', 'system-ui', 'sans-serif'],
        display: ['Libre Caslon Text', 'Georgia', 'serif'],
        mono: ['Archivo Narrow', 'JetBrains Mono', 'monospace']
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '28px'
      },
      boxShadow: {
        card: '4px 4px 0 0 #000000',
        glow: '6px 6px 0 0 #000000'
      }
    }
  },
  plugins: []
};
