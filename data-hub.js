// src/json-parse.ts
var PathItemRegExp = /^\.?(?<ident>[a-zA-Z_$][a-zA-Z0-9_$-]*)|^\.?(?<index>\d+)/;
function pathKeys(path) {
  const keys = [];
  while (path && path.length > 0) {
    const m = path.match(PathItemRegExp);
    if (!m) {
      throw new Error(`Invalid path syntax at '${path}'`);
    } else if (m?.groups?.ident) {
      keys.push(m.groups.ident);
    } else if (m?.groups?.index) {
      keys.push(Number(m.groups.index));
    } else if (m?.groups?.prop) {
      keys.push(m.groups.prop);
    }
    path = path.substring(m[0].length);
  }
  return keys;
}
function find(obj, path, create = false) {
  let keys;
  const cursor = {
    pathKeys: [""],
    pathNodes: [obj]
  };
  if (!path) {
    return cursor;
  } else if (typeof path === "string") {
    path = path.replace(/\//g, ".");
    keys = pathKeys(path);
  } else {
    keys = path;
  }
  for (const key of keys) {
    if (!obj[key]) {
      if (create) {
        obj[key] = {};
      } else {
        throw new Error(`Node not found '${path}'`);
      }
    }
    cursor.pathKeys.push(key);
    cursor.pathNodes.push(obj[key]);
    obj = obj[key];
  }
  return cursor;
}
function walk(store, path, cbFunc) {
  function _walk(cursor) {
    const obj = cursor.pathNodes.at(-1);
    if (typeof obj === "object") {
      for (const key in obj) {
        cursor.pathKeys.push(key);
        cursor.pathNodes.push(obj[key]);
        _walk(cursor);
        cursor.pathKeys.pop();
        cursor.pathNodes.pop();
      }
    }
    cbFunc(cursor.pathKeys.join(".").substring(1), obj);
  }
  _walk(find(store, path, true));
}
function merge(cursor, obj, cb) {
  let hasChanged = false;
  const len = cursor.pathKeys.length;
  if (typeof obj !== "object") {
    const node = cursor.pathNodes[len - 2];
    const k = cursor.pathKeys[len - 1];
    if (obj === void 0 || obj === null) {
      delete node[k];
      hasChanged = true;
    } else if (node[k] !== obj) {
      cursor.pathNodes[len - 1] = node[k] = obj;
      hasChanged = true;
    }
  } else {
    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let changedThis = false;
        const newValue = obj[key];
        if (typeof key === "string") {
          key = key.toLowerCase();
        }
        cursor.pathKeys.push(key);
        cursor.pathNodes.push(cursor.pathNodes[len - 1][key]);
        if (typeof newValue !== "object") {
          if (merge(cursor, newValue, cb)) changedThis = true;
        } else {
          const node = cursor.pathNodes[len - 1];
          if (!node[key]) {
            node[key] = Array.isArray(newValue) ? [] : {};
            cursor.pathNodes[len] = node[key];
            changedThis ||= true;
          }
          if (merge(cursor, newValue, cb)) changedThis = true;
        }
        if (changedThis) {
          cb(cursor.pathKeys.join(".").substring(1), cursor.pathNodes[len]);
          hasChanged = true;
        }
        cursor.pathKeys.pop();
        cursor.pathNodes.pop();
      }
    }
  }
  return hasChanged;
}

