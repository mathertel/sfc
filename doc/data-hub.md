# JSonHub

**JSonHub** is an open-source implementation that enables software developers to build and run reactive web applications
in the browser.

**JSonHub** expose reactive data through a PubSub mechanism with structured JavaScript object data and integrates
services for exchanging data over http(s) to server-side endpoints and to client-side HTML custom controls and functions
in real-time.

**JSonHub** provides a mechanism to integrate computations, transformations and data validations.


## Core concept

* The **JSonHub** runtime consists of a set of interfaces and functions that receives a stream of data changes through
  the `publish` function.

* All inbound data can be `verified` or `transformed` before the data is merged into the internal structured data
  object.

* Data change events are distributed to all components or functions that have `subscribed` for beeing informed on a specific 
  data path.

This implementation provides a consistant minimal but extendable implementation supporting frontend components and
applications also in scenarios where [Size Matters]. This includes

* A simplified Publish / Subscriber Pattern for loosely coupled, event driven interfaces.
* Support of component based frontend applications.
* Support structured data objects exchanged by server-side services.
* It fits in situations with memory restrictions like Web frontends of IoT devices.

## Reactive Programming Concept

Within the software stack the **Data Hub** implements the layer for a centralized data management that can keep the web
application wide data and state and provides the mechanisms for binding parts and components of the application.

> The concept of **reactive programming** is centered around data flows within your application and the propagation of
> changes.  When data changes, the parts of the application that depend on this property will be automatically
> updated.  This is the core idea used in many frontend libraries like React, Angular, Vue.js, MobX...

See [Data binding in Web components](<https://www.mathertel.de/blog/2025/0417-sfc-data.htm) for further conceptual
information that was published in the blog of __mathertel.de__.

## Implementation

The `DataHub` class implemented here provides a more lightweight and efficient mechanism for managing and sharing state
across components in a web application.  It is implemented in [data-hu  b.ts](/src/data-hub.ts) and compiled into a
JavaScript ESM module.

Because [Size Matters] the data hub is implemented with some assumptions and doesn't support all use cases you can
imagine.


### Data Change using the Publish Function

The `publish(path, data)` function is there to apply changes on the client-side data.

It supports 2 parameters:

* **path** -- This parameter specifies the root in the data object.  The path is specified by the point or slash
  separated list of descending attribute names or brackets for array objects. (See example below)

* **data** -- This parameter contains the new (partial) data object starting at the node specified by the `path`
  argument.

The data hub doesn't protect the inner data object but assumes that all publishers behave friendly as defined.

The internal data object can be retrieved by the `get()` function and the values can be changed on this object freely
and bypassing the change detection.  Using this approach the subscribers will not be informed about changes.

When you need this kind of observations on changes a more complex and hence more size consuming library will be required
working with multi level proxy implementations.


## Example

At start the inner data object is:

```json
{
  "hash": {
    "sys": 1
  },
  "env": {
    "device": {
      "0": {
        "name": "clock",
        "description": "Clock display",
        "loglevel": 2
      }
    }
  },
  "config": {
    "bulb": {
      "b": {
        "name": "bulb01",
        "value": [0,255,0],
      }
    }
  }
}
```

To receive changes on the data the following paths can be used:

* `/` -- The subscriber will receive all changes.
* `/hash` -- The subscriber will receive all changes of the **hash** node under the root.
  Equivalent notations are `.hash`, `hash`, `[hash]`.
* `/config/bulb/b` -- The subscriber will receive all changes of the `b` node under the nodes `config` and `bulb`.
  Equivalent notations are `.config.bulb.b`, `.config.bulb[b]`.

To change the name attribute of the bulb/b the following publish calls can be used:

* `publish('/config', { "bulb": { "b": { "name": "bulb02" }}})`
* `publish('/config/bulb', { "b": { "name": "bulb02" }})`
* `publish('/config/bulb/b', { "name": "bulb02" })`
* `publish('/config/bulb/b/name', "bulb02")`

All other not mentioned attributes are remaining as is.

To add another bulb the following publish calls can be used:

* `publish('/config/bulb/n', { "name": "newbulb", "value: [255,0,0] })`


But to keep in mind:

In many cases I have seen changes to the client side data is initiated by calling server side functions that retrieve
data e.g.  from a database or listening to queues like PubSub or websockets push packets.  To merge this new or updated
values also retrieved as JSON objects into the existing client side data model is more complex than changing simple
attributes -- but this is what has been implemented in the data hub


### No detection of circular calls

When subscribing on a specific path and receiving updates it is important to avoid direct updating data within this
callback as this may trigger more callbacks to subscribers and may result in a infinity loop.


### Simplified and restricted path Syntax

Das syntax for selecting a node in the data model is using the javascript dot notation with restrictions on the
character set available for the identifiers.

Paths are also given back to subscribers during the callback.  The path syntax used here is always the dot notation as
string.


<!-- ### Guaranteed callback order -->

## See also

* [Data Hub API](data-hub-api.md)

External material for reading:

* JSON Path Notation (not supported) <https://datatracker.ietf.org/doc/html/rfc6901>
* [Patterns for Reactivity with Modern Vanilla JavaScript](https://frontendmasters.com/blog/vanilla-javascript-reactivity/)

