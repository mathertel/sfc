# Switch

`<u-switch>` is a form-associated control for entering a binary value with a switch
interface. Its value is the string `"0"` or `"1"`.

## Setup

Load the SFC loader and register the component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-switch');
</script>
```

Use it in a form with a `name` so its value is included in form data:

```html
<form>
  <u-switch name="notifications" value="1"></u-switch>
</form>
```

The control provides **off** and **on** buttons and a range input. It can be operated with the keyboard; pressing Space toggles its value. User interaction dispatches a bubbling, composed `input` event. Resetting the form sets the value to `"0"`.

## Instance Properties

* **`value`** -- the observed HTML attribute that sets the control value. Use `"0"` for off and `"1"` for on. The default is `"0"`.
* **`name`** -- the standard form-control attribute used as the key when the value is submitted with the form.

## Instance Methods

* **`draw(newValue)`** -- updates the displayed state and the value contributed to the form. Pass `"0"` or `"1"`; call without an argument to synchronize the current state with the form.
* **`getAttribute(name)`** -- reads an attribute. For `"value"`, it returns the current switch value.