// src/data-hub.ts
var DataHub = class {
  #registry = /* @__PURE__ */ new Set();
  #lastId = 0;
  #store = {};
  #storageObject = void 0;
  #storageKey;
  /**
   * Constructs a new instance of the DataHub class.
   * 
   * @param storageObject - (Optional) The storage object where the data should be saved (e.g., sessionStorage or localStorage).
   * @param key - (Optional) The key under which the data should be stored.
   */
  constructor(storageObject, key) {
    this.clear();
    if (storageObject) {
      this.configurePersistence(storageObject, key);
    }
  }
  // remove all subscribers and set data to empty object.
  clear() {
    this.#registry.clear();
    this.#lastId = 0;
    this.#store = {};
  }
  // clear()
  /**
   * Configures the DataHub to persist its store to a specified storage object.
   * 
   * @param storageObject - The storage object where the data should be saved (e.g., sessionStorage or localStorage).
   * @param key - The key under which the data should be stored.
   */
  configurePersistence(storageObject, key = "datahub") {
    if (!storageObject || typeof storageObject.setItem !== "function") {
      throw new Error("Invalid storage object. Must implement the Storage interface.");
    }
    this.#storageObject = storageObject;
    this.#storageKey = key || "datahub";
    const storedData = this.#storageObject.getItem(this.#storageKey);
    if (storedData) {
      try {
        this.#store = JSON.parse(storedData);
      } catch (e) {
        console.error("Failed to load DataHub store from storage:", e);
      }
    }
  }
  // configurePersistence()
  /**
   * Retrieves a value from the internal store using a JSON path specification.
   * 
   * @param path - The JSON path specification used to locate the desired value
   * @returns The value at the specified path, or undefined if the path is invalid or doesn't exist
   * 
   * @example
   * ```ts
   * // Get value at path "users.0.name"
   * const name = dataHub.get(["users", 0, "name"]);
   * ```
   */
  get(path) {
    try {
      const cursor = find(this.#store, path, false);
      return cursor.pathNodes.at(-1);
    } catch (e) {
      return void 0;
    }
  }
  // get()
  /**
   * Notify all registered subscribers whose match pattern matches the given path.
   * @param path - The path to match against registered patterns
   * @param value - The value to pass to matching callbacks
   * @private
   */
  #inform(path, value) {
    this.#registry.forEach((r) => {
      if (path.match(r.match)) {
        r.callback(path, value);
      }
    });
  }
  // #inform()
  /**
   * Subscribe to changes in the store using a path expression
   * @param {string} matchPath expression for the registration
   * @param {JsonParseCallback} fCallback
   * @param {boolean} replay
   * @returns {number} number of registration
   */
  subscribe(matchPath, fCallback) {
    const id = this.#lastId++;
    let rn = matchPath.toLocaleLowerCase();
    rn = rn.replace("/", ".");
    if (rn[0] === ".") {
      rn = rn.substring(1);
    }
    const re = "^" + rn.replace(/\*\*/g, "[A-Za-z0-9._-]{0,}").replace(/\*/g, "[^.]*") + "$";
    console.debug("hub", `subscribe(${matchPath}) using '${re}'`);
    const newEntry = {
      id,
      match: RegExp(re),
      callback: fCallback
    };
    this.#registry.add(newEntry);
    return id;
  }
  // subscribe
  /**
   * Cancel a subscription.
   * @param id subscription registration id.
   */
  unsubscribe(id) {
    this.#registry.forEach((r) => {
      if (r.id === id) {
        this.#registry.delete(r);
      }
    });
  }
  // unsubscribe
  /**
   * Replay the store data for a specific path.
   * @param path root node of the data to be replayed
   */
  replay(path) {
    walk(this.#store, path, (path2, value) => {
      console.debug("hub", `replay(${path2}, ${JSON.stringify(value)})`);
      this.#inform(path2, value);
    });
  }
  // replay
  /**
   * Publishes data to a specified path in the data store and notifies subscribers.
   * The data is merged with existing data at the specified path, and all subscribers
   * of the path and its parent paths are informed about the changes.
   * 
   * @param path - The path specification where the data should be published
   * @param obj - The data object to be published
   * 
   * @example
   * ```typescript
   * dataHub.publish(['users', 'id1'], { name: 'John', age: 30 });
   * ```
   */
  publish(path, obj) {
    console.debug("hub", `publish('${path}', ${JSON.stringify(obj)})`);
    const cursor = find(this.#store, path, true);
    const c = merge(cursor, obj, this.#inform.bind(this));
    while (c && cursor.pathKeys.length > 0) {
      const path2 = cursor.pathKeys.join(".").substring(1);
      this.#inform(path2, cursor.pathNodes.at(-1));
      cursor.pathKeys.pop();
      cursor.pathNodes.pop();
    }
    if (this.#storageObject) {
      try {
        const jsonData = JSON.stringify(this.#store);
        this.#storageObject.setItem(this.#storageKey, jsonData);
      } catch (e) {
        console.error("Failed to save DataHub store to storage:", e);
      }
    }
  }
  // publish()
};
window.datahub = new DataHub();
export {
  DataHub
};
//# sourceMappingURL=data-hub.js.map
