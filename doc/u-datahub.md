# DataHub Overview

The Data Hub (**DataHub**) is a custom element that enables building and
running web applications in the browser using reactive programming on a central data
model.
The DataHub offers efficient mechanism for managing and sharing state across components in
a browser based web applications.

There is no dependency to huge reactive programming libraries like `Observer` and `RxJS`
or other libraries to keep the size of the download and implementation small enough to
be used in web frontends for IoT devices where [Size Matters].

For background information see also [Reactive Data and Programming using SFC components](reactive.md)


## Setup

```html
<script src="/loader.js"></script>
<u-datahub></u-datahub>

<script type="module">
  await window.loadComponent("u-datahub");
</script>
```

Configure persistence optionally after the component is loaded:

```javascript
window.datahub.configurePersistence(localStorage, "datahub");
```

Once loaded, the instance of the first `<u-datahub>` element is available as `window.datahub`.


## Methods

### `configurePersistence(storageObject: Storage, key?: string): void`

Loads the stored data from `storageObject` and saves subsequent published changes under `key`. The key defaults to `"datahub"`.

```javascript
window.datahub.configurePersistence(localStorage, "datahub");
```


### `publish(path: string | (string | number)[], data: any): void`

The `publish` function in the **DataHub** element is used to add, merge or delete data
on the `data` into the store at `path` and notifies matching subscribers. Dot, slash,
and bracket path syntax are accepted. Publishing `undefined` at a path deletes that
value.

```javascript
window.datahub.publish("user.profile", { name: "Ada" });
window.datahub.publish("user.profile.name", "Grace");
```


### `subscribe(matchPath: string, callback: (path: string, value: any) => void): number`

Application or other elements can register callback functions using the `subscribe`
function.

Subscribes to matching changes and returns a numeric subscription ID. The callback
receives the changed path in dot notation and its value. `*` matches within one path
segment; `**` can match across segments.

```javascript
const subscriptionId = window.datahub.subscribe("user.*", (path, value) => {
  console.log(path, value);
});
```


### `unsubscribe(id: number): void`

Removes the subscription with the ID returned by `subscribe()`.

```javascript
window.datahub.unsubscribe(subscriptionId);
```


### `get(path: string | (string | number)[]): any`

Returns the value at `path`, or `undefined` if the path cannot be found.

```javascript
const profile = window.datahub.get("user.profile");
```


### `replay(path: string | (string | number)[]): void`

Notifies matching subscribers with the existing values at `path` and its descendants.

```javascript
window.datahub.replay("user.profile");
```


### `clear(): void`

Clears the in-memory store and all subscriptions, and resets the subscription ID counter. It does not clear the configured storage object.

### `get(path): any`

The internal data object can be retrieved by the `get()` function and the values can be
changed on this object freely and bypassing the change detection. Using this approach
the subscribers will not be informed about changes.

When you need this kind of observations on changes a more complex and hence more size
consuming library will be required working with multi level proxy implementations.


## How it works

The `DataHub` class that is available through the u-datahub element provides a
lightweight and efficient mechanism for managing and sharing state across components in
a web application. Because [Size Matters](https://www.mathertel.de/blog/2025/1001-size-matters.htm) the data hub is implemented with some assumptions and doesn't support all use cases you can imagine.

* The **DataHub** owns and controls the data storage implemented as a
  multi-level JavaScript Object, initially created as an unnamed, empty Object
  `{}`.

<!-- * All inbound data can be `verified` or `transformed` before the data is merged
  into the internal structured data object. -->


## Restrictions

### No detection of circular calls

When subscribing on a specific path and receiving updates it is important to avoid direct updating data within this
callback as this may trigger more callbacks to subscribers and may result in a infinity loop.


### Simplified and restricted path Syntax

The syntax for selecting a node in the data model is using the javascript dot notation
with restrictions on the character set available for the identifiers.

Paths are also given back to subscribers during the callback. The path syntax used here
is always the dot notation as string.

<!-- ### Guaranteed callback order -->

## Examples

### URL Parameters as Data Feed for DataHub

The following small JavaScript code demonstrates how to capture parameters from the URL
and deliver them into the DataHub. This allows using them directly in forms and
components.

``` js
  // build a plain Object with the attributes from the search parameters
  let node = {};
  let params = new URLSearchParams(window.location.search);
  for (const [key, value] of params) {
    node[key] = value;
  } // for

  // add at once to the local reactive data
 window.datahub.publish("hash", node);
```

<!--

### SFC Components using the DataHub

The Single File Components have been implemented especially for **minimal footprint
situations** where the available size on web servers is below 2-8 MByte (yes: Megabyte)
but still providing the required functionality.  This has a strong impact on the
principles of implementation.  The SFC library follows these "micro implementation"
principles.

1. Data binding is not implemented by using a full featured library like RxJS but.
   Using the DataHub implementation offers enough functionality with a lower memory
   footprint.

2. Using native web component implementations that do not need special runtimes or
   frameworks.

3. Use native available functionality.  Functionality in the browser usually comes with
   a low impact on downloads while offering a good selection of feature and a usability
   that users are used to.

    * Prefer using the built-in `<input type="date">` HTML component instead of
      implementing a better looking Date Picker component with lot of HTML, CSS and
      JavaScript.
    * Use new CSS features like `popover` or `dialog` instead of bundling a library.
    * No images when a small SVG can do the same.
    * Use and understand minification tools

4. Powerful client side processors are available while server side processing is on your
   cost and limited as well in IoT devices.

    * When things can be done on both sides, prefer the client side.
    * Deliver data in formats that can be produced easily on the server and can be
      transformed on the client side as required.

5. More specific Coding, less reusing existing libraries

    * Open Source libraries often implement many features to support multiple scenarios.
    * Only implement what you need.

6. Less beautiful -- more functional

    * Any HTML Javascript and CSS without a **functional** requirement can be avoided.

-->


## See also

* [Reactive Data and Programming using SFC components](reactive.md)
* [u-datahub component documentation](u-datahub.md)

External material for reading:

* JSON Path Notation (not supported) <https://datatracker.ietf.org/doc/html/rfc6901>
* [Patterns for Reactivity with Modern Vanilla JavaScript](https://frontendmasters.com/blog/vanilla-javascript-reactivity/)
* [Size Matters]: https://www.mathertel.de/blog/2025/1001-size-matters.htm
