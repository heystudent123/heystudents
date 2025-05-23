/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#4F46E5', // Indigo-600 - Main brand color
        'primary-dark': '#3730A3', // Indigo-800 - Darker variant
        'primary-light': '#818CF8', // Indigo-400 - Lighter variant
        secondary: '#0EA5E9', // Sky-500 - Secondary color
        'secondary-dark': '#0369A1', // Sky-700 - Darker variant
        'secondary-light': '#7DD3FC', // Sky-300 - Lighter variant
        accent: '#F97316', // Orange-500 - Accent color for CTAs
        'accent-dark': '#C2410C', // Orange-700 - Darker variant
        'accent-light': '#FDBA74', // Orange-300 - Lighter variant
        neutral: '#F9FAFB', // Gray-50 - Light background
        'neutral-dark': '#1F2937', // Gray-800 - Dark text/background
        success: '#10B981', // Emerald-500 - Success states
        error: '#EF4444', // Red-500 - Error states
        warning: '#F59E0B', // Amber-500 - Warning states
        info: '#3B82F6' // Blue-500 - Info states
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 7px 14px 0 rgba(65, 69, 88, 0.1), 0 3px 6px 0 rgba(0, 0, 0, 0.07)'
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-in-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}