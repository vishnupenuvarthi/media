/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#b3131b',
        secondary: '#1b1c1d',
        accent: '#ffcc00',
        ink: '#262626',
        smoke: '#f5f5f5',
        'card-muted': '#faf7f5'
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['"Source Sans 3"', 'sans-serif'],
        cond: ['"Archivo Narrow"', 'sans-serif']
      },
      boxShadow: {
        newsroom: '0 25px 50px -12px rgba(0,0,0,0.25)'
      }
    }
  },
  plugins: []
};

