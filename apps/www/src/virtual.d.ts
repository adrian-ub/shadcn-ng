declare module "virtual:starlight/user-config" {
  const Config: import("@astrojs/starlight/types").StarlightConfig;
  export default Config;
}

declare module "virtual:starlight/user-images" {
  type ImageMetadata = import("astro").ImageMetadata;
  export const logos: {
    dark?: ImageMetadata;
    light?: ImageMetadata;
  };
}

declare module "virtual:starlight/project-context" {
  const ProjectContext: {
    root: string;
    srcDir: string;
    trailingSlash: import("astro").AstroConfig["trailingSlash"];
    build: {
      format: import("astro").AstroConfig["build"]["format"];
    };
  };
  export default ProjectContext;
}
