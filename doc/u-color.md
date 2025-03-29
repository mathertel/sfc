# Web component to display the color value from a CSS variable

The <u-color> custom element shows a color value that is defined by a CSS variable.  It also provides a color picker
implementation that can be used to select colors and re-assign the color to the css variable.

This element is useful at design time to show and change the colors that have been defined in a global CSS when building
new UI components.

<!-- ![u-color component](u-color.png) -->


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-color');
</script>
```

The `u-color` tag can be placed at the destination and the size can be applied in the style attribute:

t.b.d.

<u-color cssvar="ucolor"></u-color>


## Style Attributes

The standard `<u-color>` component can be styled according the standard CSS styling attributes.


## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended `<u-color>` element:


## See also

