import { component, defineMarkdocConfig, nodes } from '@astrojs/markdoc/config'
import starlightMarkdoc from '@astrojs/starlight-markdoc'

export default defineMarkdocConfig({
  extends: [starlightMarkdoc({ headingLinks: false })],
  tags: {
    ComponentsList: {
      render: component('./src/components/ComponentsList.astro'),
      selfClosing: true,
    },
  },
  nodes: {
    heading: {
      ...nodes.heading,
      render: component('./mdoc-components/Heading.astro'),
    },
  },
})
