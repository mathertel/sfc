# Web component to edit text formatted by using the markdown language

The `u-md-editor` is a custom element that implements a plain text editor with some
markdown syntax support for the text.  It provides a simple toolbar for common
formatting commands and will convert pasted HTML into Markdown automatically.

* buttons with commands
* combinable with key shortcuts
* works well together with `u-markdown` to render the entered markdown

## Setup

Load the SFC loader and either import the components by calling the `window.sfc.loadComponent()`:

```html
<script src="/loader.js"></script>
<script>
  window.sfc.loadComponent('/u-md-editor.sfc');
</script>
```

### Instantiate the editor

The simples version of using the component:

```html
<u-md-editor></u-md-editor>
```

To preload a document use the src attribute:

```html
<u-md-editor src="/docs/intro.md"></u-md-editor>
```

To load a default text use inline text:

```html
<u-md-editor>
This is **bold** text
</u-md-editor>
```

### Customized menu bar

As an optiona you can add a HTML element inside the `u-md-edit` component to provide a
custom menubar marked with class="u-md-editor-menu".

To link a button in the menubar to a command you can specify the command name in the
`data-command` attribute. The click is recognized by the u-md-edit component and the command is triggered automatically.

``` html
<u-md-editor>
  <nav class="u-md-editor-menu">
    Your buttons:
    <button data-command="case">Case</button>
  </nav>
</u-md-editor>
```

### Keyboard shortcuts

To enable keyboard bindings on buttons in the menu bar use the `aria-keyshortcuts`
attribute and extend the page by capturing keyboard shortcuts with the
[u-keyshortcuts](u-keyshortcuts.md) element.


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

## Character Formatting Commands

* **bold** : The selection is expanded to the current word boundaries and then will be
  formatted as bold using the `**` characters. When the selection is already surrounded
  by bold formatting the formatting is removed.
* **italic** : The selection is expanded to the current word and then will be formatted
  as italic using the `*` character. When the selection is already surrounded by italic
  formatting the formatting is removed.
* **strike**: The selection is expanded to the current word and then will be formatted
  as strikethrough using the `~~` characters. When the selection is already surrounded
  by strike formatting the formatting is removed.
* **code**: When the selection spans only characters butg not multiple lines the
  character selection is expanded to the word boundaries and will be formatted as code
  using the \` character.
* **case**: The selection is expanded to the current word boundaries and then each word
  will be changed to lowercase, uppercase or Camel case.

## Line Formatting Commands

* **list** : The selection is expanded to the current lines and the list format is
  applied using the `*` character.
* **quote** : The selection is expanded to the current lines and the quote format is
  applied using the `>` character.

## Block Formatting Commands

* **code**: When the selection spans multiple lines it is expanded to the current block
  of lines and the block level code formatting is added using the ``` characters.  

* **reflow** : The selection is expanded to the current line and surrounding lines with
  the same formatting or continuing lines. The the contained text is broken into lines
  with maximum 88 characters length.

