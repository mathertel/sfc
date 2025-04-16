// loader.js
// 
// This is a loader implementation to load Single File Components (SFC) from a web server
// and use the as regular web components.
// Copyright

declare global {
  interface Window {
    loadComponent: (tags: string | string[], folder?: string) => Promise<void[]>;
  }
}

type UConstructor = {
  uStyle: HTMLElement,
  uStyleDone: boolean,
  uTemplate: HTMLTemplateElement,
  uRoot: HTMLElement,
  extends: string,
  baseURL: URL
};

// The UComponent class acts as a intermediate class between user defined SFC and the generic HTMLElement class.
// It implements the generation of the shadow dom and css according to the style and template.
class UComponent extends HTMLElement {
  [key: string]: any;

  // uRoot is the root node of the component. It is either the shadow root or the light DOM. 
  uRoot = this as HTMLElement | ShadowRoot;
  sfcConnected = false; // true if the SFC is loaded.

  constructor() {
    super();
    console.debug('UC', `constructor(${this.tagName})`);

    // create inner / document Style
    const c = this.constructor as unknown as UConstructor;

    // What kind of dom should be used ?
    let domMode = (c.uTemplate ? 'open' : 'light');
    if (c.uTemplate?.hasAttribute('light')) domMode = 'light';
    if (c.uTemplate?.hasAttribute('closed')) domMode = 'closed';
    // if (c.uStyle?.hasAttribute('scoped')) domMode = 'open';

    if (domMode === 'light') {
      this.uRoot = this;

      if (c.uTemplate) {
        this.uRoot.appendChild(document.importNode(c.uTemplate.content, true));
      }

    } else {
      this.uRoot = this.attachShadow({ mode: domMode as ShadowRootMode });
      // when <template> is present import it into shadow DOM.
      if (c.uTemplate) {
        this.uRoot.appendChild(document.importNode(c.uTemplate.content, true));
      }
    }

    if (c.uStyle) {
      if (c.uStyle.hasAttribute('scoped')) {
        this.uRoot.insertBefore(c.uStyle.cloneNode(true), this.uRoot.firstChild);
      } else if (!c.uStyleDone) {
        document.head.appendChild(c.uStyle.cloneNode(true));
        c.uStyleDone = true;
      }
    }
  } // constructor()

  // Web Component is initiated and connected to a page.
  // * load template and css
  // * further initialization by using the init() callback
  connectedCallback() {
    console.debug('UC', `connectedCallback(${this.tagName}, this.sfcConnected=${this.sfcConnected})`);

    if (!this.sfcConnected) {
      this.sfcConnected = true;
      const proto = this.constructor.prototype;

      // add event listeners
      Object.getOwnPropertyNames(proto)
        .filter(key => key.startsWith('on'))
        .forEach(key => {
          const eventName = key.substring(2).toLowerCase();
          console.debug('UC', `addEvent(${key})`);

          if (key.toLowerCase() !== key) {
            console.error('UC', `Event name ${key} is not lower case.`);
          }
          this.addEventListener(eventName, this);
        });

      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', this.init.bind(this));
      } else {
        window.requestAnimationFrame(this.init.bind(this));
      }
    }
  }

  disconnectedCallback() {
    console.debug('UC', `disconnectedCallback(${this.tagName})`);
  }

  adoptedCallback() {
    console.debug('UC', 'adoptedCallback');
  }

  attributeChangedCallback(name: string, oldValue: string | undefined, newValue: string | undefined) {
    console.debug('UC', 'attributeChanged', name, oldValue, newValue);
  }

  // The init function is called by UComponent when the whole DOM of the SFC is available. 
  init() {
    console.debug('UC', 'init()');
  };

  // dispatch registered events.
  handleEvent(event: Event) {
    this['on' + event.type](event);
  }

} // class UComponent


async function define(tagName: string, dom: Document | Element, url: URL) {
  let def;
  const scriptObj = dom.querySelector('script');

  if (scriptObj && scriptObj.textContent) {
    const jsFile = new Blob([scriptObj.textContent], { type: 'application/javascript' });
    const module = await import(URL.createObjectURL(jsFile));
    def = module.default;
    def.extends = scriptObj.getAttribute('extends');

  } else {
    console.error('SFC', `No class defined in ${url}`);
    def = UComponent;
  }

  // make template and style available to object constructor()
  (<UConstructor>def).uTemplate = dom.querySelector('template') as HTMLTemplateElement;
  (<UConstructor>def).uStyle = dom.querySelector('style') as HTMLStyleElement;
  (<UConstructor>def).baseURL = url;

  // relative links in sfc are resolved as relative to the sfc file. 
  def.uTemplate?.content.querySelectorAll('script').forEach((obj: HTMLScriptElement) => {
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

// for ESM modules: const loaderURL = import.meta.url;
const loaderURL = (document.currentScript as HTMLScriptElement).src;

// fetchSFC loads a SFC file from a web server and triggers defining the contained web components.
async function fetchSFC(fileName: string, folder: string | undefined = undefined) {
  let baseUrl;

  if (folder) {
    baseUrl = new URL(folder, document.location.href);
  } else {
    baseUrl = new URL(loaderURL);
  }

  const sfcURL = new URL(fileName + '.sfc', baseUrl);
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
      await define(c.getAttribute('tag') as string, c, baseUrl);
    }

  }
}; // fetchSFC()

// loadComponent is a function to load a SFC from a web server and define it as a web component.
// The function is called with a list of tags and an optional folder.
// The function returns a promise that is resolved when all SFCs are loaded.
//  function loadComponent(): (tags: string | string[], folder?: string) => Promise<void[]> {

window.loadComponent = loadComponent;

function loadComponent(tags: string | string[], folder: string | undefined = undefined): Promise<void[]> {
  if (typeof tags === 'string') tags = tags.split(',');
  return (Promise.all(tags.map((tag) => fetchSFC(tag, folder))));
}

// Greetings.
console.debug('SFC', 'loadComponent...');

