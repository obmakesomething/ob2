/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Swiss style grayscale hierarchy (dark mode)
        dark: {
          bg: '#000000',           // Pure black base
          surface: '#0d0d0d',      // Level 1 surface
          'surface-2': '#1a1a1a',  // Level 2 surface
          'surface-3': '#262626',  // Level 3 surface
          border: '#333333',       // Border
          'border-light': '#404040', // Light border
          hover: '#1a1a1a',        // Hover state
          text: {
            primary: '#ffffff',    // Pure white for max contrast
            secondary: '#b3b3b3',  // Mid-gray
            tertiary: '#808080',   // Light gray
            quaternary: '#595959', // Even lighter gray
            disabled: '#404040',   // Disabled state
          },
        },
        // Swiss style grayscale hierarchy (light mode)
        light: {
          bg: '#ffffff',           // Pure white base
          surface: '#fafafa',      // Level 1 surface
          'surface-2': '#f5f5f5',  // Level 2 surface
          'surface-3': '#efefef',  // Level 3 surface
          border: '#d9d9d9',       // Border
          'border-light': '#e6e6e6', // Light border
          hover: '#f5f5f5',        // Hover state
          text: {
            primary: '#000000',    // Pure black for max contrast
            secondary: '#4d4d4d',  // Dark gray
            tertiary: '#808080',   // Mid gray
            quaternary: '#b3b3b3', // Light gray
            disabled: '#cccccc',   // Disabled state
          },
        },
        // Minimal accent colors (Swiss style typically uses red/blue)
        accent: {
          primary: '#0066cc',      // Swiss blue
          red: '#cc0000',          // Swiss red
          success: '#008844',      // Muted green
          warning: '#cc6600',      // Muted orange
          danger: '#cc0000',       // Red
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'base': ['1rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
      },
      spacing: {
        'paragraph': '1rem', // Generous spacing between paragraphs
      },
      gridTemplateColumns: {
        // Swiss grid system
        'swiss-8': 'repeat(8, 1fr)',
        'swiss-12': 'repeat(12, 1fr)',
      },
      transitionDuration: {
        'smooth': '150ms', // Faster, more responsive
      },
      animation: {
        'fade-in': 'fadeIn 150ms ease-out',
        'slide-in': 'slideIn 150ms ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
