import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import tailwind from "@astrojs/tailwind";
// import angular from "@analogjs/astro-angular";

// https://astro.build/config
export default defineConfig({
  integrations: [
    // angular(),
    starlight({
      title: "shadcn-ng",
      logo: {
        dark: "./src/assets/logo-dark.svg",
        light: "./src/assets/logo-light.svg",
      },
      favicon: "./src/assets/logo-dark.svg",
      social: {
        github: "https://github.com/adrian-ub/shadcn-ng",
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
    }),
    tailwind({
      applyBaseStyles: false,
    }),
  ],
});
