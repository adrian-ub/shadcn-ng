import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import angular from "@analogjs/astro-angular";
import { siteConfig } from "./src/config/site";
import theme from "./src/lib/highlighter-theme.json";
import simpleStackQuery from "simple-stack-query";

import AutoImport from "astro-auto-import";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [
    starlight({
      title: siteConfig.name,
      titleDelimiter: "-",
      expressiveCode: {
        themes: [theme],
        styleOverrides: {
          textMarkers: {
            markHue: "rgba(63,63,70,.5)",
          },
        },
      },
      logo: { src: "./src/assets/logo.svg" },
      favicon: "/favicon.ico",
      social: {
        github: siteConfig.links.github,
        "x.com": siteConfig.links.twitter,
      },
      sidebar: [
        {
          label: "Getting Started",
          items: [
            {
              label: "Introduction",
              slug: "docs",
            },
            {
              label: "Installation",
              slug: "docs/installation",
            },
            {
              label: "components.json",
              slug: "docs/components-json",
            },
            {
              label: "Theming",
              slug: "docs/theming",
            },
            {
              label: "CLI",
              slug: "docs/cli",
            },
            {
              label: "Typography",
              slug: "docs/components/typography",
            },
          ],
        },
        {
          label: "Components",
          autogenerate: {
            directory: "docs/components",
          },
        },
      ],
      customCss: ["./src/fonts/font-face.css", "./src/tailwind.css"],
      components: {
        Header: "./src/components/starlight/header/Header.astro",
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
        SocialIcons: "./src/components/starlight/SocialIcons.astro",
        Search: "./src/components/starlight/Search.astro",
        Hero: "./src/components/starlight/Hero.astro",
        ContentPanel: "./src/components/starlight/ContentPanel.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        MarkdownContent: "./src/components/starlight/MarkdownContent.astro",
        TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
        Pagination: "./src/components/starlight/Pagination.astro",
        MobileMenuToggle: "./src/components/starlight/MobileMenuToggle.astro",
        PageFrame: "./src/components/starlight/PageFrame.astro",
        PageSidebar: "./src/components/starlight/PageSidebar.astro",
      },
    }),
    AutoImport({
      imports: [
        "@/components/ComponentPreview.astro",
        "@/components/ComponentSource.astro",
      ],
    }),
    tailwind(),
    angular(),
    simpleStackQuery(),
  ],
  vite: {
    optimizeDeps: {
      include: [
        "@radix-ng/primitives",
        "@angular/common",
        "@angular/core",
        "@angular/cdk",
        "@ng-icons/core",
        "@ng-icons/lucide",
      ],
    },
    ssr: {
      noExternal: [
        "@radix-ng/primitives",
        "@angular/cdk",
        "@ng-icons/core",
        "@ng-icons/lucide",
      ],
    },
  },
});
