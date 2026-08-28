/** @type {import('tailwindcss').Config} */

/* Reads a channel-triple CSS variable (see src/global.css) and returns a
   colour that still honours Tailwind's slash-opacity syntax. */
const token = (name) => ({ opacityValue }) =>
  opacityValue === undefined
    ? `rgb(var(${name}))`
    : `rgb(var(${name}) / ${opacityValue})`;

const primary = {
  100: token('--primary-100'),
  200: token('--primary-200'),
  300: token('--primary-300'),
  400: token('--primary-400'),
  500: token('--primary-500'),
  DEFAULT: token('--primary-400'),
};

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // `primary-*` is the canonical name for new work.
        primary,
        // `amber-*` is aliased to the same tokens so the existing markup
        // across the site recolours from global.css without a rewrite.
        amber: primary,
        surface: token('--surface'),
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 500ms ease-out both',
        'scroll-cue': 'scroll-cue 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite',
      },
    },
  },
  plugins: [],
}
