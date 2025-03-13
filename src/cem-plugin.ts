import { resolveModulePaths } from "./module-path-resolver.js";
import type { PackageLinkPhaseParams } from "@custom-elements-manifest/analyzer";
import type { ModulePathResolverOptions } from "./types.js";

export function modulePathResolverPlugin(options: ModulePathResolverOptions) {
  return {
    name: "@wc-toolkit/module-path-resolver",
    packageLinkPhase({ customElementsManifest }: PackageLinkPhaseParams) {
      options.usedByPlugin = true;
      resolveModulePaths(customElementsManifest, options);
    },
  };
}
