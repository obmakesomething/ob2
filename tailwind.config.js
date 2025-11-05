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
        // Minimal dark mode palette
        dark: {
          bg: '#0a0a0a',
          surface: '#141414',
          border: '#1f1f1f',
          hover: '#1a1a1a',
          text: {
            primary: '#fafafa',
            secondary: '#a3a3a3',
            tertiary: '#737373',
          },
        },
        // Minimal light mode palette
        light: {
          bg: '#ffffff',
          surface: '#fafafa',
          border: '#e5e5e5',
          hover: '#f5f5f5',
          text: {
            primary: '#0a0a0a',
            secondary: '#525252',
            tertiary: '#a3a3a3',
          },
        },
        // Accent colors
        accent: {
          primary: '#3b82f6',
          success: '#10b981',
          warning: '#f59e0b',
          danger: '#ef4444',
        },
      },
      fontFamily: {
        sans: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
      },
      lineHeight: {
        'paragraph': '1.5',
      },
      spacing: {
        'paragraph': '0.75rem', // 1/2 line spacing between paragraphs
      },
      transitionDuration: {
        'smooth': '200ms',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-in-out',
        'slide-in': 'slideIn 200ms ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
