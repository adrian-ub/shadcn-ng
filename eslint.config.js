// @ts-check
import adrianub from '@adrianub/eslint-config'

export default adrianub(
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
