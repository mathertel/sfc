# Web component to

Implementation of a web component to toggle a classname on an element and/or emit on/off events.

```html
<u-toggle toggletarget='' toggleclass='' value='1'>
```

The inner element that is shown as the toggle button is a CSS only implementation
using a `<input type=range>` element with values 0 and 1.

The attributes `toggletarget` and `toggleclass` can be specified to add or remove a classname on a element of the document. This is optional.

Also a `change` event is dispatched on any interactive or programatic change of the value.

see test-toggle.htm file.


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-toggle');
</script>
```


## Style Attributes

The `u-toggle` component can be placed at the destination and the size. Styles can be applied in the global styling
on the `u-toggle` and `u-toggle>input.switch` element.


## Registering for the change event

```js
  document.querySelector('u-toggle').addEventListener('change', (evt) => {
    console.log('changed:', evt);
  });
```


## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the `<u-toggle>` element:

* **`value`** -- the initial value of the component.

* **`toggletarget`** -- This attribute is the css selector to identify a target element.

* **`toggleclass`** -- This attribute defines the classname to be toggled on the target element.


<!-- ## See also -->

