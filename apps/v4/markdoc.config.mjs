import { component, defineMarkdocConfig } from '@astrojs/markdoc/config'
import starlightMarkdoc from '@astrojs/starlight-markdoc'

export default defineMarkdocConfig({
  extends: [starlightMarkdoc()],
  tags: {
    ComponentsList: {
      render: component('./src/components/ComponentsList.astro'),
      selfClosing: true,
    },
  },
})
