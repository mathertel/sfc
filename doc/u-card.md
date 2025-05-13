# Web Component for Card Layouts

The `<u-card>` component simplifies card layout creation from minimal HTML by automatically arranging elements to fit
predefined CSS rules.

This component demonstrates how to render content directly into the page's DOM using attributes and inner HTML, enabling
simple markup to be transformed into more complex structures.  This approach reduces the need to rearrange HTML code
when changing the style of a website.

While server-side or pre-rendered components are often preferred for static output, this component is useful when
dynamic changes are required at runtime.

Creating complex HTML structures for layout and design is a common problem typically solved with server-side templates.
This component demonstrates how to achieve this on the client-side.

In scenarios where size is a concern, client-side HTML creation can be beneficial due to template reuse, potentially
reducing download size.

This approach simplifies HTML coding for rendering cards.


![card example](/doc/images/u-card.png){ style="width:400px"}


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-card');
</script>
```


## Example

```html
<u-card icon="button" title="Cardboards">
  <span>MORE about Boards.</span>
  <div class='form-grid'>
    <label>Height:</label><input name='h' value="30px">
    <label>Width:</label><input name='w' value="60px">
  </div>
  <button>Cancel</button>
  <button>OK</button>
</u-card>
```


## Attributes

* **`icon`** -- This attribute specifies what an icon should be used in the title.  This creates a svg based icon by
  referring to the symbol in the `icons.svg` file.

* **`title`** --  This attribute specifies the text of the title.


## Template processing

This component annotates `<template light>` with the `light` attribute resulting in adding the template code to the inner HTML
of the main document known as light dom instead of the shadow dom.

When the component is then initialized all the inner parts of the `<c-card>` is moved into the slots:

* The title attribute is used as textContent of the .header>h3
* The icon attribute is used to create a image as first element in the .header
* All buttons are moved to the **.footer>slot**
* All remaining elements are move to the .main>slot
* empty slots are removed.

---


## See also

* <https://www.w3schools.com/howto/howto_css_cards.asp>
* <https://getbootstrap.com/docs/4.0/components/card/>
