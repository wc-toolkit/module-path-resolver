<div align="center">
  
![workbench with tools, html, css, javascript, and download icon](https://raw.githubusercontent.com/wc-toolkit/module-path-resolver/refs/heads/main/assets/wc-toolkit_module-path-resolver.png)

</div>

# WC Toolkit CEM Module Path Resolve

This tool is designed to update module paths in your Custom Elements Manifest to the output target.

The goal is to make the paths in the CEM as accurate as possible so tools can accurately reference these.

## Installation

To install the package, use the following command:

```bash
npm install -D @wc-toolkit/module-path-resolver
```

## Usage

This package includes two ways to update the Custom Elements Manifest:

1. using it in a script
2. as a plugin for the [Custom Element Manifest Analyzer](https://custom-elements-manifest.open-wc.org/).

### Script

```ts
// my-script.ts

import { resolveModulePaths, type ModulePathResolverOptions } from "@wc-toolkit/module-path-resolver";
import manifest from "./path/to/custom-elements.json" with { type: 'json' };

const options: ModulePathResolverOptions = {...};

resolveModulePaths(manifest, options);
```

### CEM Analyzer

The plugin can be added to the [Custom Elements Manifest Analyzer configuration file](https://custom-elements-manifest.open-wc.org/analyzer/config/#config-file).

```js
// custom-elements-manifest.config.js

import { modulePathResolverPlugin } from "@wc-toolkit/module-path-resolver";

const options = {...};

export default {
  plugins: [
    modulePathResolverPlugin(options)
  ],
};
```

## Configuration

```ts
type ModulePathResolverOptions = {
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
};
```

## Module Path

This is the path to the component's final output location.

> **NOTE:** If you are not transpiling or building your components and your source file is in the same place as the final output, you probably don't need to add this.

```ts
{
  // ex: module moved from `./src/components/alert/alert.ts` => `./dist/components/alert/alert.js`
  modulePathTemplate(modulePath, name, tagName) => modulePath.replace('src', 'dist').replace('.ts', '.js');

  // ex: module moved from `packages/my-button/src/component/my-button.ts` => `dist/components/my-button.js`
  modulePathTemplate(modulePath, name, tagName) => `./dist/components/${tagName}.js`;

  // ex: similar components are now grouped into the same module
  modulePathTemplate(modulePath, name, tagName) => {
    switch (tagName) {
      case 'my-tab':
      case 'my-tabs':
      case 'my-tabpanel':
        return `./dist/components/tabs/${className}.js`;
      case 'my-select':
      case 'my-option':
        return `./dist/components/select/${className}.js`;
      default:
        return `./dist/components/${tagName}/${className}.js`;
    }
  }
}
```

## Definition Path

This is the path to where the component is defined either through the traditional method (`customElements.define('my-component', MyComponent)`), a decorator, or some other custom approach.

> **NOTE:** Your analyzer may already be doing this for you. You can confirm this by searching your manifest for any `exports` with `"kind": "custom-element-definition"`.

```ts
{
  definitionPathTemplate(modulePath, name, tagName) => `./dist/${tagName}/index.js`
}
```

## Type Definition Path

This sets a _non-standard_ property next to the module path so tools can easily reference them.

> **NOTE:** This is only needed of the types are not co-located with the module or if it follows a different naming convention from the component module.

```ts
{
  typeDefinitionPathTemplate(modulePath, name, tagName) => `./types/components/${tagName}.d.ts`
}
```

<div style="text-align: center; margin-top: 32px;">
  <a href="https://stackblitz.com/edit/stackblitz-starters-57ju3afb?file=README.md" target="_blank">
    <img
      alt="Open in StackBlitz"
      src="https://developer.stackblitz.com/img/open_in_stackblitz.svg"
    />
  </a>
</div>

Check out the [documentation](https://wc-toolkit.com/documentation/module-path-resolver) to see how to configure this to meet your project's needs.
