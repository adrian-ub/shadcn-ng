import path from "path";
import {
  Config,
  RawConfig,
  getConfig,
  resolveConfigPaths,
} from "@/src/utils/get-config";
import fg from "fast-glob";
import fs, { pathExists } from "fs-extra";
import { loadConfig } from "tsconfig-paths";

const PROJECT_SHARED_IGNORE = ["**/node_modules/**", "dist", "coverage"];

export async function getProjectConfig(cwd: string): Promise<Config | null> {
  // Check for existing component config.
  const existingConfig = await getConfig(cwd);
  if (existingConfig) {
    return existingConfig;
  }

  const tailwindCssFile = await getTailwindCssFile(cwd);
  const tsConfigAliasPrefix = await getTsConfigAliasPrefix(cwd);

  if (!tailwindCssFile || !tsConfigAliasPrefix) {
    return null;
  }

  const isTsx = await isTypeScriptProject(cwd);

  const config: RawConfig = {
    $schema: "https://ui.adrianub.dev/schema.json",
    style: "new-york",
    tailwind: {
      config: isTsx ? "tailwind.config.ts" : "tailwind.config.js",
      baseColor: "zinc",
      css: tailwindCssFile,
      cssVariables: true,
      prefix: "",
    },
    aliases: {
      utils: `${tsConfigAliasPrefix}/lib/utils`,
      components: `${tsConfigAliasPrefix}/components`,
    },
  };

  return await resolveConfigPaths(cwd, config);
}

export async function getTailwindCssFile(cwd: string) {
  const files = await fg.glob("**/*.css", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!files.length) {
    return null;
  }

  for (const file of files) {
    const contents = await fs.readFile(path.resolve(cwd, file), "utf8");
    // Assume that if the file contains `@tailwind base` it's the main css file.
    if (contents.includes("@tailwind base")) {
      return file;
    }
  }

  return null;
}

export async function getTsConfigAliasPrefix(cwd: string) {
  const tsConfig = await loadConfig(cwd);

  if (tsConfig?.resultType === "failed" || !tsConfig?.paths) {
    return null;
  }

  // This assume that the first alias is the prefix.
  for (const [alias, paths] of Object.entries(tsConfig.paths)) {
    if (paths.includes("./*") || paths.includes("./src/*")) {
      return alias.at(0);
    }
  }

  return null;
}

export async function isTypeScriptProject(cwd: string) {
  // Check if cwd has a tsconfig.json file.
  return pathExists(path.resolve(cwd, "tsconfig.json"));
}

export async function preFlight(cwd: string) {
  // We need Tailwind CSS to be configured.
  const tailwindConfig = await fg.glob("tailwind.config.*", {
    cwd,
    deep: 3,
    ignore: PROJECT_SHARED_IGNORE,
  });

  if (!tailwindConfig.length) {
    throw new Error(
      "Tailwind CSS is not installed. Visit https://tailwindcss.com/docs/installation to get started."
    );
  }

  return true;
}
