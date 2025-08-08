// import type { Config } from 'tailwindcss'

// export default {
//   content: [],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// } satisfies Config

// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{vue,js,ts}',
    './app/components/**/*.{vue,js,ts}', // <-- add this line
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#081735',
          light: '#686868',
          medium: '#1E1E1E'
        },
        secondary: {
          DEFAULT: '#2C73DB',
          light: '#F9FBFF',
          medium: '#E8EEF9'
        },
        'base-light': '#F7FAFF',
        border: {
          DEFAULT: '#D7DCE4',
        },
        background: '#FDFBF9'
      },
      textColor: {
        'on-primary': '#262628',
        'on-secondary': '#2B3239',
        'on-light': '#6B7397',
        'on-background': '#6B7397'
      },
      boxShadow: {
        'shadow-light': '0px 1px 14px rgba(84, 74, 116, 0.14)'
      },
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'], // use class font-manrope
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '769px',
        // => @media (min-width: 768px) { ... }

        'lg': '1025px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1281px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    }
  },
  plugins: []
}

export default config
