# @wc-toolkit/module-path-resolver

## 1.0.1

### Patch Changes

- 954e263: Apply module path transform to all modules, not just those with custom element declarations. Previously, modules without custom element declarations (e.g., barrel/index files, utility modules) were skipped entirely, leaving their paths untransformed. Also updates nested `module` references in declarations and exports for all modules, not just CE modules.

## 1.0.0

### Major Changes

- 5c50705: Initial commit
