# Radio Group

`<u-radiogroup>` is a form-associated block element that turns its direct child elements
into a group of radio elements where exactly one element can be checked.

The child elements can be any inline or inline-block element like `<span>`, `<button>`,
`<input type="radio">` or `<u-icon>`. Native radio inputs can be labeled by wrapping the
input in a `<label>`, associating a label with `for`, or placing a label immediately before
the input. No shadow DOM is used and the inner HTML remains as is. The component adds:

* `role="radiogroup"` on the `<u-radiogroup>` element.
* `role="radio"`, the `name` of the group and `aria-checked` on each radio element. For
  labeled inputs, these are applied to the input.
* the `checked` attribute on the checked radio element only.

Clicks, taps and keyboard input (arrow keys, Space) select a radio element. The `value`
attribute of the group is set to the `value` attribute of the selected element and
`input` and `change` events are dispatched. Inside a `<form>` the value is added to the
form data using the `name` of the group.

## Setup

Load the SFC loader and register the component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-radiogroup');
</script>
```

Use it with a mandatory `name` attribute and an optional initial `value`:

```html
<form>
  <u-radiogroup name="speedmode" value="2">
    <span value="1">Option-1</span>
    <span value="2">Option-2</span>
    <span value="3">Option-3</span>
  </u-radiogroup>
</form>
```

Native radio inputs can use labels in any of these forms:

```html
<form>
  <u-radiogroup name="size" value="m">
    <label>Small: <input type="radio" value="s"></label>
    <label for="size-medium">Medium:</label>
    <input id="size-medium" type="radio" value="m">
    <label>Large:</label>
    <input type="radio" value="l">
  </u-radiogroup>
</form>
```

A child element with a `checked` attribute is used as the initial value when no `value`
is given on the group. Resetting the form restores the initial value.

The checked element can be styled using the attribute selector:

```css
u-radiogroup > [checked] { background-color: #203050; color: white; }
```

## Instance Properties

* **`name`** -- mandatory name of the group. It is set on all radio elements and used as the key in the form data.
* **`value`** -- the value of the checked radio element. Setting this attribute checks the radio element with the same `value`.

## Instance Methods

* **`formResetCallback()`** -- called when the containing form is reset; restores the initial value.
