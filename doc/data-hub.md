# Data Hub

The core purpose of the **Data Hub** is to create and support reactive data structures for frontend components by using
a minimal sized but still applicable functionality to fit into scenarios where [Size Matters].

Within the software stack the **Data Hub** implements the layer for a centralized data management that can keep the web
application wide data and state and provides the mechanisms for binding parts and components of the application.

> The concept of **reactive programming** is centered around data flows within your application and the propagation of
> changes.  When data changes, the parts of the application that depend on this property will be automatically
> updated.  This is the core idea implemented in many frontend libraries like React, Angular, Vue.js, MobX...

See [Data binding in Web components](https://www.mathertel.de/blog/2025/04 01-sfc- data .htm ) for further conceptual
information that was published in the blog of mathertel.de .

This implementation provides a consistant minimal but extendable implementation to support

* Component based frontend applications
* Support structured data objects
* Works in situations with memory restrictions like Web frontends of IoT devices.

It implements a simplified Publish / Subscriber Pattern for loosely coupled, event driven interfaces.


## Implementation

The `DataHub` class implemented here provides a more lightweight and efficient mechanism for managing and sharing state
across components in a web application.  It is implemented in [data-hub.ts](/src/data-hub.ts) and compiled into a
JavaScript ESM module.

Because [Size Matters] the data hub is implemented with some assumptions and doesn't support all use cases you can
imagine.


### Data changes must be done using the publish function

The data hub doesn't protect the inner data object but assumes that all publishers behave as friendly as defined.

The internal data object can be retrieved by the get() function and the values can be changed on this object freely and
bypassing the change detection.  Using this approach the subscribers will not be informed about changes.

When you need this kind of observations on changes a more complex and hence more size consuming library will be required
working with multi level proxy implementations.

But to keep in mind:

In many cases i have seen changes to the client side data is initiated by calling server side functions that retrieve
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


