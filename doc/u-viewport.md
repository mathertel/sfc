# Custom Web Component for Swapping Inner Content

I like to implement a viewport element using a Custom Web Components (customElements)
in the file `u-viewport.sfc` according the documentation in this repository.

The viewport element is a fixed-size container (or "window") that displays content,
where the displayed content can be programmatically swapped or updated. Developers
familiar with graphics programming, CSS (e.g., viewport units), or UI libraries (e.g.,
Vaadin's Viewport component) expect a "viewport" to handle dynamic content changes
within a constrained area, including support for effects, templates, and asynchronous
loading.

The viewport element

* will have a fixed size (height and width)
* can display different content inside, one defined content at a time.
* swapping the content is supported my methods

The content must fit into the viewport element size and may be implemented as

* a HTML element (maybe with more inner components) with the same size
* a Custom Web Component with the same size
* an image
* all content elements are inner elements of the container
* all content elements that are not inside the container can be moved inside

The content can swapped by calling an instance method

* passing a reference to a HTML element with the same size
* passing a reference to an image
* passing a reference to an external HTML element that can be moved into the container
* a Promise function that results in a delayed loaded element from a URL.
* passing a template element that get instantiated as an inner element

The content can also be specified as inner elements using <template> elements, so I can
write the actual HTML for each page in the document, and the component will pick them up
and display them one at a time.

The references will be saved in a list inside the element to support the following
methods:

* show the n-th element
* show the element with a specific name or by passing a css selector to existing nested
  elements

The viewport element can be used as a base implementation for

* caroulses
* interactive slide shows
* multi-step applications.

There will be different visual effects on how a new component is shown.

It avoids the self-scrolling connotation of "carousel" while encompassing the broader
functionality you described for interactive slide shows, multi-step forms, and general
content swapping. In your project's naming convention, this would be `u-viewport`.

> Create a documentation file  /doc/u-viewport.md for this kind component.


---

I want to implement a Custom Web Components (customElements) based on the u-viewport 
element to implement a carousel in the file `u-carousel.sfc`.

The pages can be switched by using buttons in an overlay to the for

* switching to the next page. When already on the last page the first page should be shown.
* switching to the previous page. When already on the first page the last page should be shown.


* page by index
* page by id


All pages will have to fit into the size given by the <page-viewer> element.

There are 2 buttons layering upon the pages to navigate forward and back.  

Each page content to come directly from <template> elements in the HTML, so I can write
the actual HTML for each page in the document, and the <page-viewer> Web Component will
pick them up and display them one at a time.

