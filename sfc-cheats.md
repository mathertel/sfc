# SFC Syntax Cheat-Sheet

Quick reference for writing .sfc files used by this project.

## Minimal file shape

```html
<template open>
  <!-- component DOM -->
</template>

<style scoped>
  /* component CSS */
</style>

<script>
  export default class UExample extends HTMLElement {
    static observedAttributes = ["value"];

    connectedCallback() {
      // optional lifecycle setup
    }

    attributeChangedCallback(name, oldValue, newValue) {
      // keep state in sync with attributes
    }

    init() {
      // optional: called by UComponent after template/style/event wiring
    }

    onclick(evt) {
      // event method names must be lower-case after "on"
    }
  }
</script>
```

## Block rules

### script

- Must export the component class as default.
- Optional attribute: extends="tag" to extend native elements.
- Event methods are auto-bound when method names start with on.
- Use lower-case event method names like onclick, oninput, onchange.

### template

- Optional block.
- Supported modes:
  - open: shadow DOM, accessible via element.shadowRoot
  - closed: shadow DOM, not accessible from page-level JS
  - light: no shadow DOM, template content injected into element

### style

- Optional block.
- With scoped: style is cloned into the component root (shadow or light root).
- Without scoped: style is cloned into document head during construction.

## Attributes and state

- Declare observed attributes in static observedAttributes.
- The loader adds property proxies for observed attributes.
- Prefer syncing internal state in attributeChangedCallback.

## Extending native elements

Use extends on script and instantiate with is="...".

```html
<!-- my-button.sfc -->
<script extends="button">
  export default class UButton extends HTMLButtonElement {
    onclick() {
      this.classList.toggle("active");
    }
  }
</script>
```

```html
<button is="my-button">Toggle</button>
```

## Load components in browser

```html
<script src="/loader.js"></script>
<script>
  window.sfc.loadComponent(["u-card", "u-toast"], "/");
</script>
```

## Common pitfalls

- Do not forget export default in script.
- Avoid camelCase event handlers like onClick; use onclick.
- Relative asset URLs inside template are not rewritten automatically.
- For script dependencies from component code, use importScript() so URLs resolve against this.constructor.url.
