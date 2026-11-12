# Icon

`<u-icon>` displays a symbol from an external SVG icon collection as an inline-block
element. It uses light DOM and renders the symbol with `<svg><use></use></svg>`.

The icon collection defaults to `/icons.svg`. Set the `--iconsfile` CSS custom property to
use a different collection, or set the `src` attribute. The `src` attribute takes
precedence over the CSS custom property.

## Setup

Load the SFC loader and register the component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-icon');
</script>
```

Choose a symbol with the `use` attribute. Set the collection with `src` or
`--iconsfile` when needed:

```html
<u-icon use="config"></u-icon>
<u-icon use="ed-bold" src="/ed-icons.svg"></u-icon>
<u-icon use="ed-italic" style="--iconsfile: /ed-icons.svg"></u-icon>
```

## Instance Properties

* **`use`** -- the symbol ID in the icon collection.
* **`src`** -- optional icon collection URL. Defaults to the computed `--iconsfile` CSS custom property or `/icons.svg`.
* **`--iconsfile`** -- optional CSS custom property for the icon collection URL, set on the element or an ancestor.

## Instance Methods

None.