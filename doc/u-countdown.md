# Countdown

`<u-countdown>` is currently a placeholder component. Although its name and the demo page suggest a countdown timer, the registered component does not yet calculate or display a countdown.

## Setup

Load the SFC loader and register the component:

```html
<script src="/loader.js"></script>
<script>
  const countdownLoaded = window.loadComponent('u-countdown');
</script>
```

After registration, the element can be included in the page:

```html
<u-countdown value="60"></u-countdown>
```

The current template displays the static text `hoo`; changing `value` does not update it.

## Instance Properties

* **`value`** -- the only observed attribute. The current component does not use changes to this attribute to run or display a countdown.

## Instance Methods

There are no public instance methods for page code to call. The component does not currently expose countdown controls or dispatch countdown events.
