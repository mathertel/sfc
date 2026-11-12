# Create a new sfc component

This file acts as a example and template for new sfc components. When instructions are missing from
the prompt please ask. Here are alternatives marked with || characters.

## Short description

It is a (inline-block || block) element to ... .

## Example code how to use it

``` html
<u-icon use="config"></u-icon>
<u-icon use="ed-bold" />
```

## Assumptions

Assume by default that there is a `/icons.svg` sprite file as it is in the current project.

The u-icon should replace the repeated coding like

```html
<svg class="setconfig">
  <use href="/icons.svg#config" />
</svg>
```

* ShadowDom (is || is not) used.
* /icons.svg is the default name for the sprite file.
* when given use a css variable to refer the sprite file `--iconsfile=/other.svg`
* or use the attribute `src="/other.svg"`

Create a test page and playwright tests for `<u-icon>` and link it in /test/index.htm.

Use `/ed-icons.svg` to test the `src` attribute.

Create a documentation file in /docs.

Run the test pages using the npx http-server through `npm run serve` command.
