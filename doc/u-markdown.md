# Web component to render markdown files

The `<u-markdown>` component displays Markdown-formatted text by compiling it to
HTML using the **markdown-it** library.  Content may be supplied either via a
remote markdown file or directly as text.

## Setup

Load the SFC loader and either import the components by calling the `window.sfc.loadComponent()`:

```html
<script src="/loader.js"></script>
<script>
  window.sfc.loadComponent('/u-markdown.sfc');
</script>
```

Usage examples:

```html
<!-- load a remote markdown document -->
<u-markdown src="/docs/intro.md"></u-markdown>

<!-- supply markdown text directly -->
<u-markdown>
## Hello world
This is **bold** text.
</u-markdown>
```

## Attributes & Properties

The component observes the following attributes (see `observedAttributes`):

* `src` – URL to fetch a markdown file. When the file is loaded its contents are
  rendered automatically.
* `textcontent` – raw markdown text. Setting this attribute or the `value`
  property bypasses loading from a URL and renders the supplied text instead.
* `value` – alias for `textcontent`.

You can get/set these with `getAttribute`/`setAttribute` or via the corresponding
properties on the element instance.

No other HTML attributes are required; style your markdown output using CSS rules
targeting `u-markdown` or its child elements.

## Instance Methods

* `process()` – manually trigger rendering. Normally this is called automatically
  when the element is first initialized or when an observed attribute changes.
  Can be useful if you mutate `srcText` programmatically.

Other methods (`fetchMarkdown`, `renderMarkdown`, `init`, etc.) are considered
internal implementation details.

## Additional Notes

The component loads `markdown-it.js` and `markdown-it-attrs.js` via
`importScript`.  Ensure those files are available on the server (they are
included in the repository).  The library version is the one shipped with the
project.

Open Topics:

* The loader currently hardcodes the `/sfc/` folder name when importing scripts;
  this could be made configurable in a future update.

## See also

* https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
* https://zerodevx.github.io/zero-md/
* requestIdleCallback, SetTimeout VS RequestAnimationFrame

