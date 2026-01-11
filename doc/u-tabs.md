# Web component implementing the tabs pattern

The `<u-tabs>` custom element is a [Single File Control (sfc)] implementation for switchable panels with content using
buttons in a tab list above the panels.

<!-- ![u-tabs component](/doc/images/u-tabs.png) -->

When implementing the [tab pattern] you can find many different implementations using various html elements like lists with
links or nav elements with buttons.

This implementation creates HTML code of the [tab pattern] from the [ARIA Authoring Practices Guide (APG)] as output by adding
the required attributes on a simplified input. All required coding is implemented using a [Single File Control (sfc)].

In addition the tabs control implements the additional JavaScript for the control that enable navigating between the panels
using the keyboard left and right arrows.


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-tabs');
</script>
```

The `<u-tabs>` tag can be placed at the destination and the size can be applied in the style attribute:


## Style Attributes

The standard `<u-tabs>` component can be styled according the standard CSS styling attributes.  The following style
rules will be appled at the page level and can be overwritten using local style rules:

```CSS
  u-tabs {
    >div[role='tablist'] {
      button {
        /* change the default button */
      }

      button[aria-selected=true] {
        /* change the active button */
      }
    }

    >div[role='tabpanel'] {
      /* change the panels */
      /* e.g. height: 8em; */
    }
  }
```


<!-- ## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended `<u-tabs>` element: -->

## Generating valid ARIA compatible HTML from simplified input

The [tab pattern] is a well defined UI pattern with detailled implementation instructions in the
regarding the [ARIA Authoring Practices Guide (APG)]. This custom element implements according to this pattern and
enables simplified HTML that is enriched by custom element implementation.

The implementation according to the ARIA specifications is required to support users with disabilities and can be used
as a reliable basis for implementing CSS code and attaching event handlers.

The following ARIA roles are used for implementing the tab pattern:

* The `tablist` role is used to mark the container for all tab buttons.
* The `tab` role is used to mark all interactive elements, here buttons inside the tablist. When activated its associated
  panel is activated.
* The `tabpanel` role is used to mark all panels.

Good explainaitions can be found in
<https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tab_role> and
<https://www.w3.org/WAI/content-assets/wai-aria-practices/patterns/tabs/examples/js/tabs-automatic.js>

The `<u-tabs>` control analyses the contained html elements and applies the following additional changes when required:

* The `<u-tabs>` control remains parent of the implementation and is styled according the CSS rules in the SFC definition.
* All `<button>`s that are direct children of the `<u-tabs>` control will be enriched to be valid tab-buttons in the `tablist` including the required aria attributes.
* All `<div>`s that are direct children of the `<u-tabs>` control will be enriched to be valid tab-panels including the required aria attributes.
* The order of the tab buttons and the tab panels is used to link them using the aria attributes.
<!-- * As an alternative to a tab buttons a `title` can be specified on the tab-panels to create a corresponding tab-button. -->
<!-- * Any additional tab-buttons without a corresponding tab panel will be removed. -->
* The click and touch events on the tab buttons will exclusively activate the corresponding panel and adjust the aria attributes.
* The keyboard events for arrow left and right are captured when the focus is on any tab button to show the next / previous tab.

The following example illustrates the convertion of the source code into the enriched html.

### Source code

``` html
<u-tabs>
  <button>One</button>
  <button>Two</button>
  <button>Three</button>

  <div>
    <p>First Panel content</p>
  </div>
  <div>
    <p>Second Panel content</p>
  </div>
  <div>
    <p>Third Panel content</p>
  </div>
</u-tabs>
```

### Generated HTML Elements with attributes

``` html
<u-tabs>
  <div role="tablist">
    <button id="tab-1" role="tab" aria-controls="tabpanel-1" aria-selected="true" >One</button>
    <button id="tab-2" role="tab" aria-controls="tabpanel-2" >Two</button>
    <button id="tab-3" role="tab" aria-controls="tabpanel-3">Three</button>
  </div>

  <div id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1" tabindex="0">
    <p>First Panel content</p>
  </div>
  <div id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2" tabindex="-1">
    <p>Second Panel content</p>
  </div>
  <div id="tabpanel-3" role="tabpanel" aria-labelledby="tab-3" tabindex="-1">
    <p>Third Panel content</p>
  </div>
</u-tabs>
```

## Styling

``` css
u-tabs {
  > button[role="tab"] {}
  > [role="tabpanel"] {}
}
```

---

## Generating missing IDs for HTML elements

In several situations it is required to add unique IDs to html elements to enable functionality that where not added by
the author.  This often allows simplified HTML at authoring time with some control specific assumptions.

As an example a `<label>` element immediately before a `<input>` element will only allow to set the focus by clicking
the label when there is a `for` attribute on the `<label>` that refers to the `id` of the `<input>` element.

However for human authors is is a time saver to not implement this in the source code and allow copying the code to other
locations without duplicating the ids.

Some of the [Single File Control (sfc)] implementations add IDs automatically when not present.

This requires a common functionality to create new unique IDs by javascript.


## Implementation

The implementation for this functionality is included in the [SFC loader]

``` typeScript
interface Window {
  loadComponent: (tags: string | string[], folder?: string) => Promise<void[]>;
  sfc : {
    loadComponent: (tags: string | string[], folder?: string) => Promise<void[]>;
    genID: (type?: string) => string;
    _ids : { [type: string]: string } = {};
  }
}

Window.sfc.getID = function (type : string = 'id') {
  ids = window.sfc._ids;
  let newID: string = type + '-';

  if (! ids[type]) {
    ids[type] = 0;
  }
  ids[type]++;
  return(type + '-' + (ids[type]++));
} // sfc.getID()
```


## See Also

* [tab pattern]
* [ARIA Authoring Practices Guide (APG)]
* <https://reach.tech/tabs>

[tab pattern]: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
[ARIA Authoring Practices Guide (APG)]: https://www.w3.org/WAI/ARIA/apg/
[Single File Control (sfc)]: https://www.github.com/mathertel/sfc
