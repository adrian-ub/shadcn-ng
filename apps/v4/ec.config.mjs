/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */
export default {
  themes: ['github-dark', 'github-light-default'],
  styleOverrides: {
    codeBackground: 'var(--color-code)',
    borderWidth: '0px',
    borderRadius: 'var(--radius)',
    borderColor: 'transparent',
    frames: {
      shadowColor: 'transparent',
    },
  },
}
