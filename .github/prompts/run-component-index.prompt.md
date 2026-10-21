---
file: prompts/run-component-index.prompt.md
name: Run Component Index
description: "Refresh the component overview table in doc/index.md from the currently implemented SFC components."
argument-hint: "Optional constraints for this index refresh"
agent: "Component Index"
---
Refresh the SFC component overview table in [doc/index.md](../../doc/index.md) using the
current root-level `.sfc` components.

Follow the Component Index agent's workflow. Preserve all content outside the table,
match the existing Markdown table formatting, and report any component documentation
files that are missing. Do not create or edit component documentation files.

Additional request or constraint: ${input:constraints:None}
