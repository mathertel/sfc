// json-parse.ts: Set of JavaScript Object manipulation functions for traversing, merging, and modifying complex objects.
// This functionality is used in the JSonHub implementation.
// 
// These functions use the dot notation syntax for path expressions:
// E.g. "a.b.c" to select  { a : { b: { c:42 } } }.
// The path expression used as parameters can be a dot, slash or backslash separated strings or an array of keys.
// The path expression generated for callbacks are always using the dot notation e.g. "a[0].b" is expressed as "a.0.b".
// Consequence: do not use dot, slash or backslash characters in attribute names.

// Similar solution on merging objects in a deep way can be found e.g. https://github.com/TehShrike/deepmerge
// However here the callback functiopnality is added to enable data-responsive solutions.

// Callbacks are called with the path and the value of the node that was changed or added.
export type Callback = (
  path: string,
  value: any
) => void;


/** Keys in path array can be either strings or numbers. */
type key = (string | number);


/** PathSpec is a type that can be either a string or an array of keys and is used in input path parameters. */
export type PathSpec = string | key[];


/** PathCursor is an internally used type that represents the current position in the object hierarchy during traversal. */
type PathCursor = {
  pathKeys: key[];
  pathNodes: any[];
};


/**
 * TokenizePath splits a path expression into an array of keys using dot notation or bracket notation.
 * Supports three types of path segments:
 * - Identifiers: Valid JavaScript identifiers (e.g., 'propertyName', '_property', '$value')
 * - Array indices: Numeric indices in brackets (e.g., '[0]', '[42]')
 * - Quoted properties: String properties in brackets (e.g., ['propName'], ["propName"])
 *
 * @param path - The path expression to parse.
 *   Can use dot notation (obj.prop) or bracket notation (obj['prop'] or obj[0])
 * @returns An array of path segments as strings (for property names)
 *   or numbers (for array indices), or undefined if the path syntax is invalid.
 * @example
 * tokenizePath('users[0].name')     // returns ['users', 0, 'name']
 * tokenizePath("obj['prop']")       // returns ['obj', 'prop']
 * tokenizePath('items[2]')          // returns ['items', 2]
 */
