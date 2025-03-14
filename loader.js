// loader.js
// 
// This is a loader implementation to load Single File Components (SFC) from a web server
// and use the as regular web components.
// Copyright

// The UComponent class acts as a intermediate class between user defined SFC and the generic HTMLElement class.
// It implements the generation of the shadow dom and css according to the style and template.
class UComponent extends HTMLElement {

  constructor() {
    super();

    // create inner / document Style
    const c = this.constructor;
    const shadow = this.attachShadow({ mode: 'open' });

    if (c.uStyle) {
      if (c.uStyle.hasAttribute('scoped')) {
        shadow.appendChild(c.uStyle.cloneNode(true));
      } else {
        document.head.appendChild(c.uStyle.cloneNode(true));
      }
    }

    // create shadow DOM
    if (c.uTemplate) {
      shadow.appendChild(document.importNode(c.uTemplate.content, true));
    }
  } // constructor()

  // Web Component is initiated and connected to a page.
  // * load template and css
  // * further initialization by using the init() callback
  connectedCallback() {
    // this.debug('connectedCallback()');
    this.super = Object.getPrototypeOf(this);
    const def = this.constructor;

    // add event listeners
    Object.getOwnPropertyNames(def.prototype).forEach(key => {
      const fn = def.prototype[key];

      if (key === 'onTouchstart') {
        this.addEventListener('touchstart', fn.bind(this), { passive: true });

      } else if (key.startsWith('on')) {
        this.addEventListener(key.substring(2).toLowerCase(), fn.bind(this), false);
      }
    });

    // add attribute data
    Object.entries(def).forEach(([key, value]) => {
      if (value == null || value.constructor !== Function) {
        // set a default-value
        if (!this[key]) {
          this[key] = value;
        }

      } else {
        // attach method
        this[key] = value;
      }
    });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', this.init.bind(this));
    } else {
      window.requestAnimationFrame(this.init.bind(this));
    }
  }

  adoptedCallback() {
    // this.info("adoptedCallback");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    // this.debug("attributeChanged", name, oldValue, newValue);
  }

  // logging functions
  info() {
    console.info(`U::${this.tagName}`, ...arguments);
  };

  debug() {
    console.debug(`U::${this.tagName}.${this.id}`, ...arguments);
  };

  // The init function is called by UComponent when the whole DOM of the SFC is available. 
  init() {
    // debugger;
  };
} // class UComponent


// loadComponent is a function to load a SFC from a web server and define it as a web component.
// The function is called with a list of tags and an optional folder.
// The function returns a promise that is resolved when all SFCs are loaded.
window.loadComponent = (function() {
  // plain script includes can read document.currentScript.src
  // modules can use meta
  const loaderURL = new URL(document.currentScript.src);

  console.debug('SFC', `loadComponent...`);

  async function define(tagName, dom, url) {
    let def;
    const scriptObj = dom.querySelector('script');
    if (scriptObj && scriptObj.textContent) {
      const jsFile = new Blob([scriptObj.textContent], { type: 'application/javascript' });
      const module = await import(URL.createObjectURL(jsFile));
      def = module.default;
    } else {
      console.error('SFC', `No class defined in ${url}`);
      def = UComponent;
    }

    // make template and style available to object constructor()
    def.uTemplate = dom.querySelector('template');
    def.uStyle = dom.querySelector('style');
    def.extends = scriptObj.getAttribute('extends');
    def.baseURL = url;

    if (def.extends) {
      customElements.define(tagName, def, { extends: def.extends });
      if (def.uStyle) document.head.appendChild(def.uStyle.cloneNode(true));
      console.debug('SFC', `${def.for}.${tagName} defined.`);

    } else {
      customElements.define(tagName, def);
      console.debug('SFC', `${tagName} defined.`);
    }
  }

  // fetchSFC loads a SFC file from a web server and triggers defining the contained web components.
  async function fetchSFC(fileName, folder = undefined) {
    let sfcURL = fileName + '.sfc';
    let baseUrl = loaderURL;

    if (folder) {
      baseUrl = new URL(folder, document.location.href);
    }

    sfcURL = new URL(sfcURL, baseUrl);
    console.debug('SFC', `loading module ${fileName} from ${sfcURL.href}...`);

    // get DOM from sfc-file
    const dom = await fetch(sfcURL)
      .then(response => response.text())
      .then(html => (new DOMParser()).parseFromString(html, 'text/html'));

    const a = dom.querySelectorAll('sfc');

    if (a.length === 0) {
      await define(fileName, dom, baseUrl);
    } else {
      for (const c of a) {
        await define(c.getAttribute('tag'), c, baseUrl);
      }

    }
  }; // fetchSFC()


  function loadComponent(tags, folder) {
    if (typeof tags === 'string') tags = tags.split(',');
    return (Promise.all(tags.map((tag) => fetchSFC(tag, folder))));
  }

  return loadComponent;
}());