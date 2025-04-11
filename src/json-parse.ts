// JsonParser.ts: Recursive JSON object parser
// Traverse / Scan a complex object and send all nodes with attributes to a receiver function. */

// dot notation syntax for path expressions:
// - /a/b/c  = a.b.c
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors

// See also:
// http://goessner.net/articles/JsonPath/

// The following XPath expression

// /store/book[1]/title

// would look like

// x.store.book[0].title

// or

// x['store']['book'][0]['title']

export type JsonParseCallback = (
  path: string,
  value: any
) => void;

type PathKey = (string | number);

export type PathSpecifier = string | PathKey[];

type PathCursor = {
  pathKeys: PathKey[];
  pathNodes: any[];
};


/**
 * Regular expression for matching path item syntax in a JavaScript/JSON path.
 * Matches the following patterns:
 * identifier : [a-zA-Z_$][a-zA-Z0-9_$]* e.g. a, b, c, _a, $a, _1, $1
 * index numeric : \[\d+\] e.g. [0], [1], [2], [3]
 * property : \[['"].*['"]\] e.g. ['a'], ["b"], ['c']
 */
const PathItemExpression: RegExp =
  /^\.?(?<ident>[a-zA-Z_$][a-zA-Z0-9_$]*)|\[(?<index>\d+)\]|\[(?<q>['"])(?<prop>.*)\k<q>\]/;

/**
 * Splits a path expression into an array of keys using dot notation or bracket notation.
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
 * pathKeys('users[0].name')     // returns ['users', 0, 'name']
 * pathKeys("obj['prop']")       // returns ['obj', 'prop']
 * pathKeys('items[2]')          // returns ['items', 2]
 */
export function pathKeys(path: string): PathKey[] {
  // console.log(`pathKeys(${path})`);

  const keys: PathKey[] = [];

  while (path && path.length > 0) {
    const m = path.match(PathItemExpression);

    if (!m) {
      throw new Error(`Invalid path syntax at '${path}'`);

    } else if (m?.groups?.ident) {
      // console.log('ident:', m.groups.ident);
      keys.push(m.groups.ident);
    } else if (m?.groups?.index) {
      // console.log('index:', m.groups.index);
      keys.push(Number(m.groups.index));
    } else if (m?.groups?.prop) {
      // console.log('prop:', m.groups.prop);
      keys.push(m.groups.prop);
    }
    path = path.substring(m[0].length);
  }
  // console.log(' =', keys);
  return keys;
}

/**
 * Locate a node by path in the passed object and create a new empty one when not yet present.
 * This function is case-sensitive.
 * @param {object} obj - The object to search within.
 * @param {string} path - The path to the node (e.g., "a/b/c"), may start with '/'.
 * @param {boolean} create - Whether to create the structure if it doesn't exist.
 * @returns {object} - The located or newly created node.
 */
export function findNode(obj: any, path: PathSpecifier, create = false): PathCursor {
  // console.log("json", "findNode()");
  let keys: PathKey[];

  // create cursor to _store object only
  const cursor: PathCursor = {
    pathKeys: [''],
    pathNodes: [obj]
  };

  if (!path) {
    return cursor;

  } else if (typeof path === 'string') {
    path = path.replace(/\//g, '.'); // accept '/' for path separator too.
    keys = pathKeys(path);

  } else {
    keys = path as PathKey[]; // If path is already an array, use it directly.
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
}


export function walk(store: any, path: PathSpecifier, cbFunc: JsonParseCallback) {

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
  _walk(findNode(store, path, true));
} // walk()


/**
 * Merges obj into storage object recursively while detecting changes or additions.
 * This function modifies obj1 in place and calls the callback function with details where changes or additions occurred.
 * It handles nested objects and arrays, and it can clear values in obj1 if they are not present in obj2.
 * 
 * @param cursor - The cursor trail into the storage object.
 * @param obj - The source object whose properties will be merged into storage object.
 * @param cb - Callback function that gets called when changes are detected
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
export function mergeObject(cursor: PathCursor, obj: any, cb: (path: string, value?: any) => void): boolean {
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
          if (mergeObject(cursor, newValue, cb)) changedThis = true;

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
          if (mergeObject(cursor, newValue, cb)) changedThis = true;
        }

        // If the current node/value has changed, call the callback function.
        if (changedThis) {
          // Create the path string from the cursor keys
          cb(cursor.pathKeys.join('.').substring(1), cursor.pathNodes[len]);
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
