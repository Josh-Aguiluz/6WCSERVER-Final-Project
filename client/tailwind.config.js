/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Map the CSS variables from index.css to Tailwind class names
        'primary-green': 'var(--color-primary-green)',
        'secondary-green': 'var(--color-secondary-green)',
        'dark-green': 'var(--color-dark-green)',
        'footer-green': 'var(--color-footer-green)',
        'accent-orange': 'var(--color-accent-orange)',
        'app-bg': 'var(--color-background)', // Use this for the main body/app background
      },
    },
  },
  plugins: [],
}