export function tokenizePath(path: string): key[] {
  const keys: key[] = [];
  let m: RegExpMatchArray | null;

  while (path.length > 0) {
    if ((m = path.match(/^[./\\]/))) {
      // any separator... ignore
      // ignore
      path = path.substring(m[0].length);

    } else if ((m = path.match(/^[a-zA-Z_$][a-zA-Z0-9_$-]*/))) {
      // identifier
      keys.push(m[0]);
      path = path.substring(m[0].length);

    } else if ((m = path.match(/^\d+/))) {
      // number index
      keys.push(Number(m[0]));
      path = path.substring(m[0].length);

    } else if ((m = path.match(/^\[(?<index>\d+)\]/))) {
      // number index
      if (m.groups?.index) keys.push(Number(m.groups?.index));
      path = path.substring(m[0].length);

    } else if ((m = path.match(/^\[['"]?(?<ident>[a-zA-Z_$][a-zA-Z0-9_$-]*)['"]?\]/))) {
      // ident in brackets
      if (m.groups?.ident) keys.push(m.groups?.ident);
      path = path.substring(m[0].length);

    } else {
      debugger; // should not happen
      throw new Error(`Invalid path syntax at '${path}'`);
    }
  }

  return (keys);
}


/**
 * Navigates through a nested object structure using a path specification to locate a node and return a cursor.
 * This function is case-sensitive.
 * 
 * @param obj - The object to traverse
 * @param path - Path specification as either a dot-separated string (e.g., "foo.bar") or array of keys
 * @param create - If true, creates missing objects along the path. If false, throws error on missing nodes
 * @returns PathCursor object containing arrays of traversed keys and nodes
 * @throws {Error} When a path node is not found and create is false
 * 
 * @example
 * ```typescript
 * const obj = { foo: { bar: 123 } };
 * const cursor = find(obj, "foo.bar");
 * // cursor = { pathKeys: ['', 'foo', 'bar'], pathNodes: [obj, obj.foo, 123] }
 * ```
 */
export function find(obj: any, path: PathSpec, create: boolean = false): PathCursor {
  // console.log("json", "findNode()");
  let keys: key[];

  // create cursor to _store object only
  const cursor: PathCursor = {
    pathKeys: [''],
    pathNodes: [obj]
  };

  if (!path) {
    return cursor;

  } else if (typeof path === 'string') {
    keys = tokenizePath(path);

  } else {
    keys = path as key[]; // If path is already an array, use it directly.
  }

  for (const key of keys) {
    // console.log('key:', key, 'obj:', obj);
    if (!obj[key]) {
      // If the key is not present, create a new empty object.
      if (create) {
        obj[key] = {}; // Create a new empty object if the key doesn't exist.
      } else {
        throw new Error(`Node not found '${path}'`);
      }
    }
    cursor.pathKeys.push(key);
    cursor.pathNodes.push(obj[key]);
    obj = obj[key];
  }

  return (cursor);
} // find()


/**
 * walk recursively traverses through an object tree, calling a callback function for each node.
 * 
 * @param store - The root object to start walking from
 * @param path - A path specification to determine the starting point in the object tree
 * @param cbFunc - Callback function that gets called for each node. 
 *                 Receives the dot-notation path (string) and the current node value as parameters
  * @example
 * ```typescript
 * walk(myObject, "path.to.start", (path, value) => {
 *   console.log(`${path}: ${value}`);
 * });
 * ```
 * 
 * The function traverses the object tree starting from the specified path,
 * calling the callback function for each node encountered, including leaf nodes and
 * intermediate objects.
 */
export function walk(store: any, path: PathSpec, cbFunc: Callback) {

  /** internal function used in recursion */
  function _walk(cursor: PathCursor) {
    const obj = cursor.pathNodes.at(-1);

    if (typeof obj === "object") {
      // } else {
      for (const key in obj) {
        cursor.pathKeys.push(key);
        cursor.pathNodes.push(obj[key]);
        _walk(cursor);
        cursor.pathKeys.pop();
        cursor.pathNodes.pop();
      } // for
    }
    // inform about this node too.
    cbFunc(cursor.pathKeys.join('.').substring(1), obj);
  } // _walk()

  // start with root and scan recursively.
  _walk(find(store, path, true));
} // walk()


/**
 * Merges obj into storage object recursively while detecting changes or additions.
 * This function modifies obj1 in place and calls the callback function with details where changes or additions occurred.
 * It handles nested objects and arrays, and it can clear values in obj1 if they are not present in obj2.
 * 
 * @param cursor - The cursor trail into the storage object.
 * @param obj - The source object whose properties will be merged into storage object.
 * @param cbFunc - Callback function that gets called when changes are detected
 * @returns boolean indicating whether any changes were made during the merge
 * 
 * The callback function receives the following parameters:
 * - path: The current path in the object hierarchy
 * - value: The new value
 * 
 * The function handles the following cases:
 * - Null/undefined values: Removes the property from obj1
 * - Objects: Recursively merges nested objects
 * - Arrays: Replaces the array items
 * - Primitive values: Updates the value if different
 */
export function merge(cursor: PathCursor, obj: any, cbFunc: Callback): boolean {
  // console.log("json", `mergeObject('${cursor.pathKeys.join('.')}', ${JSON.stringify(obj)})`);

  let hasChanged = false;
  const len = cursor.pathKeys.length;

  if (typeof obj !== "object") {
    // merge the primitive value into the parent node
    const node = cursor.pathNodes[len - 2];
    const k = cursor.pathKeys[len - 1];

    if ((obj === undefined) || (obj === null)) {
      // clear the value
      delete node[k];
      hasChanged = true;

    } else if (node[k] !== obj) {
      cursor.pathNodes[len - 1] = node[k] = obj;
      hasChanged = true;
    }

  } else {
    // merge the more complex object or array

    for (let key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let changedThis = false; // Flag to track if the current key has changed
        const newValue: any = obj[key];
        if (typeof key === "string") {
          key = key.toLowerCase(); // convert key to lower case
        }

        // update cursor to include current key & node/value
        cursor.pathKeys.push(key);
        cursor.pathNodes.push(cursor.pathNodes[len - 1][key]); // 'old' value

        // apply changes on this node
        if (typeof newValue !== "object") {
          // set or clear a primitive value
          if (merge(cursor, newValue, cbFunc)) changedThis = true;

        } else {
          // Object or Array
          const node = cursor.pathNodes[len - 1];

          // Create an empty object or array if the key doesn't exist.
          if (!node[key]) {
            node[key] = Array.isArray(newValue) ? [] : {};
            cursor.pathNodes[len] = node[key];
            changedThis ||= true;
          } // if

          // Recursively merge nested objects.
          if (merge(cursor, newValue, cbFunc)) changedThis = true;
        }

        // If the current node/value has changed, call the callback function.
        if (changedThis) {
          // Create the path string from the cursor keys
          cbFunc(cursor.pathKeys.join('.').substring(1), cursor.pathNodes[len]);
          hasChanged = true;
        }

        // reverse cursor to previous state
        cursor.pathKeys.pop();
        cursor.pathNodes.pop();
      }
    }
  }
  return (hasChanged);
}

// End.