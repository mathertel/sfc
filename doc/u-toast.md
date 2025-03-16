# Web Component to display toast messages

The component displays messages of type 'log', 'info', 'error' using fly-in toast message box that automatically can
disappear after some time.

The loader script must be included in the page.

```html
<script src="/loader.js"></script>
```

The `u-toast` tag can be loaded using:

```javascript
var allSFCLoaded = window.loadComponent('u-toast');
```

The `u-toast` tag should be placed at the beginning of the html body.

```html
<u-toast></u-toast>
```

This element is typically added to the html body element and will position itself on the top right corner above any
html.

## Style Attributes

The following css variables are available to change the colors of the toast message box per type:

* --log-color —- color for log messages
* --info-color —- color for info messages
* --error-color —- color for error messages

Example:

```html
<u-toast style="--log-color:pink"></u-toast>
```

## JavaScript accessible methods

The tag supports the following methods:

* `log(msg, options = {})` -- Display a log message.
* `info(msg, options = {})` -- Display an info message.
* `error(msg, options = {})` -- Display an error message.


## Options

The options are used to further configure how a toast message is displayed:

* `close` -- A boolean specifying if a toast message includes an explicit close button.
* `duration` -- A numeric value to specify the time until the message closes automatically. Specify duration=0 for no automatic closing.

Have a look at the source of this page to see how the example buttons use the api of this wen component.
