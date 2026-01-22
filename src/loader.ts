// loader.js
// 
// This is a loader implementation to load Single File Components (SFC) from a web server
// and use the as regular web components.
// Copyright

// declare global {
interface Window {
  // simplified declaration of loadComponent function , better use Window.sfc.loadComponent
  loadComponent: (tags: string | string[], folder?: string) => Promise<void[]>;

  sfc: {
    loadComponent: (tags: string | string[], folder?: string) => Promise<void[]>;
    genID: (type?: string) => string;
    _ids: { [type: string]: number };
  }
}

// The UComponent class acts as a intermediate class between user defined SFC and the generic HTMLElement class.
// It implements the generation of the shadow dom and css according to the style and template.
class UComponent extends HTMLElement {
  // observedAttributes is a list of attributes that are observed for changes.
  static observedAttributes: string[] = [];

  // The full qualified URL folder and file of the loaded component.
  // class.url = '';

  [key: string]: any;

  // uRoot is the root node of the component. It is either the shadow root or the light DOM. 
  uRoot = this as HTMLElement | ShadowRoot;

  /// true if the SFC is loaded.
  sfcConnected = false;

  /// uTemplate is the HTML template element defined in the SFC.
  uTemplate?: HTMLTemplateElement = (this.constructor as any as UComponent).uTemplate as HTMLTemplateElement;

  /// uStyle is the HTML style element defined in the SFC.
  uStyle?: HTMLStyleElement = (this.constructor as any as UComponent).uStyle as HTMLStyleElement;

  // #uStyleDone is true if the global style has been added to the document.
  #uStyleDone = false;

  // extends is the name of the HTML element to extend.
  extends?: string;

  // #oldTextContent stores the textContent inside the custom control before adding the template. 
  #oldTextContent = '';

  // _scriptsUnloaded counts the number of scripts to be loaded.
  _scriptsUnloaded = 0;

  // importScript() loads a external script required by the component into the shadow DOM and tracks loading.
  // this function must be called in the constructor of the component.
  // init() is deferred and called when all the scripts are loaded.
  importScript(src: string) {
    const base = new URL((this.constructor as any).url);
    const url = new URL(src, base);

    const scr = document.createElement('script');
    scr.addEventListener("load", (evt) => {
      console.log(this.tagName, `script ${src} loaded.`);
      this._scriptsUnloaded--;
      if (this._scriptsUnloaded == 0) this.init();
    });
    this._scriptsUnloaded++;
    scr.src = url.href;
    this.shadowRoot?.appendChild(scr);
    console.log(this.tagName, `loading script ${src} from ${url.href}...`);
  }

  /** @return the textContent inside the custom control before adding the template. */
  getOldTextContent() {
    return this.#oldTextContent;
  }

  constructor() {
    super();
    console.debug('UC', `constructor(${this.tagName})`);

    // create setters and getters for all observedAttributes defined in the class.
    for (const p of ((this.constructor as typeof UComponent).observedAttributes)) {
      Object.defineProperty(this, p, {
        set(value) { this.setAttribute(p, value); },
        get() { return this.getAttribute(p); }
      });
    }

    // What kind of dom should be used ?
    const definedTemplate = this.uTemplate;
    if (definedTemplate) {
      let domMode = 'open';
      if (definedTemplate.hasAttribute('light')) domMode = 'light';
      if (definedTemplate.hasAttribute('closed')) domMode = 'closed';

      if (domMode === 'light') {
        debugger;
        this.#oldTextContent = this.textContent.trim();
        this.textContent = '';

        this.appendChild(document.importNode(definedTemplate.content, true));


      } else {
        this.uRoot = this.attachShadow({ mode: domMode as ShadowRootMode });
        // import template into shadow DOM.
        this.uRoot.appendChild(document.importNode(definedTemplate.content, true));
      }
    } // has template

    const definedStyle = this.uStyle;
    if (definedStyle) {
      // put style into shadow DOM
      const clonedStyle = definedStyle.cloneNode(true) as HTMLStyleElement;
      if (definedStyle.hasAttribute('scoped')) {
        this.uRoot.insertBefore(clonedStyle, this.uRoot.firstChild);

      } else if (!this.#uStyleDone) {
        // put style to page with low priority to allow overwriting.
        document.head.insertAdjacentElement("afterbegin", clonedStyle);
        this.#uStyleDone = true;
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

      // add event listeners
      Object.getOwnPropertyNames(this.constructor.prototype)
        .filter(key => key.startsWith('on'))
        .forEach(key => {
          console.debug('UC', `addEvent(${key})`);

          if (key.toLowerCase() !== key) {
            console.error('UC', `Event name ${key} is not lower case.`);
          }
          // call handleEvent() when the event is triggered.
          this.addEventListener(key.substring(2).toLowerCase(), this);
        });

      if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', this.init.bind(this));
      } else {
        // init() the component before next redraw
        window.requestAnimationFrame(this.init.bind(this));
      }
    }
  }

