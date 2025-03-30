// loader.js
// 
// This is a loader implementation to load Single File Components (SFC) from a web server
// and use the as regular web components.
// Copyright

// The UComponent class acts as a intermediate class between user defined SFC and the generic HTMLElement class.
// It implements the generation of the shadow dom and css according to the style and template.
class UComponent extends HTMLElement {

  // uRoot is the root node of the component. It is either the shadow root or the light DOM. 
  uRoot = this;

  constructor(n) {
    super();
    console.debug('UC', `constructor(${this.tagName})`);

    // create inner / document Style
    const c = this.constructor;

    if ((c.uTemplate) && (!c.uTemplate.hasAttribute('noshadow'))) {
      // template for non-shadow
      this.uRoot = this.attachShadow({ mode: 'open' });;
    }

    if (c.uStyle) {
      if (c.uStyle.hasAttribute('scoped')) {
        this.uRoot.insertBefore(c.uStyle.cloneNode(true), this.uRoot.firstChild);
      } else {
        document.head.appendChild(c.uStyle.cloneNode(true));
      }
    }

    // create shadow DOM
    if (c.uTemplate) {
      this.uRoot.appendChild(document.importNode(c.uTemplate.content, true));
    }
  } // constructor()

  // Web Component is initiated and connected to a page.
  // * load template and css
  // * further initialization by using the init() callback
  connectedCallback(currentTarget) {
    console.debug('UC', `connectedCallback(${this.tagName})`);
    const proto = this.constructor.prototype;

    // add event listeners
    Object.getOwnPropertyNames(proto)
      .filter(key => key.startsWith('on'))
      .forEach(key => {
        const eventName = key.substring(2).toLowerCase();
        console.debug('UC', `addEvent(${key})`);

        this.addEventListener(eventName, this);
        this['on' + eventName] = proto[key]; // in case of UpperCase characters in event name.
     });

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', this.init.bind(this));
    } else {
      window.requestAnimationFrame(this.init.bind(this));
    }
  }

  adoptedCallback() {
    console.debug('UC', 'adoptedCallback');
  }

  attributeChangedCallback(name, oldValue, newValue) {
    console.debug('UC', 'attributeChanged', name, oldValue, newValue);
  }

  // The init function is called by UComponent when the whole DOM of the SFC is available. 
  init() {
    console.debug('UC', 'init()');
  };

  // dispatch registered events.
  handleEvent(event) {
    this['on' + event.type](event);
  }

} // class UComponent


// loadComponent is a function to load a SFC from a web server and define it as a web component.
// The function is called with a list of tags and an optional folder.
// The function returns a promise that is resolved when all SFCs are loaded.
window.loadComponent = (function() {
  // plain script includes can read document.currentScript.src
  // modules can use meta
  const loaderURL = new URL(document.currentScript.src);

  console.debug('SFC', 'loadComponent...');

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

    // relative links in sfc are resolved as relative to the sfc file. 
    def.uTemplate?.content.querySelectorAll('script').forEach((obj) => {
      obj.src = new URL(obj.src, url).href;
    });

    if (def.extends) {
      customElements.define(tagName, def, { extends: def.extends });
      if (def.uStyle) document.head.appendChild(def.uStyle.cloneNode(true));
      console.debug('SFC', `${def.extends}.${tagName} defined.`);

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