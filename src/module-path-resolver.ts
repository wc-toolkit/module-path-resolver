/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from "./logger.js";
import type { ModulePathResolverOptions } from "./types.js";
import { createOutDir, saveFile } from "./utilities.js";
import type * as cem from "custom-elements-manifest";

let log: Logger;
let userOptions: ModulePathResolverOptions = {
  outdir: "./",
  fileName: "custom-elements.json",
};

export function resolveModulePaths(
  cem: unknown,
  options: ModulePathResolverOptions = {}
) {
  log = new Logger(options.debug);
  if (options.skip) {
    log.yellow("[module-path-resolver] - Skipped");
    return;
  }

  updateOptions(options);
  log.log("[module-path-resolver] - Updating Custom Elements Manifest...");
  updateCemModules(cem);
  if (!options.usedByPlugin) {
    createOutDir(userOptions.outdir!);
    saveFile(
      userOptions.outdir!,
      userOptions.fileName!,
      JSON.stringify(cem, null, 2)
    );
  }
  log.green("[module-path-resolver] - Custom Elements Manifest updated.");
}

function updateOptions(options: ModulePathResolverOptions = {}) {
  userOptions = { ...userOptions, ...options };
}

function updateCemModules(cem: unknown) {
  (cem as cem.Package).modules.forEach((module) => {
    const ogPath = module.path;
    const originalDeclarations = cloneJson(module.declarations ?? []);
    const originalExports = cloneJson(module.exports ?? []);
    const ces = module.declarations?.filter(
      (d) => (d as cem.CustomElementDeclaration).customElement
    ) as cem.CustomElementDeclaration[];

    const ce = ces.length ? ces[0] : undefined;

    if (userOptions.modulePathTemplate) {
      module.path = userOptions.modulePathTemplate!(
        ogPath,
        ce?.name,
        ce?.tagName
      );
      module.declarations = updateModuleReferences(
        cloneJson(originalDeclarations),
        ce?.name,
        ce?.tagName
      );
      module.exports = updateModuleReferences(
        cloneJson(originalExports),
        ce?.name,
        ce?.tagName
      );

      log.log(
        `[module-path-resolver] - Updated module path: ${module.path}`
      );
    }

    if (ces.length && userOptions.typeDefinitionPathTemplate) {
      ces.forEach((ce) => {
        const typeDefPath = userOptions.typeDefinitionPathTemplate!(
          ogPath,
          ce.name,
          ce.tagName
        );

        (module as any)["typeDefinitionPath"] = typeDefPath;

        log.log(
          `[module-path-resolver] - Added type definition path to ${ce.name}: ${typeDefPath}`
        );
      });
    }

    if (ces.length && userOptions.definitionPathTemplate) {
      ces.forEach((ce) => {
        const resolvedModulePath = userOptions.modulePathTemplate
          ? userOptions.modulePathTemplate!(ogPath, ce.name, ce.tagName)
          : module.path;
        const exportPath = userOptions.definitionPathTemplate!(
          ogPath,
          ce.name,
          ce.tagName
        );

        (cem as cem.Package).modules.push({
          kind: "javascript-module",
          path: exportPath,
          deprecated: ce.deprecated || false,
          declarations: [],
          exports: [
            {
              kind: "custom-element-definition",
              name: ce.tagName || ce.name,
              declaration: {
                name: ce.name,
                module: resolvedModulePath,
              },
            },
          ],
        });

        log.log(
          `[module-path-resolver] - Added definition export for ${ce.name}: ${exportPath}`
        );
      });
    }
  });
}

function updateModuleReferences<T>(
  value: T,
  name?: string,
  tagName?: string
): T {
  if (Array.isArray(value)) {
    return value.map((item) => updateModuleReferences(item, name, tagName)) as T;
  }

  if (isObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        if (key === "module" && typeof nestedValue === "string") {
          return [key, applyModulePathTemplate(nestedValue, name, tagName)];
        }

        return [key, updateModuleReferences(nestedValue, name, tagName)];
      })
    ) as T;
  }

  return value;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function applyModulePathTemplate(
  modulePath: string,
  name?: string,
  tagName?: string
) {
  if (!userOptions.modulePathTemplate) {
    return modulePath;
  }

  const resolvedModulePath = userOptions.modulePathTemplate!(
    modulePath,
    name,
    tagName
  );

  return normalizeModulePath(resolvedModulePath);
}

function normalizeModulePath(modulePath: string) {
  const [protocol, ...segments] = modulePath.split("://");

  if (segments.length === 0) {
    return modulePath.replace(/\/{2,}/g, "/");
  }

  return `${protocol}://${segments.join("://").replace(/\/{2,}/g, "/")}`;
}
