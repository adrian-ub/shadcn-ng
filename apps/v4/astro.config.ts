import { defineConfig } from "astro/config";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import nimbus, { defineConfig as defineNimbusConfig } from "@cloudflare/nimbus-docs";
import { tableScroll } from "@cloudflare/nimbus-docs/markdown";

const nimbusConfig = defineNimbusConfig({
  site: "https://ui.adrianub.dev",
  title: "shadcn-ng",
  description: "A set of beautifully designed components that you can customize, extend, and build on. Start here then make it your own. Open Source. Open Code.",
  locale: "en",
  github: "https://github.com/adrian-ub/shadcn-ng",
  socialImageAlt: "Nimbus documentation preview",
  sidebar: {
    items: [
      {
        label: 'Sections',
        items: [
          'docs'
        ]
      },
      {
        label: 'Components',
        autogenerate: { collection: "components" },
      }
    ]
  }
});

export default defineConfig({
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  integrations: [
    icon(),
    nimbus(nimbusConfig, {
      rules: {
        "nimbus/frontmatter-shape": "error",
        "nimbus/internal-link": "error",
      },
      markdown: {
        hastPlugins: [tableScroll()],
      },
    }),
  ],
});
