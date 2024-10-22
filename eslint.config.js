// @ts-check
import antfu from '@antfu/eslint-config'

export default antfu(
  {
    type: 'lib',
    astro: true,
    markdown: true,
    formatters: {
      astro: true,
      css: true,
      html: true,
      markdown: true,
      svg: true,
    },
  },
)
