import type { Config } from 'tailwindcss';
export default {
  theme: {
    extend: {
      typography: () => ({
        DEFAULT: {
          css: {
            color: 'var(--color-sand-12)',
            '[class~="lead"]': {
              color: 'var(--color-amber-12)',
            },
            maxWidth: '75ch',
            a: {
              color: 'var(--color-amber-12)',
              textUnderlineOffset: '0.25em',
              textDecorationThickness: '0.125em',
              wordBreak: 'break-word',
            },
            'a:hover': {
              color: 'var(--color-amber-11)',
              textDecorationStyle: 'solid',
            },
            strong: {
              color: 'var(--color-amber-12)',
            },
            'a strong': {
              color: 'var(--color-amber-12)',
            },
            'blockquote strong': {
              color: 'var(--color-amber-11)',
            },
            'thead th strong': {
              color: 'var(--color-amber-12)',
            },
            'ol > li::marker': {
              color: 'var(--color-sand-11)',
            },
            'ul > li::marker': {
              color: 'var(--color-sand-12)',
            },
            dt: {
              color: 'var(--color-sand-12)',
            },
            blockquote: {
              color: 'var(--color-sand-12)',
            },
            'h1, h2, h3, h4': {
              scrollMarginTop: '2rem',
            },
            h1: {
              color: 'var(--color-amber-12)',
            },
            'h1 strong': {
              color: 'var(--color-amber-12)',
            },
            h2: {
              color: 'var(--color-amber-12)',
            },
            'h2 strong': {
              color: 'var(--color-amber-12)',
            },
            h3: {
              color: 'var(--color-amber-12)',
            },
            'h3 strong': {
              color: 'var(--color-amber-12)',
            },
            h4: {
              color: 'var(--color-amber-12)',
            },
            'h4 strong': {
              color: 'var(--color-amber-12)',
            },
            kbd: {
              color: 'var(--color-sand-12)',
            },
            code: {
              color: 'var(--color-amber-12)',
              fontSize: '1em',
            },
            'a code': {
              color: 'var(--color-amber-12)',
            },
            'h1 code': {
              color: 'var(--color-amber-12)',
            },
            'h2 code': {
              color: 'var(--color-amber-12)',
            },
            'h3 code': {
              color: 'var(--color-amber-12)',
            },
            'h4 code': {
              color: 'var(--color-amber-12)',
            },
            'blockquote code': {
              color: 'var(--color-amber-12)',
            },
            'thead th code': {
              color: 'var(--color-amber-12)',
            },
            pre: {
              maxWidth: 'calc(100vw - 2rem)',
              fontSize: '1em',
              borderRadius: '0.125rem',
            },
            'pre code': {},
            table: {
              width: 'auto',
              minWidth: '60%',
              maxWidth: '100%',
            },
            'thead th': {
              color: 'var(--color-sand-12)',
            },
            figcaption: {
              color: 'var(--color-sand-12)',
            },
          },
        },
      }),
    },
  },
} satisfies Config;
