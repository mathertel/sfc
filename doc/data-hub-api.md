# Data Hub API

## Installation

Include the `data-hub.js` module in your HTML file and specify the optional storage:

```html
<script type="module">
  import { DataHub } from '/data-hub.js';
  // optional:
  window.datahub.configurePersistence(sessionStorage, "myDataKey");
</script>
```

This will make the `DataHub` instance available globally as `window.datahub` so even non-module JavaScript can freely
access it.


## DataHub Class


### Overview

The Data Hub is implemented in [data-hub.ts](/src/data-hub.ts) using Typescript and is compiled into a JavaScript ESM
module that requires about 2 kByte of download size that must be included in the page:

See also [Data Hub](data-hub.md)


### Methods


#### `configurePersistence(storageObject: Storage, key: string): void`

Configures the `DataHub` to persist its store to a specified storage object.

* **Parameters:**

  * `storageObject` *(Storage)*: The storage object where the data should be saved (e.g., `sessionStorage` or `localStorage`).
  * `key` *(string)*: The key under which the data should be stored.

* **Example:**

  ```javascript
  // Configure persistence with localStorage and a key
  window.datahub.configurePersistence(localStorage, "datahub_store");
  ```


#### `publish(path: string | key[], data: any): void`

Publishes data to a specific path in the state.

* **Parameters:**

  * `path` *(string | key[])*: The path where the data should be published.  
    Use dot notation or array of keys for nested paths.
  * `data` *(any)*: The data to be published.

* **Example:**

  ```javascript
  window.datahub.publish("user.profile", { name: "John Doe", age: 30 });
  ```


#### `subscribe(path: string | key[], callback: (data: any) => void): () => void`

Subscribes to changes at a specific path in the state.

* **Parameters:**
  * `path` *(string | key[])*: The path to subscribe to.  
    Use dot notation or array of keys for nested paths.
  * `callback` *(function)*: A function that will be called whenever the data at the specified path changes. The function receives the updated data as an argument.

* **Returns:** A function to unsubscribe from the path.

* **Example:**

  ```javascript
  const unsubscribe = window.datahub.subscribe("user.profile", (data) => {
    console.log("Profile updated:", data);
  });

  // To unsubscribe:
  unsubscribe();
  ```


#### `get(path: string | key[]): any`

Retrieves the current value at a specific path in the state.

* **Parameters:**
  * `path` *(string | key[])*: The path to retrieve the value from.  
    Use dot notation or array of keys for nested paths.

* **Returns:** The value at the specified path, or `undefined` if the path does not exist.

* **Example:**

  ```javascript
  const profile = window.datahub.get("user.profile");
  console.log(profile);
  ```


#### `replay(path: string | key[]): void`

Replay the data attributes in the store data for a specific path to all subscribers.

* **Parameters:**

  * `path` *(string | key[])*: The path where the data should be published.
     Use dot notation or array of keys for nested paths.

* **Example:**

  ```javascript
  window.datahub.replay("user.profile");
  ```


## See also

* [Data Hub](data-hub.md)
