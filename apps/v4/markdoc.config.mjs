import { component, defineMarkdocConfig, nodes } from '@astrojs/markdoc/config'
import starlightMarkdoc from '@astrojs/starlight-markdoc'

export default defineMarkdocConfig({
  extends: [starlightMarkdoc({ headingLinks: false })],
  tags: {
    ComponentsList: {
      render: component('./src/components/ComponentsList.astro'),
      selfClosing: true,
    },
    ComponentPreview: {
      render: component('./src/components/ComponentPreview.astro'),
      selfClosing: true,
      attributes: {
        name: { type: String, required: true },
        description: { type: String, required: false },
        class: { type: String, required: false },
        align: { type: String, required: false, matches: ['center', 'start', 'end'] },
      },
    },
    CodeTabs: {
      render: component('./src/components/CodeTabs.astro'),
      attributes: {
        defaultValue: { type: String, required: false },
        syncKey: { type: String, required: true },
      },
    },
    Tabs: {
      render: component('./mdoc-components/components/tabs/Tabs.astro'),
      attributes: {
        defaultValue: { type: String, required: false },
        syncKey: { type: String, required: true },
      },
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
