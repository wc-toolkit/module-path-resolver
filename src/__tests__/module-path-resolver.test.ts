import { describe, expect, test } from "vitest";
import { resolveModulePaths } from "../module-path-resolver.js";
import { getAllComponents } from "@wc-toolkit/cem-utilities";
import manifest from "./shoelace-cem.json";

function resolveDemoModulePath(modulePath: string) {
  const componentPath = modulePath.replace(".js", ".component.js");

  if (componentPath.startsWith("/src/")) {
    return componentPath.replace("/src/", "/dist/");
  }

  if (componentPath.startsWith("src/")) {
    return componentPath.replace("src/", "dist/");
  }

  return `dist/${componentPath}`;
}

describe("module-path-resolver", () => {
  const newManifest = JSON.parse(JSON.stringify(manifest));

  resolveModulePaths(newManifest, {
    modulePathTemplate: resolveDemoModulePath,
    typeDefinitionPathTemplate: (modulePath) =>
      `dist/${modulePath.replace(".js", ".component.d.ts")}`,
    definitionPathTemplate: (modulePath) => `dist/${modulePath}`,
    usedByPlugin: true,
  });

  test("should update `path` property on module", async () => {
    // Arrange
    const alert = newManifest.modules[0];

    // Act

    // Assert
    expect(alert.path).toBe("dist/components/alert/alert.component.js");
  });

  test("should add `typeDefinitionPath` property to module", async () => {
    // Arrange
    const alert = newManifest.modules[0];

    // Act

    // Assert
    expect(alert["typeDefinitionPath"]).toBe(
      "dist/components/alert/alert.component.d.ts"
    );
  });

  test("should update nested `exports` module references", async () => {
    // Arrange
    const alert = newManifest.modules[0];

    // Act

    // Assert
    expect(alert.exports[0].declaration?.module).toBe(
      "dist/components/alert/alert.component.js"
    );
  });

  test("should update nested `superclass` module references with the template", async () => {
    // Arrange
    const alert = newManifest.modules[0];

    // Act

    // Assert
    expect(alert.declarations[0].superclass?.module).toBe(
      "/dist/internal/shoelace-element.component.js"
    );
  });

  test("should add definition exports for every component", async () => {
    // Arrange
    const allComponents = getAllComponents(newManifest);
    const allDefinitionExports = newManifest.modules.filter((module: unknown) =>
      (module as { exports: unknown[] }).exports.some((exp: unknown) => (exp as { kind: string }).kind === "custom-element-definition")
    );

    // Act

    // Assert
    expect(allComponents.length).toBe(allDefinitionExports.length);
  });
});
