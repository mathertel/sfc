# Web component to edit text formatted by using the markdown language

The `u-md-editor` is a custom element that implements a plain text editor with some
markdown syntax support for the text.  It provides a simple toolbar for common
formatting commands and will convert pasted HTML into Markdown automatically.

* buttons with commands
* combinable with key shortcuts
* works well together with `u-markdown` to render the entered markdown

## Setup

You can load the loader script and register the component as shown below:

```html
<!-- load the SFC loader once per page -->
<script type="module" src="/loader.js"></script>
<!-- import the editor component (relative path to your server) -->
<script type="module">
  import '/u-md-editor.sfc';
</script>
```

Alternatively you can call `window.sfc.loadComponent()`:

```html
<script src="/loader.js"></script>
<script>
  window.sfc.loadComponent('/u-md-editor.sfc');
</script>
```

Instantiate the editor with optional attributes:

```html
<u-md-editor></u-md-editor>

<!-- preload a document or set initial value -->
<u-md-editor value="**bold** text" src="/docs/intro.md"></u-md-editor>
```

## HTML to Markdown conversion when pasting

Pasting formatted text to the editor in `text/html` format is processed
by a simple HTML Markdown converter.  Pasting as plain text will not
attempt a conversion.

This conversion uses `DOMParser()` to parse the text as `text/html`
without rendering it, so no scripts are executed and XSS risks are reduced.
The DOM tree is then traversed and transformed into Markdown text.

See also <https://gomakethings.com/how-to-sanitize-html-strings-with-vanilla-js-to-reduce-your-risk-of-xss-attacks/>


## Linking Markdown editor to Markdown rendering

The `u-md-editor` dispatches the standard `input` event as this event bubbles from the
internal textarea up through the DOM.  You can listen for that event to sync the raw
markdown text with another element such as `<u-markdown>`.

control-s : save the current text
Shift+F3 : Uppercase/Lowercase formatting

## Instance Properties

The following attributes are observed by the component (listed in `observedAttributes`):

* `textcontent` – Gets/sets the current editor contents. Setting this attribute updates the
  textarea value. When changed the component also emits a bubbling `input` event.
* `value` – alias for `textcontent` and reflects the textarea `value` property.
* `src` – URL of a Markdown file to load into the editor.  When specified the file is
  fetched and its contents placed into the textarea.

All three can be accessed via standard DOM methods (`getAttribute`, `setAttribute`) or
via the corresponding properties off the element.

## Instance Methods

* `exec(commandName)` – Execute a named formatting command. Supported values are
  `'bold'`, `'italic'`, `'strike'`, `'code'`, `'case'`, `'list'`, and `'quote'`.
  Commands can also be invoked by clicking toolbar buttons or using the listed
  keyboard shortcuts.

Other helper methods (`_toggleTextFormat`, `_toggleLineFormat`, etc.) are internal
and not part of the public API.

```