  // disconnectedCallback() {
  //   console.debug('UC', `disconnectedCallback(${this.tagName})`);
  // }

  // adoptedCallback() {
  //   console.debug('UC', 'adoptedCallback');
  // }

  // attributeChangedCallback(name: string, oldValue: string | undefined, newValue: string | undefined) {
  //   console.debug('UC', 'attributeChanged', name, oldValue, newValue);
  // }

  // The init function is called by UComponent when the whole DOM of the SFC is available. 
  init() {
    console.debug('UC', 'init()');
  };

  // dispatch registered events.
  handleEvent(event: Event) {
    this['on' + event.type](event);
  }

} // class UComponent


// for ESM modules: const _SFCloaderURL = import.meta.url;
const _SFCloaderURL = (document.currentScript as HTMLScriptElement).src;


// loadComponent is a function to load a SFC from a web server and define it as a web component.
// The function is called with a list of tags and an optional folder.
// The function returns a promise that is resolved when all SFCs are loaded.
//  function loadComponent(): (tags: string | string[], folder?: string) => Promise<void[]> {

function loadComponent(tags: string | string[], folder: string | undefined = undefined): Promise<void[]> {

  // load a SFC file from a web server and triggers defining the contained web components.
  async function fetchSFC(fileName: string, folder: string | undefined = undefined) {
    let baseUrl;

    if (folder) {
      // resolve folder relative to the document location.
      baseUrl = new URL(folder, document.location.href);
    } else {
      // resolve folder relative to the sfc loader location whe no folder is specified.
      baseUrl = new URL(_SFCloaderURL);
    }

    const sfcURL = new URL(fileName + '.sfc', baseUrl);
    console.debug('SFC', `loading module ${fileName} from ${sfcURL.href}...`);

    // get DOM from sfc-file
    const dom = await fetch(sfcURL)
      .then(response => response.text())
      .then(html => (new DOMParser()).parseFromString(html, 'text/html'));

    const a = dom.querySelectorAll('sfc');

    if (a.length === 0) {
      await define(fileName, dom, sfcURL);

    } else {
      for (const c of a) {
        await define(c.getAttribute('tag') as string, c, sfcURL);
      }

    }
  }; // fetchSFC()

  // define the web component from a DOM object.
  async function define(tagName: string, dom: Document | Element, url: URL) {
    let def;
    const scriptObj = dom.querySelector('script');

    if (scriptObj && scriptObj.textContent) {
      const jsFile = new Blob([scriptObj.textContent], { type: 'application/javascript' });
      const module = await import(URL.createObjectURL(jsFile));
      def = module.default; // default export of the JS module
      def.extends = scriptObj.getAttribute('extends');
      def.url = url.href; // reachable via this.constructor.url

    } else {
      console.error('SFC', `No SFC defined in ${url.href}`);
      def = UComponent;
    }

    // make template and style available to object constructor()
    def.uTemplate = dom.querySelector<HTMLTemplateElement>('template');
    def.uStyle = dom.querySelector<HTMLStyleElement>('style');

    if (def.extends) {
      customElements.define(tagName, def, { extends: def.extends });
      if (def.uStyle) document.head.appendChild(def.uStyle.cloneNode(true));
      console.debug('SFC', `${def.extends}.${tagName} defined.`);

    } else {
      customElements.define(tagName, def);
      console.debug('SFC', `${tagName} defined.`);
    }
  }

  if (typeof tags === 'string') tags = tags.split(',');
  return (Promise.all(tags.map((tag) => fetchSFC(tag, folder))));
} // loadComponent()


// _genID generates a unique ID for a given element using a readable type.
function _genID(type: string = 'id') {
  const ids = window.sfc._ids;

  if (!ids[type]) {
    ids[type] = 0;
  }
  ids[type]++;
  return (type + '-' + (ids[type]++));
} // sfc.genID()


window.loadComponent = loadComponent;
window.sfc = {
  loadComponent: loadComponent,
  genID: _genID,
  _ids: {}
};

// Greetings.
console.debug('SFC', 'loadComponent...');

