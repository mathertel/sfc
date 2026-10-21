# Charbox

`<u-charbox>` displays a single character and can animate changes to its `value`.

## Setup

Load the SFC loader and register the component:

```html
<script src="/loader.js"></script>
<script>
  const charboxLoaded = window.loadComponent('u-charbox');
</script>
```

After the component is loaded, add it to the page. The optional classes select an animation direction:

```html
<u-charbox class="push-top" value="1"></u-charbox>
<u-charbox class="slide-bottom" value="2"></u-charbox>
```

Changing `value` updates the displayed character. The available animation classes are:

* `push-top` and `push-bottom` -- move the previous character out in the opposite direction.
* `slide-top` and `slide-bottom` -- bring the new character in from that direction while the previous character stays in place.

Without one of these classes, no directional transition is configured.

## Instance Properties

* **`value`** -- the character to display. It can be set in markup or changed later as an HTML attribute.

Animation modes are selected using CSS classes, not additional component attributes.

## Instance Methods

The component has no methods intended to be called by page code. The framework invokes these lifecycle callbacks:

* **`init()`** -- initializes the displayed value when the component connects.
* **`attributeChangedCallback(name, oldValue, newValue)`** -- responds to changes to the observed `value` attribute.
