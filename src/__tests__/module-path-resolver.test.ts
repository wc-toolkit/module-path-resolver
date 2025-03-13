import { describe, expect, test } from "vitest";
import { resolveModulePaths } from "../module-path-resolver.js";
import { getAllComponents } from "@wc-toolkit/cem-utilities";
import manifest from "./shoelace-cem.json";
import newManifest from "../../demo/custom-elements.json";

describe("module-path-resolver", () => {
  resolveModulePaths(manifest, {
    modulePathTemplate: (modulePath) =>
      `dist/${modulePath.replace(".js", ".component.js")}`,
    typeDefinitionPathTemplate: (modulePath) =>
      `dist/${modulePath.replace(".js", ".component.d.ts")}`,
    definitionPathTemplate: (modulePath) => `dist/${modulePath}`,
    outdir: "./demo",
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

  test("should add ", async () => {
    // Arrange
    const allComponents = getAllComponents(newManifest);
    const allDefinitionExports = newManifest.modules.filter((module) =>
      module.exports.some((exp) => exp.kind === "custom-element-definition")
    );

    // Act

    // Assert
    expect(allComponents.length).toBe(allDefinitionExports.length);
  });
});
