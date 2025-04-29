## Lifecycle of Web Components

In general the SFC loader doesn't change any of the Lifecycle of Web Components as defined in the standard but adds some useful
features in the UComponent class.

<https://developer.mozilla.org/en-US/docs/Web/API/Web_components>

![Flow Diagram of the Lifecycle of Web Components](lifecycle.drawio.svg)

* **constructor()** -- This method is called when a component instance is created.  The constructor should be used to
  set up initial state and default values.  In general the further setup should be deferred to the first
  connectedCallback call.  
  At this stage the inner components may not be ready yet.  The SFC loader is using this to populate the template so
  eventually nested components can start their lifecycle as well.  Also all event handlers on the custom element are
  attached.

* **attributeChangedCallback** -- For all static defined attributes that are mentioned in the static
  `observedAttributes` array of attribute names the defined values are passed.  At this stage it the element is not yet
  part of the DOM and also the inner components may not be ready yet.  In general is is a good practice to collect the
  attributes in private class members for later use.

* **connectedCallback()** -- This method is called after the component was inserted into the DOM.  At this stage it the
  inner elements are existing but may not be initialized yet.
  
  Modifying the inner elements should be done when `connectedCallback()`is called the first time.
  Using the **SFC loader** the autonomous custom elements should derive from the UComponent class that tracks the calls to
  connectedCallback. The property `sfcConnected` us set to true after the connected Callback was called the first time.
  
  This method is also called when the component is moved inside the page DOM. The `sfcConnected` property can be used to avoid re-initializing in this case and preserve the current state.

* **init()** -- Some components may need access to other elements of the page either nested elements or indepenant
  loaded components.  Therefore this non-standard method is called be the **SFC loader** when the page loading has
  completed and other components are also ready.

* **attributeChangedCallback** -- While the component is active and part of the document the attributeChangedCallback
  will receive updates for all static defined attributes in `observedAttributes`.

See Also

* <https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements#custom_element_lifecycle_callbacks>
* <https://html.spec.whatwg.org/multipage/custom-elements.html>
* [Requirements for custom element constructors and reactions](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-element-conformance)
* Similarities to SalesForce Lightning Web Components: <https://www.lwc.dev/guide/lifecycle>

