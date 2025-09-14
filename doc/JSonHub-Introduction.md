https://skiplabs.io/docs/introduction

Overview

JSonHub is an open-source implementation that enables software developers to build and run reactive web applications in
the browser.

JSonHub expose reactive data through a PubSub mechanism with structured JavaScript Object data and integrates services
for exchanging data over http(s) to server-side endpoints and to client-side HTML custom controls and functions in read
time.

JSonHub provides a mechanism to integrate computations, transformations and data validation.

Core concept

The JSonHub runtime consists of a set of interfaces and functions that receives a stream of data changes through the
`publish` function.  All inbound data can be verified or transformed before the data is merged into the structured
transparent data object.  By registering subscribers [[Publishers]] => JSonHub.publish(path, data);

Collections and mappers together form a graph of data and computation dependencies that the engine can use to
efficiently maintain reactive computations as inputs and data are updated.

Collections are the core data structure over which reactive computations operate, they are the vertices of the JSonHub
reactive computation graph.  A collection consists of entries, each of which associates one or more values to a key.
Keys and values can be arbitrary JSON data.

Collections can either be eager, meaning they are always kept up-to-date

