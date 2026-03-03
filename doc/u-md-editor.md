# Web component to edit text formatted by using the markdown language

The `u-md-editor` is a custom element that implements a plain text editor with some
markdown syntax support to the text.

* buttons with commands
* combinable with key shortcuts
* combinable with u-markdown to format the actual markdown


## HTML to Markdown conversion when pasting

Pasting formatted text to the editor in text/html format is processed
by a simple HTML to Markdown converter while pasting as plain text will not
try to convert anything.

This conversion is implemented by using the `DOMParser()` to parse the text as `text/html`
without rendering it so no script will be executed to avoid xss attacks.
The DOM tree then is traversed by creating plain Markdown text.

See also <https://gomakethings.com/how-to-sanitize-html-strings-with-vanilla-js-to-reduce-your-risk-of-xss-attacks/>


## Linking Markdown editor to Markdown rendering

The u-md-editor dispatches the standard `input` event as this event bubbles from the
internal textarea up the DOM elements. This event can be used to sync the raw markdown
text to another element like the `u-markdown`.

control-s : save the current text 
F3 : Uppercase Lowercase formatting

