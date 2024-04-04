const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  // tailwind dark mode based on system preference but not if there's a light class on the html element
  darkMode: ['variant', '&:not(.light *)'],
  content: ['./app/**/*.{js,jsx,ts,tsx}', './content/**/*.md'],
  theme: {
    colors: {
      amber: {
        1: 'var(--amber-1)',
        2: 'var(--amber-2)',
        3: 'var(--amber-3)',
        4: 'var(--amber-4)',
        5: 'var(--amber-5)',
        6: 'var(--amber-6)',
        7: 'var(--amber-7)',
        8: 'var(--amber-8)',
        9: 'var(--amber-9)',
        10: 'var(--amber-10)',
        11: 'var(--amber-11)',
        12: 'var(--amber-12)',
      },
      sand: {
        1: 'var(--sand-1)',
        2: 'var(--sand-2)',
        3: 'var(--sand-3)',
        4: 'var(--sand-4)',
        5: 'var(--sand-5)',
        6: 'var(--sand-6)',
        7: 'var(--sand-7)',
        8: 'var(--sand-8)',
        9: 'var(--sand-9)',
        10: 'var(--sand-10)',
        11: 'var(--sand-11)',
        12: 'var(--sand-12)',
      },
    },
    extend: {
      fontFamily: {
        sans: ['Ubuntu', ...defaultTheme.fontFamily.sans],
        mono: ['Ubuntu Mono', ...defaultTheme.fontFamily.mono],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            color: 'var(--sand-12)',
            '[class~="lead"]': {
              color: 'var(--amber-12)',
            },
            a: {
              color: 'var(--amber-12)',
              textUnderlineOffset: '0.25em',
              textDecorationThickness: '0.125em',
            },
            'a:hover': {
              color: 'var(--amber-11)',
              textDecorationStyle: 'solid',
            },
            strong: {
              color: 'var(--amber-12)',
            },
            'a strong': {
              color: 'var(--amber-12)',
            },
            'blockquote strong': {
              color: 'var(--amber-11)',
            },
            'thead th strong': {
              color: 'var(--amber-12)',
            },
            'ol > li::marker': {
              color: 'var(--sand-11)',
            },
            'ul > li::marker': {
              color: 'var(--sand-12)',
            },
            dt: {
              color: 'var(--sand-12)',
            },
            blockquote: {
              color: 'var(--sand-12)',
            },
            h1: {
              color: 'var(--amber-12)',
            },
            'h1 strong': {
              color: 'var(--amber-12)',
            },
            h2: {
              color: 'var(--amber-12)',
            },
            'h2 strong': {
              color: 'var(--amber-12)',
            },
            h3: {
              color: 'var(--amber-12)',
            },
            'h3 strong': {
              color: 'var(--amber-12)',
            },
            h4: {
              color: 'var(--amber-12)',
            },
            'h4 strong': {
              color: 'var(--amber-12)',
            },
            kbd: {
              color: 'var(--sand-12)',
            },
            code: {
              color: 'var(--amber-12)',
            },
            'a code': {
              color: 'var(--amber-12)',
            },
            'h1 code': {
              color: 'var(--amber-12)',
            },
            'h2 code': {
              color: 'var(--amber-12)',
            },
            'h3 code': {
              color: 'var(--amber-12)',
            },
            'h4 code': {
              color: 'var(--amber-12)',
            },
            'blockquote code': {
              color: 'var(--amber-12)',
            },
            'thead th code': {
              color: 'var(--amber-12)',
            },
            pre: {
              color: 'var(--sand-12)',
              backgroundColor: '#22272e',
            },
            'pre code': {
              color: 'var(--sand-12)',
            },
            'thead th': {
              color: 'var(--sand-12)',
            },
            figcaption: {
              color: 'var(--sand-12)',
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/container-queries'),
  ],
};
