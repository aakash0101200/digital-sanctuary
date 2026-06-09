/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanctuary: {
          linen: '#f4f1eb',
          ink: '#2b2927',
          sage: '#8a9a86',
          stone: '#d8d3c9',
        }
      },
      fontFamily: {
        heading: ['"Cormorant Garamond"', 'serif'],
        body: ['"Newsreader"', 'serif'],
      },
      spacing: {
        'reading': '65ch',
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
