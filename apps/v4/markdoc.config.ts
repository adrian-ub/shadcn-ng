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
    paragraph: {
      ...nodes.paragraph,
      render: component('./mdoc-components/Paragraph.astro'),
    },
    list: {
      ...nodes.list,
      render: component('./mdoc-components/List.astro'),
    },
    item: {
      ...nodes.item,
      render: component('./mdoc-components/item.astro'),
    },
  },
})
