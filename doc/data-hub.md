# Data Hub

Within this data stack the **Data Hub** implements the layer for a centralized data management that can keep the web
application wide data and state and provides the mechanisms for binding parts and components of the application.

The `DataHub` class provides a lightweight, efficient mechanism for managing and sharing state across components in a web application. It is implemented in [data-hub.ts](/src/data-hub.ts) and compiled into a JavaScript ESM module.

See [Data binding in Web components](https://www.mathertel.de/blog/2025/04 01-sfc- data .htm ) for further conceptual
information that was published in the blog of mathertel.de .

This implementation again focuses of providing a consistant minimal but extendable implementation to support

* Component based frontend applications
* Support structured data objects
* Works in situations with memory restrictions like Web frontends of IoT devices.

It implements a simplified Publish / Subscriber Pattern for loosely coupled, event driven interfaces.

## Installation

Include the `data-hub.js` module in your HTML file and specify the optional storage:

```html
<script type="module">
  import { DataHub } from '/data-hub.js';
  window.datahub.configurePersistence(sessionStorage, "datahub_store");
  ...
</script>
```

This will make the `DataHub` instance available globally as `window.datahub`.

---

## Class: `DataHub`

### Methods

#### `constructor(storageObject?: Storage, key?: string)`

Creates a new instance of the `DataHub` class with data storage support.

* **Parameters:**
  * `storageObject` *(optional, Storage)*: The storage object where the data should be saved (e.g., `sessionStorage` or `localStorage`).
  * `key` *(optional, string)*: The key under which the data should be stored.

* **Example:**

  ```javascript
  // Initialize DataHub with sessionStorage and a key
  const dataHub = new DataHub(sessionStorage, "datahub_store");
  ```

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


#### `publish(path: string, data: any): void`

Publishes data to a specific path in the state.

* **Parameters:**
  * `path` *(string)*: The path where the data should be published. Use dot notation for nested paths.
  * `data` *(any)*: The data to be published.

* **Example:**

  ```javascript
  window.datahub.publish("user.profile", { name: "John Doe", age: 30 });
  ```

---

#### `subscribe(path: string, callback: (data: any) => void): () => void`

Subscribes to changes at a specific path in the state.

* **Parameters:**
  * `path` *(string)*: The path to subscribe to. Use dot notation for nested paths.
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

---

#### `get(path: string): any`

Retrieves the current value at a specific path in the state.

* **Parameters:**
  * `path` *(string)*: The path to retrieve the value from. Use dot notation for nested paths.

* **Returns:** The value at the specified path, or `undefined` if the path does not exist.

* **Example:**

  ```javascript
  const profile = window.datahub.get("user.profile");
  console.log(profile);
  ```

---

#### `unsubscribeAll(): void`

Unsubscribes all listeners from the `DataHub`.

* **Example:**

  ```javascript
  window.datahub.unsubscribeAll();
  ```

---

## Best Practices

1. Always unsubscribe when components unmount to avoid memory leaks.
2. Use dot notation for nested paths to maintain a clear and consistent structure.
3. Validate data before publishing it to ensure state integrity.
4. Use `configurePersistence` or pass `storageObject` and `key` in the constructor to persist data across browser
   refreshes or navigation.

---

## Example Usage

```javascript

// Initialize DataHub with sessionStorage and a key
const dataHub = new DataHub(sessionStorage, "datahub_store");

// Publish data
window.datahub.publish("app.settings", { theme: "dark", language: "en" });

// Subscribe to changes
const unsubscribe = window.datahub.subscribe("app.settings", (settings) => {
  console.log("Settings updated:", settings);
});

// Get current state
const settings = window.datahub.get("app.settings");
console.log(settings);

// Unsubscribe when no longer needed
unsubscribe();
```


