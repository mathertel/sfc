"use strict";
class UComponent extends HTMLElement {
  static observedAttributes = [];
  // uRoot is the root node of the component. It is either the shadow root or the light DOM. 
  uRoot = this;
  sfcConnected = false;
  // true if the SFC is loaded.
  uTemplate = this.constructor.uTemplate;
  uStyle = this.constructor.uStyle;
  #uStyleDone = false;
  extends;
  constructor() {
    super();
    console.debug("UC", `constructor(${this.tagName})`);
    for (const p of this.constructor.observedAttributes) {
      Object.defineProperty(this, p, {
        set(value) {
          this.setAttribute(p, value);
        },
        get() {
          return this.getAttribute(p);
        }
      });
    }
    const definedTemplate = this.uTemplate;
    if (definedTemplate) {
      let domMode = "open";
      if (definedTemplate.hasAttribute("light")) domMode = "light";
      if (definedTemplate.hasAttribute("closed")) domMode = "closed";
      if (domMode === "light") {
        this.appendChild(document.importNode(definedTemplate.content, true));
      } else {
        this.uRoot = this.attachShadow({ mode: domMode });
        this.uRoot.appendChild(document.importNode(definedTemplate.content, true));
      }
    }
    const definedStyle = this.uStyle;
    if (definedStyle) {
      const clonedStyle = definedStyle.cloneNode(true);
      if (definedStyle.hasAttribute("scoped")) {
        this.uRoot.insertBefore(clonedStyle, this.uRoot.firstChild);
      } else if (!this.#uStyleDone) {
        document.head.appendChild(clonedStyle);
        this.#uStyleDone = true;
      }
    }
  }
  // constructor()
  // Web Component is initiated and connected to a page.
  // * load template and css
  // * further initialization by using the init() callback
  connectedCallback() {
    console.debug("UC", `connectedCallback(${this.tagName}, this.sfcConnected=${this.sfcConnected})`);
    if (!this.sfcConnected) {
      this.sfcConnected = true;
      Object.getOwnPropertyNames(this.constructor.prototype).filter((key) => key.startsWith("on")).forEach((key) => {
        console.debug("UC", `addEvent(${key})`);
        if (key.toLowerCase() !== key) {
          console.error("UC", `Event name ${key} is not lower case.`);
        }
        this.addEventListener(key.substring(2).toLowerCase(), this);
      });
      if (document.readyState === "loading") {
        window.addEventListener("DOMContentLoaded", this.init.bind(this));
      } else {
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
    console.debug("UC", "init()");
  }
  // dispatch registered events.
  handleEvent(event) {
    this["on" + event.type](event);
  }
}
const loaderURL = document.currentScript.src;
function loadComponent(tags, folder = void 0) {
  async function fetchSFC(fileName, folder2 = void 0) {
    let baseUrl;
    if (folder2) {
      baseUrl = new URL(folder2, document.location.href);
    } else {
      baseUrl = new URL(loaderURL);
    }
    const sfcURL = new URL(fileName + ".sfc", baseUrl);
    console.debug("SFC", `loading module ${fileName} from ${sfcURL.href}...`);
    const dom = await fetch(sfcURL).then((response) => response.text()).then((html) => new DOMParser().parseFromString(html, "text/html"));
    const a = dom.querySelectorAll("sfc");
    if (a.length === 0) {
      await define(fileName, dom, baseUrl);
    } else {
      for (const c of a) {
        await define(c.getAttribute("tag"), c, baseUrl);
      }
    }
  }
  ;
  async function define(tagName, dom, url) {
    let def;
    const scriptObj = dom.querySelector("script");
    if (scriptObj && scriptObj.textContent) {
      const jsFile = new Blob([scriptObj.textContent], { type: "application/javascript" });
      const module = await import(URL.createObjectURL(jsFile));
      def = module.default;
      def.extends = scriptObj.getAttribute("extends");
    } else {
      console.error("SFC", `No class defined in ${url}`);
      def = UComponent;
    }
    def.uTemplate = dom.querySelector("template");
    def.uStyle = dom.querySelector("style");
    def.uTemplate?.content.querySelectorAll("script").forEach((obj) => {
      obj.src = new URL(obj.src, url).href;
    });
    if (def.extends) {
      customElements.define(tagName, def, { extends: def.extends });
      if (def.uStyle) document.head.appendChild(def.uStyle.cloneNode(true));
      console.debug("SFC", `${def.extends}.${tagName} defined.`);
    } else {
      customElements.define(tagName, def);
      console.debug("SFC", `${tagName} defined.`);
    }
  }
  if (typeof tags === "string") tags = tags.split(",");
  return Promise.all(tags.map((tag) => fetchSFC(tag, folder)));
}
function _genID(type = "id") {
  const ids = window.sfc._ids;
  if (!ids[type]) {
    ids[type] = 0;
  }
  ids[type]++;
  return type + "-" + ids[type]++;
}
window.loadComponent = loadComponent;
window.sfc = {
  loaderURL,
  loadComponent,
  genID: _genID,
  _ids: {}
};
console.debug("SFC", "loadComponent...");
//# sourceMappingURL=loader.js.map
