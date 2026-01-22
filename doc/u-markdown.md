# Web component to render markdown files

The `<u-markdown>` component can be used to display Markdown formatted documents in the browser by compiling Markdown to
HTML using the markdown-it library.

Markdown can be injected by 2 methods:

* Loading a *.md file from the same web server. After the file is loaded it gets compiled into HTML and displayed.
* Passing markdown text directly to the component by setting the `textContent` property.

&lt;u-markdown style="... " src="..."&gt;# markdown&gt;/u-markdown&lt;

This component loads the Markdown library scripts by the importScript function defined in the uComponent class.


## Attributes

none. typically the style needs to be specified by using css rules.

## JavaScript accessible attributes

* **`src`** -- The URL of the markdown file to be loaded and displayed.
* **`textContent`** -- The markdown text to be compiled and displayed.

The markdown-it library is required to be loaded. It can be found in https://markdown-it.github.io/.
The `markdown-it.js` and `markdown-it-attrs.js` files must be present in the 

Open Topics:

The foldername /sfc/ is hardcoded. It should be replaced by a variable / placeholder.

References:

* https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements
* https://zerodevx.github.io/zero-md/
* requestIdleCallback, SetTimeout VS RequestAnimationFrame

## See also

