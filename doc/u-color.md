# Web component to display the color value from a CSS variable

The `<u-color>` custom element shows a color value that is defined by a CSS variable.  It also provides a color picker
implementation that can be used to select colors and re-assign the color to the css variable.

This element is useful at design time to show and change the colors that have been defined in a global CSS when building
new UI components.

![A u-color web component in a webpage, displaying a color value defined by a CSS variable.](/doc/images/u-color.png)


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-color');
</script>
```

Add the component where the color control should appear. Use `cssvar` to connect it to a root CSS variable, or `value` to provide a color directly:

```html
<u-color cssvar="accent"></u-color>
<u-color value="#336699"></u-color>
```

The `cssvar` value is the variable name without the leading `--`. When `cssvar` is present, the component reads that variable from `:root` during initialization and uses it as the initial color, replacing any initial `value` attribute. Later color changes update the CSS variable.

## Style Attributes

The `<u-color>` host can be styled with CSS, including its size and position. By default it is an inline-block sized to `11ch` by `1lh`.

## Instance Properties

* **`value`** -- the color value. It is observed and can be set in markup or through the JavaScript property. Changing it updates the displayed color and, when `cssvar` is set, the corresponding root CSS variable. Removing it displays `(none)`.
* **`cssvar`** -- the name of a CSS custom property on `:root`, without the `--` prefix. It is read during initialization; changing this attribute after initialization does not reconnect the control to another variable.

## Events

The component dispatches a `change` event when a non-empty `value` is set. The event does not bubble, so listen directly on the component:

```js
const color = document.querySelector('u-color');
color.addEventListener('change', () => {
  console.log('Selected color:', color.value);
});

color.value = '#0000ff';
```

## Instance Methods

* **`_hexColor(colorval)`** -- converts a CSS color string to a hexadecimal color value. This is an internal helper and is not intended as a stable page-facing API.

## See also

