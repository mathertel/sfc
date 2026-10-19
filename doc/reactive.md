# Reactive Data and Programming using SFC components

**Browser UI elements expose events that application code can use to handle user input and update
the interface. Ordinary JavaScript data objects, however, do not emit events when their values
change. A reactive data layer bridges this mismatch by notifying subscribers of data changes, so
UI elements can stay synchronized with the application model.**

Within the software stack the [DataHub Element](u-datahub.md) implements the layer for a
centralized multi-level data management that can keep the web application wide data and
state and provides the mechanisms for binding parts and components of the application.

> The concept of **reactive programming** is centered around data flows within
> your application and the propagation of changes. When data changes, the parts
> of the application that depend on this property will be automatically updated.
> This is the core idea used in many frontend libraries like React, Angular,
> Vue.js, MobX...

This statement on defining **reactive programming** is true for the
[DataHub Element](u-datahub.md).

Using paths like `counter.value` the data can selectively be changed with
`datahub.publish("counter.value", 55)` and when subscribing using
`datahub.subscribe("counter.value", fCallback)` the callback function will be informed
about every data change.

Components can therefore stay loosely coupled: one component publishes a change, and any
component subscribed to the affected path can respond. The components need not even know
each other.

  
## Build for small download size

In contrast the RxJS (Reactive Extensions for JavaScript) library is a well known, often
used and powerful library implementing Observables, Subjects, and operators that
requires about (unpacked) 700 kByte. It is used in some of the  

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

## Future of Observerables

There is a [Observable API proposal](https://github.com/WICG/observable) to create a
more feature rich event handling in the browser that can also be used for data objects.

We will see ... or not.


## See also

* [Why web application size matters](https://dev.to/relative-ci/why-web-application-size-matters-51bc)
* [RxJS Streams Explained](https://medium.com/@venurawarnasooriya/rxjs-streams-explained-like-youre-five-but-with-code-6682be0dd5fe)
* [Reactive Programming with RxJS](https://medium.com/@rahul.a1739/reactive-programming-with-rxjs-f3e52d0ca1eb)
* [Data binding in Web components](https://www.mathertel.de/blog/2025/0417-sfc-data.htm)

