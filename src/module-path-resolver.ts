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
    const ces = module.declarations?.filter(
      (d) => (d as cem.CustomElementDeclaration).customElement
    ) as cem.CustomElementDeclaration[];

    if (ces.length) {
      ces.forEach((ce) => {
        if (userOptions.modulePathTemplate) {
          module.path = userOptions.modulePathTemplate!(
            ogPath,
            ce.name,
            ce.tagName
          );

          log.log(
            `[module-path-resolver] - Updated ${ce.name}'s module path: ${module.path}`
          );
        }

        if (userOptions.typeDefinitionPathTemplate) {
          const typeDefPath = userOptions.typeDefinitionPathTemplate!(
            ogPath,
            ce.name,
            ce.tagName
          );

          (module as any)["typeDefinitionPath"] = typeDefPath;

          log.log(
            `[module-path-resolver] - Added type definition path to ${ce.name}: ${typeDefPath}`
          );
        }

        if (userOptions.definitionPathTemplate) {
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
                  module: module.path,
                },
              },
            ],
          });

          log.log(
            `[module-path-resolver] - Added definition export for ${ce.name}: ${exportPath}`
          );
        }
      });
    }
  });
}
