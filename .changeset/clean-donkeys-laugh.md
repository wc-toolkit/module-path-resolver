---
"@wc-toolkit/module-path-resolver": patch
---

Apply module path transform to all modules, not just those with custom element declarations. Previously, modules without custom element declarations (e.g., barrel/index files, utility modules) were skipped entirely, leaving their paths untransformed. Also updates nested `module` references in declarations and exports for all modules, not just CE modules.
