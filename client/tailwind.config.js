/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // You can move the keyframes and animations here
      // to make them available as utility classes.
      keyframes: {
        'focus-pull': {
          '0%, 10%, 90%, 100%': {
            filter: 'blur(8px) brightness(0.7)',
          },
          '30%, 70%': {
            filter: 'blur(0px) brightness(1)',
          },
        },
        'shutter-flash': {
          '0%': {
            boxShadow: '0 0 0 0 rgba(255, 255, 255, 0.7)',
          },
          '100%': {
            boxShadow: '0 0 0 20px rgba(255, 255, 255, 0)',
          },
        },
      },
      animation: {
        'focus-pull': 'focus-pull 10s ease-in-out infinite',
        'shutter-flash': 'shutter-flash 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
