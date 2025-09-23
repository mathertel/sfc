// File: data-hub.ts
//
// Copyright (c) 2025 by Matthias Hertel, http://www.mathertel.de
// This work is licensed under a BSD-3-Clause license. See http://www.mathertel.de/License.aspx
//
// Implementation of a client side data layer with publis/subscribe cababilities.
//
// Documentation is available at <https://github.com/mathertel/sfc/blob/main/doc/data.md>

import * as jsonParse from './json-parse.js';

/**
  * This interface defines the structure of an entry in the data hub's registration list.
  */
interface HubEntry {
  id: number;  // number for later un-registration
  match: RegExp; // regular expression for matching paths
  callback: jsonParse.Callback; // callback function to be called when a matching path is found
}

/** This interface defines the list of registrations. */
interface HubEntryList {
  [s: number]: HubEntry;
}

/**
 * DataHub is a publish/subscribe pattern implementation for structured data
 * that allows hierarchical organization of data using paths and provides
 * pattern matching capabilities for subscriptions.
 * 
 * The data is organized in a tree structure using paths (e.g. "/device/sensor1/temperature")
 * and can be accessed using the read/write methods or through subscriptions.
 * 
 * Subscriptions can use wildcards:
 * - '*' matches any sequence of characters in a single path segment
 * - '**' matches any sequence of characters across multiple path segments
 * 
 * @remarks
 * - All paths and keys are treated case-insensitive
 * - The internal store is maintained as a hierarchical object structure
 * - Subscriptions can be cancelled using the returned subscription ID
 */
export class DataHub {
  #registry = new Set<HubEntry>();
  #lastId = 0;
  #store: object = {};

  #storageObject: Storage | undefined = undefined;
  #storageKey!: string;


  /**
   * Constructs a new instance of the DataHub class.
   * 
   * @param storageObject - (Optional) The storage object where the data should be saved (e.g., sessionStorage or localStorage).
   * @param key - (Optional) The key under which the data should be stored.
   */
  constructor(storageObject?: Storage, key?: string) {
    this.clear();
    if (storageObject) {
      this.configurePersistence(storageObject, key);
    }
  }

  // remove all subscribers and set data to empty object.
  clear(): void {
    this.#registry.clear();
    this.#lastId = 0;
    this.#store = {};
  } // clear()


  /**
   * Configures the DataHub to persist its store to a specified storage object.
   * 
   * @param storageObject - The storage object where the data should be saved (e.g., sessionStorage or localStorage).
   * @param key - The key under which the data should be stored.
   */
  configurePersistence(storageObject: Storage, key: string = 'datahub'): void {
    if (!storageObject || typeof storageObject.setItem !== 'function') {
      throw new Error("Invalid storage object. Must implement the Storage interface.");
    }

    this.#storageObject = storageObject;
    this.#storageKey = key || 'datahub';

    // Load the store from storage if it exists
    const storedData = this.#storageObject.getItem(this.#storageKey);
    if (storedData) {
      try {
        this.#store = JSON.parse(storedData);
      } catch (e) {
        console.error("Failed to load DataHub store from storage:", e);
      }
    }
  } // configurePersistence()


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
  get(path: jsonParse.PathSpec): any {
    try {
      const cursor = jsonParse.find(this.#store, path, false);
      return cursor.pathNodes.at(-1);
    } catch (e) {
      return undefined;
    }
  } // get()


  /**
   * Notify all registered subscribers whose match pattern matches the given path.
   * @param path - The path to match against registered patterns
   * @param value - The value to pass to matching callbacks
   * @private
   */
  #inform(path: string, value: any) {
    // console.debug('hub', `_inform(${path})`);
    this.#registry.forEach(r => {
      // console.debug('DataHub', 'match', r.match);
      if (path.match(r.match)) { r.callback(path, value); }
    });
  } // #inform()


  /**
   * Subscribe to changes in the store using a path expression
   * @param {string} matchPath expression for the registration
   * @param {JsonParseCallback} fCallback
   * @param {boolean} replay
   * @returns {number} number of registration
   */
  subscribe(matchPath: string, fCallback: jsonParse.Callback): number {
    const id = this.#lastId++;

    // treating upper/lowercase equal is not clearly defined, but true with domain names.
    let rn = matchPath.toLocaleLowerCase();

    // use . not '/' as path delimiter
    rn = rn.replace('/', '.');

    // ignore leading .character
    if (rn[0] === '.') { rn = rn.substring(1); }

    // build a regexp pattern that will match the event names
    const re = '^' + rn
      .replace(/\*\*/g, '[A-Za-z0-9._-]{0,}')
      .replace(/\*/g, '[^.]*') +
      '$';

    console.debug('hub', `subscribe(${matchPath}) using '${re}'`);

    const newEntry: HubEntry = {
      id: id,
      match: RegExp(re),
      callback: fCallback
    };
    this.#registry.add(newEntry);
    return id;
  } // subscribe

  /**
   * Cancel a subscription.
   * @param id subscription registration id.
   */
  unsubscribe(id: number) {
    this.#registry.forEach(r => {
      if (r.id === id) {
        this.#registry.delete(r);
      }
    });
  } // unsubscribe


  /**
   * Replay the store data for a specific path.
   * @param path root node of the data to be replayed
   */
  replay(path: jsonParse.PathSpec) {
    jsonParse.walk(this.#store, path, (path: string, value: any) => {
      console.debug('hub', `replay(${path}, ${JSON.stringify(value)})`);
      this.#inform(path, value);
    });
  } // replay


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
  publish(path: jsonParse.PathSpec, obj: any) {
    console.debug("hub", `publish('${path}', ${JSON.stringify(obj)})`);

    // create cursor to relative root node of the _store object.
    const cursor = jsonParse.find(this.#store, path, true);

    // merge the data and inform all subscribers.
    const c = jsonParse.merge(cursor, obj, this.#inform.bind(this));

    // inform all subscribers of more global objects.
    while (c && cursor.pathKeys.length > 0) {
      const path = cursor.pathKeys.join('.').substring(1);
      this.#inform(path, cursor.pathNodes.at(-1));
      cursor.pathKeys.pop();
      cursor.pathNodes.pop();
    }

    // store the data in the defined storage.
    if (this.#storageObject) {
      try {
        const jsonData = JSON.stringify(this.#store);
        this.#storageObject.setItem(this.#storageKey, jsonData);
      } catch (e) {
        console.error("Failed to save DataHub store to storage:", e);
      }
    }
  } // publish()

  static tokenizePath(path: string): (string | number)[] {
    return jsonParse.tokenizePath(path);
  }
} // DataHub class


/**
 * Extends the global Window interface to include the datahub property.
 * This declaration ensures TypeScript recognizes the datahub property as a valid member of the Window object.
 * 
 * @global
 * @interface Window
 * @property {DataHub} datahub - The global DataHub instance accessible through the window object
 */
declare global {
  interface Window {
    datahub: DataHub;
  }
}

window.datahub = new DataHub();

// End.