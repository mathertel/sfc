// File: data-hub.ts
//
// Copyright (c) 2025 by Matthias Hertel, http://www.mathertel.de
// This work is licensed under a BSD-3-Clause license. See http://www.mathertel.de/License.aspx
//
// Implementation of a client side data layer with publis/subscribe cababilities.
//
// Documentation is available at <https://github.com/mathertel/sfc/blob/main/doc/data.md>

import { PathSpecifier, JsonParseCallback, findNode, mergeObject, walk } from './json-parse.js';

/**
  * This interface defines the structure of an entry in the data hub's registration list.
  */
interface HubEntry {
  id: number;  // number for later un-registration
  match: RegExp; // regular expression for matching paths
  callback: JsonParseCallback; // callback function to be called when a matching path is found
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
  private _store: object = {};

  get(path: PathSpecifier): any {
    try {
      const cursor = findNode(this._store, path, false);
      return cursor.pathNodes.at(-1);
    } catch (e) {
      return undefined;
    }
  } // get()

  // inform all subscribers 
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
  subscribe(matchPath: string, fCallback: JsonParseCallback): number {
    const id = this.#lastId++;

    // treating upper/lowercase equal is not clearly defined, but true with domain names.
    const rn = matchPath.toLocaleLowerCase();

    // build a regexp pattern that will match the event names
    const re = '^' + rn
      .replace(/\*\*/g, '[A-Za-z0-9._-]{0,}')
      .replace(/\*/g, '[^.]*') +
      '$';

    console.debug('hub', `subscribe(${matchPath})`, re);

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
  replay(path: PathSpecifier) {
    walk(this._store, path, (path: string, value: any) => {
      console.debug('hub', `replay(${path}, ${JSON.stringify(value)})`);
      this.#inform(path, value);
    });
  } // replay


  /**
   * Publish new structured data to the data store by passing an object.
   * @param obj
   */
  publish(path: PathSpecifier, obj: any) {
    console.log("hub", `publish('${path}', ${JSON.stringify(obj)})`);

    // create cursor to relative root node of the _store object.
    const cursor = findNode(this._store, path, true);

    // merge the data and inform all subscribers.
    const c = mergeObject(cursor, obj, this.#inform.bind(this));

    // inform all subscribers of more global objects.
    while (c && cursor.pathKeys.length > 0) {
      const path = cursor.pathKeys.join('.').substring(1);
      this.#inform(path, cursor.pathNodes.at(-1));
      cursor.pathKeys.pop();
      cursor.pathNodes.pop();
    }
  } // publish()

} // DataHub class

declare global {
  interface Window {
    datahub: DataHub;
  }
}

window.datahub = new DataHub();

// End.
