/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#f8fbda',
        linen: '#ECF39E',
        mist: '#f1f7cf',
        sage: '#90A955',
        moss: '#31562D',
        harbor: '#264622',
        ink: '#132A13',
      },
      boxShadow: {
        soft: '0 18px 50px rgba(19, 42, 19, 0.11)',
        lift: '0 24px 70px rgba(49, 86, 45, 0.16)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'care-gradient':
          'linear-gradient(135deg, rgba(248,251,218,0.98) 0%, rgba(236,243,158,0.56) 44%, rgba(144,169,85,0.30) 100%)',
      },
    },
  },
  plugins: [],
};
