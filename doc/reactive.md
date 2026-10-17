# Reactive Data and Programming using SFC components

**Browser UI elements expose events that application code can use to handle user input and update
the interface. Ordinary JavaScript data objects, however, do not emit events when their values
change. A reactive data layer bridges this mismatch by notifying subscribers of data changes, so
UI elements can stay synchronized with the application model.**

The browser-side [JSDataHub](data-hub.md) provides this kind of shared data model that
is brought into the page using the <u-datahub> element. It stores structured multi-level
JavaScript data internally.

By using paths like `counter.value` the data can selectively be changed and when
subscribing using such a path elements will be informed about the data change using an
event.

Components can therefore stay loosely coupled: one component publishes a change, and any
component subscribed to the affected path can respond.

The subscription callback function receives the event with the changed path and value. In addition:

* `replay()` sends the current stored value to a subscriber that registered after the
  initial publish.
* `subscribe()` returns a subscription ID; a custom element can retain it and call
  `hub.unsubscribe(id)` when it disconnects.
  
## Build for small download size

In contrast RxJS (Reactive Extensions for JavaScript) is a well known, often used and
powerful library implementing Observables, Subjects, and operators that requires about
(unpacked) 700 kByte.

In contrast, the publish+subscribe approach implemented in the <u-datahub> component
needs about (unpacked) 9 kByte only and fits especially into implementations where
[Size (still) Matters on the Web](https://www.mathertel.de/blog/2025/1001-size-matters.htm).

When the element is connected to the page, it makes itself available as `window.datahub`.
This lets other scripts access the data hub without querying the element each time.


## Example

A button can update a data model value while an output element renders it. Both elements
do not directly link to each other:

```html
<script src="/loader.js"></script>
<u-datahub></u-datahub>

<output id="count">0</output>
<button id="increment">Increment</button>

<script type="module">
  await window.loadComponent("u-datahub");

  const hub = window.datahub;
  const output = document.querySelector("#count");

  hub.publish("counter", { value: 0 });
  const subscription = hub.subscribe("counter.value", (_path, value) => {
    output.value = value;
  });
  hub.replay("counter.value");

  document.querySelector("#increment").addEventListener("click", () => {
    hub.publish("counter.value", hub.get("counter.value") + 1);
  });

  // A component can call this when it is removed.
  // hub.unsubscribe(subscription);
</script>
```


## See also

* [Why web application size matters](https://dev.to/relative-ci/why-web-application-size-matters-51bc)
