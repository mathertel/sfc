class c extends HTMLElement{uRoot=this;sfcConnected=!1;constructor(){super();const e=this.constructor;let t=e.uTemplate?"open":"light";e.uTemplate?.hasAttribute("light")&&(t="light"),e.uTemplate?.hasAttribute("closed")&&(t="closed"),t==="light"?(this.uRoot=this,e.uTemplate&&this.uRoot.appendChild(document.importNode(e.uTemplate.content,!0))):(this.uRoot=this.attachShadow({mode:t}),e.uTemplate&&this.uRoot.appendChild(document.importNode(e.uTemplate.content,!0))),e.uStyle&&(e.uStyle.hasAttribute("scoped")?this.uRoot.insertBefore(e.uStyle.cloneNode(!0),this.uRoot.firstChild):e.uStyleDone||(document.head.appendChild(e.uStyle.cloneNode(!0)),e.uStyleDone=!0))}connectedCallback(){if(!this.sfcConnected){this.sfcConnected=!0;const e=this.constructor.prototype;Object.getOwnPropertyNames(e).filter(t=>t.startsWith("on")).forEach(t=>{const n=t.substring(2).toLowerCase();t.toLowerCase(),this.addEventListener(n,this)}),document.readyState==="loading"?window.addEventListener("DOMContentLoaded",this.init.bind(this)):window.requestAnimationFrame(this.init.bind(this))}}disconnectedCallback(){}adoptedCallback(){}attributeChangedCallback(e,t,n){}init(){}handleEvent(e){this["on"+e.type](e)}}async function a(o,e,t){let n;const s=e.querySelector("script");if(s&&s.textContent){const i=new Blob([s.textContent],{type:"application/javascript"});n=(await import(URL.createObjectURL(i))).default,n.extends=s.getAttribute("extends")}else n=c;n.uTemplate=e.querySelector("template"),n.uStyle=e.querySelector("style"),n.baseURL=t,n.uTemplate?.content.querySelectorAll("script").forEach(i=>{i.src=new URL(i.src,t).href}),n.extends?(customElements.define(o,n,{extends:n.extends}),n.uStyle&&document.head.appendChild(n.uStyle.cloneNode(!0))):customElements.define(o,n)}const d=document.currentScript.src;async function r(o,e=void 0){let t;e?t=new URL(e,document.location.href):t=new URL(d);const n=new URL(o+".sfc",t),s=await fetch(n).then(l=>l.text()).then(l=>new DOMParser().parseFromString(l,"text/html")),i=s.querySelectorAll("sfc");if(i.length===0)await a(o,s,t);else for(const l of i)await a(l.getAttribute("tag"),l,t)}window.loadComponent=u;function u(o,e=void 0){return typeof o=="string"&&(o=o.split(",")),Promise.all(o.map(t=>r(t,e)))}
