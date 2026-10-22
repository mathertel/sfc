# DataHub Countdown

`<u-countdown>` is a headless component that reduces a duration stored in the DataHub.
It expects the value at `dh-path` to use the `HH:MM:SS` format and updates that value
once per second while running. The countdown stops automatically at `00:00:00`.

## Setup

Load the DataHub and countdown components:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent(["u-datahub", "u-countdown"]);
</script>
```

Add a DataHub and point the countdown at a value in its store:

``` html
<u-datahub></u-datahub>
<u-countdown id="counter" dh-path="timer"></u-countdown>

<script type="module">
  await window.loadComponent(["u-datahub", "u-countdown"]);
  window.datahub.publish("timer", "00:03:00");
  document.querySelector("#counter").start();
</script>
```

The component does not render UI. Read or subscribe to the DataHub path to display the
current value.

## Instance Properties

* `dh-path` -- DataHub path containing the countdown duration in `HH:MM:SS` format.

* `autostart` -- Boolean attribute that starts the countdown during component
  initialization, using the current value at `dh-path`.

## Instance Methods

* `start(initialValue?)` -- Starts reducing the DataHub duration once per second. When
  provided, `initialValue` may be seconds, `MM:SS`, or `HH:MM:SS`; it is normalized to
  `HH:MM:SS`, published to `dh-path`, and replaces any running countdown. Calling it
  without a value while already running has no effect.

* `stop()` -- Stops the countdown. It also stops when the element is removed or the
  value is invalid.

* `startFor(timestamp)` -- Calculates the duration until `timestamp` once, then passes
  it to `start(initialValue)`. Accepts a value supported by `Date`; timezone-less
  date-time strings use the browser's local timezone.

## Instance Events

* `done` -- Bubbles when the countdown reaches `00:00:00`.
