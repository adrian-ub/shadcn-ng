import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
import angular from "@analogjs/astro-angular";

import { siteConfig } from "./src/config/site";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.url,
  integrations: [
    angular(),
    starlight({
      title: siteConfig.name,
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
      },
      favicon: "./src/assets/logo-dark.svg",
      social: {
        github: siteConfig.links.github,
        "x.com": siteConfig.links.twitter,
      },
      sidebar: [
        {
          label: "Getting Started",
          autogenerate: {
            directory: "docs",
          },
        },
      ],
      customCss: ["./src/tailwind.css"],
      components: {
        Header: "./src/components/starlight/header/Header.astro",
        PageFrame: "./src/components/starlight/PageFrame.astro",
        SiteTitle: "./src/components/starlight/SiteTitle.astro",
        SocialIcons: "./src/components/starlight/SocialIcons.astro",
        Search: "./src/components/starlight/Search.astro",
        Hero: "./src/components/starlight/Hero.astro",
        ContentPanel: "./src/components/starlight/ContentPanel.astro",
        PageTitle: "./src/components/starlight/PageTitle.astro",
        MarkdownContent: "./src/components/starlight/MarkdownContent.astro",
        TwoColumnContent: "./src/components/starlight/TwoColumnContent.astro",
        Sidebar: "./src/components/starlight/Sidebar.astro",
      },
    }),
    tailwind(),
  ],
});
