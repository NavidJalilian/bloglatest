/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'inherit',
            a: {
              color: 'inherit',
              textDecoration: 'underline',
              fontWeight: '500',
            },
            '[class~="lead"]': {
              color: 'inherit',
            },
            strong: {
              color: 'inherit',
              fontWeight: '600',
            },
            'ol[type="A"]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a"]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="A" s]': {
              '--list-counter-style': 'upper-alpha',
            },
            'ol[type="a" s]': {
              '--list-counter-style': 'lower-alpha',
            },
            'ol[type="I"]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i"]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="I" s]': {
              '--list-counter-style': 'upper-roman',
            },
            'ol[type="i" s]': {
              '--list-counter-style': 'lower-roman',
            },
            'ol[type="1"]': {
              '--list-counter-style': 'decimal',
            },
            'ol > li': {
              position: 'relative',
            },
            'ol > li::marker': {
              fontWeight: '400',
              color: 'var(--tw-prose-counters)',
            },
            'ul > li': {
              position: 'relative',
            },
            'ul > li::marker': {
              color: 'var(--tw-prose-bullets)',
            },
            hr: {
              borderColor: 'var(--tw-prose-hr)',
              borderTopWidth: 1,
            },
            blockquote: {
              fontWeight: '500',
              fontStyle: 'italic',
              color: 'inherit',
              borderLeftWidth: '0.25rem',
              borderLeftColor: 'var(--tw-prose-quote-borders)',
              quotes: '"\\201C""\\201D""\\2018""\\2019"',
            },
            'blockquote p:first-of-type::before': {
              content: 'open-quote',
            },
            'blockquote p:last-of-type::after': {
              content: 'close-quote',
            },
            h1: {
              color: 'inherit',
              fontWeight: '800',
            },
            'h1 strong': {
              fontWeight: '900',
              color: 'inherit',
            },
            h2: {
              color: 'inherit',
              fontWeight: '700',
            },
            'h2 strong': {
              fontWeight: '800',
              color: 'inherit',
            },
            h3: {
              color: 'inherit',
              fontWeight: '600',
            },
            'h3 strong': {
              fontWeight: '700',
              color: 'inherit',
            },
            h4: {
              color: 'inherit',
              fontWeight: '600',
            },
            'h4 strong': {
              fontWeight: '700',
              color: 'inherit',
            },
            img: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            picture: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            'picture > img': {
              marginTop: '0',
              marginBottom: '0',
            },
            video: {
              marginTop: '2em',
              marginBottom: '2em',
            },
            kbd: {
              fontWeight: '500',
              fontFamily: 'inherit',
            },
            code: {
              color: 'inherit',
              fontWeight: '600',
            },
            'a code': {
              color: 'inherit',
            },
            'h1 code': {
              color: 'inherit',
            },
            'h2 code': {
              color: 'inherit',
            },
            'h3 code': {
              color: 'inherit',
            },
            'h4 code': {
              color: 'inherit',
            },
            'blockquote code': {
              color: 'inherit',
            },
            'thead th code': {
              color: 'inherit',
            },
            pre: {
              color: 'var(--tw-prose-pre-code)',
              backgroundColor: 'var(--tw-prose-pre-bg)',
              overflowX: 'auto',
              fontWeight: '400',
            },
            'pre code': {
              backgroundColor: 'transparent',
              borderWidth: '0',
              borderRadius: '0',
              padding: '0',
              fontWeight: 'inherit',
              color: 'inherit',
              fontSize: 'inherit',
              fontFamily: 'inherit',
              lineHeight: 'inherit',
            },
            'pre code::before': {
              content: 'none',
            },
            'pre code::after': {
              content: 'none',
            },
            table: {
              width: '100%',
              tableLayout: 'auto',
              textAlign: 'left',
              marginTop: '2em',
              marginBottom: '2em',
            },
            thead: {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-th-borders)',
            },
            'thead th': {
              color: 'inherit',
              fontWeight: '600',
              verticalAlign: 'bottom',
            },
            'tbody tr': {
              borderBottomWidth: '1px',
              borderBottomColor: 'var(--tw-prose-td-borders)',
            },
            'tbody tr:last-child': {
              borderBottomWidth: '0',
            },
            'tbody td': {
              verticalAlign: 'baseline',
            },
            tfoot: {
              borderTopWidth: '1px',
              borderTopColor: 'var(--tw-prose-th-borders)',
            },
            'tfoot td': {
              verticalAlign: 'top',
            },
          },
        },
        invert: {
          css: {
            '--tw-prose-body': 'var(--tw-prose-invert-body)',
            '--tw-prose-headings': 'var(--tw-prose-invert-headings)',
            '--tw-prose-lead': 'var(--tw-prose-invert-lead)',
            '--tw-prose-links': 'var(--tw-prose-invert-links)',
            '--tw-prose-bold': 'var(--tw-prose-invert-bold)',
            '--tw-prose-counters': 'var(--tw-prose-invert-counters)',
            '--tw-prose-bullets': 'var(--tw-prose-invert-bullets)',
            '--tw-prose-hr': 'var(--tw-prose-invert-hr)',
            '--tw-prose-quotes': 'var(--tw-prose-invert-quotes)',
            '--tw-prose-quote-borders': 'var(--tw-prose-invert-quote-borders)',
            '--tw-prose-captions': 'var(--tw-prose-invert-captions)',
            '--tw-prose-kbd': 'var(--tw-prose-invert-kbd)',
            '--tw-prose-kbd-shadows': 'var(--tw-prose-invert-kbd-shadows)',
            '--tw-prose-code': 'var(--tw-prose-invert-code)',
            '--tw-prose-pre-code': 'var(--tw-prose-invert-pre-code)',
            '--tw-prose-pre-bg': 'var(--tw-prose-invert-pre-bg)',
            '--tw-prose-th-borders': 'var(--tw-prose-invert-th-borders)',
            '--tw-prose-td-borders': 'var(--tw-prose-invert-td-borders)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
