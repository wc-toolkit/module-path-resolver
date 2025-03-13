export type ModulePathResolverOptions = {
  /** The template for creating the component's import path */
  modulePathTemplate?: (
    /** The current value in the `path` property (typically to the source code) */
    modulePath: string,
    /** The name of the component */
    name: string,
    /** The tag name of the component */
    tagName?: string
  ) => string;
  /** The template for creating the component's import path */
  definitionPathTemplate?: (
    /** The current value in the `path` property (typically to the source code) */
    modulePath: string,
    /** The name of the component */
    name: string,
    /** The tag name of the component */
    tagName?: string
  ) => string;
  /** The template for creating the component's import path */
  typeDefinitionPathTemplate?: (
    /** The current value in the `path` property (typically to the source code) */
    modulePath: string,
    /** The name of the component */
    name: string,
    /** The tag name of the component */
    tagName?: string
  ) => string;
  /** Path to output directory */
  outdir?: string;
  /** The of the loader file */
  fileName?: string;
  /** Class names of any components you would like to exclude from the custom data */
  exclude?: string[];
  /** Enables logging during the component loading process */
  debug?: boolean;
  /** Prevents plugin from executing */
  skip?: boolean;
  /** @internal Used to indicate if this is used as a CEM a plugin */
  usedByPlugin?: boolean;
};
