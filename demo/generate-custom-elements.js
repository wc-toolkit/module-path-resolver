import { resolveModulePaths } from "../dist/index.js";
import manifest from "../src/__tests__/shoelace-cem.json" with { type: "json" };

const demoManifest = JSON.parse(JSON.stringify(manifest));
const resolveDemoModulePath = (modulePath) => {
  const componentPath = modulePath.replace(".js", ".component.js");

  if (componentPath.startsWith("/src/")) {
    return componentPath.replace("/src/", "/dist/");
  }

  if (componentPath.startsWith("src/")) {
    return componentPath.replace("src/", "dist/");
  }

  return `dist/${componentPath}`;
};

resolveModulePaths(demoManifest, {
  modulePathTemplate: resolveDemoModulePath,
  typeDefinitionPathTemplate: (modulePath) =>
    `dist/${modulePath.replace(".js", ".component.d.ts")}`,
  definitionPathTemplate: (modulePath) => `dist/${modulePath}`,
  outdir: "./demo",
  fileName: "custom-elements.json",
});
