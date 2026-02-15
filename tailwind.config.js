/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'arrow-black': '#0A0A0A',
        'arrow-charcoal': '#1A1A1A',
        'arrow-gray': '#2A2A2A',
        'arrow-silver': '#E8E8E8',
        'arrow-gold': '#D4AF37',
        'arrow-blue': '#1E40AF',
      },
      fontFamily: {
        'display': ['var(--font-playfair)'],
        'sans': ['var(--font-inter)'],
      },
    },
  },
  plugins: [],
}
