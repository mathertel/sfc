# Implementing Aria conformant Keyshortcut

Providing Keyshortcut in web application can significantly increase the usability for any user as things can be performed
efficiently in Rich Internet Applications. What needs to be done is

* Telling the user about available keyboard shortcuts
* Implementation of keyboard shortcuts.
* By using the 'aria-keyshortcuts' attribute on HTML elements Accessibility can be supported
* The HTMLElement.accessKey is limited in using browser specific key modifications only like `ALT+<key>` in Chrome on Windows
  and not conforming to WCAG.

The [aria-keyshortcuts] specification comes with some useful information about how to visually presemt a defined shortcut.
The [WCAG-keyboard operations] in the [WCAG 3.0] specification also includes some useful hints.

However there is no standard support in current browsers (State 2025) and it is given as a implementation effort to the
application to display and implement them.

The custom element `<u-keyshortcuts>` is there to help by adding this functionality without any further implementation effort.
It can be used for visualizing a `aria-keyshortcuts` property on all kind of elements (including `<input>`).


## Setup

The loader script and the custom element definition must be included in the page, typically in the `<head>` section:

``` javascript
<script src="/loader.js"></script>
<script>
window.loadComponent('u-keyshortcuts');
</script>
```

The `<u-keyshortcuts>` tag shouldcan be placed at the end of the html body. It doesn't display anything itself but adds the
u-keytip elements to the whole page just after the element that has defined an `aria-keyshortcuts` property.

``` html
<u-keyshortcuts [options]></u-keyshortcuts>
```


## Defining aria-keyshortcuts properties

The `aria-keyshortcuts` property can be defined on any HTML element. Using it on `<input>` and `<button>` elements are the most intersting use-cases.

* The `<input aria-keyshortcuts="Control+U" />` will enabling directly moving the focus to the input field.
* The `<button aria-keyshortcuts="Control+S" />` will trigger a `click` event on this button.

The tips for the aria-keyshortcuts are also displayed on disabled elements but do not work as intented.

Typical values for aria-keyshortcuts are:

* "A" (not recomended to use keys without a modifier like Control or Alt)
* "Control+S"
* "Control+Shift+S"
* "Shift+Space"
* "Control+Alt+,"

Key combinatations like Control+K with following "G" is not supported as of now.

## Style Attributes

The way keyshortcuts are displayed using .u-keytip elements can be changed. In the `sfc` file for this component you can find the
CSS definition for the keytip elements. You can overwrite the css rules in your page or stylesheet.

``` css
span.u-keytip {
  background-color: lime; /* not yellow */
}
```


## Implementation

Key tips are generated when the page got loaded and stay invisible on the page by default.

The visibility of the keyshortcut tips is controlled by the classname "u-show-keytip" on the body element that is reflected in
the CSS rule `body.u-show-keytip .u-keytip`

To display all key tips the control key must be pressed down. When the control key is released the tips will be hidden again.

When handling a defined keyshortcut the type of the element is used to trigger a `click` event using the click() function on
buttons.


## Some hints for typical problems

The keyshortcuts are checked on the keydown event that is propagated to the body element of the page. The keyshortcuts don't
work when the keydown event is somehow stopped from propagating to the body element. Please check for any implementation also
handling the `keydown` event.

Be aware that the x/y position of the pointer is not correct when using keys to trigger clicks. This is also true when the <tab>
key is used to focus a button and the <enter> key is used to trigger the click;

Some shortcuts cannot be used and overwritten like <control+n> in Edge to open a new, blank page. Some can be used by stopping
the default behavior like <control+p>, <control+s>, <control+f>

Avoid the common used shortcuts for you implementation if possible. See e.g.
<https://www.geeksforgeeks.org/techtips/keyboard-shortcuts-for-all-web-browser/>


## See also

* <https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#keyboardshortcuts>
* <https://w3c.github.io/aria/#aria-keyshortcuts>
* [WCAG 3.0]
* [WCAG-keyboard operations]
* [aria-keyshortcuts]


[WCAG 3.0]: https://www.w3.org/TR/wcag-3.0/
[WCAG-keyboard operations]: https://www.w3.org/TR/wcag-3.0/#keyboard-operation
[aria-keyshortcuts]: https://w3c.github.io/aria/#aria-keyshortcuts
