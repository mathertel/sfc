# Web component to include html code from local templates

The <u-include> custom element allows reusing the same html code registered as a template in he current page in multiple places.

<!-- ![u-include component](/doc/images/u-include.png) -->

Re-using components is a typical topic in implementing content driven web sites and web application. But no "one approach fits all".

Implementing a component for just one case isn't very useful, but creating HTML code in a central place and re-using it repeatedly
is very useful and supports better maintainability. This may be very useful especially when significant HTML code should be re-used.

This also is a solution to the software development principles called DRY (Don't Repeat Yourself) minimizing repetitive code.

* In server-side rendered web applications usually multiple copies of the same HTML code being created in various generated
  files and the will be sent to the client multiple times. Some directly support static server side includes like
  `<%- include('header') %>`

* In client-side JavaScript based rendered web applications a often used approach is to compile the HTML code into a JavaScript
  implementation of the component delivered in a bundle file that can create the HTML elements needed.

* Custom Elements of course can be used multiple times on the same page. This requires at least some JavaScript but also gives
  some advantages over pure static includes.

* HTML provides a `<template>` element that allows to create and ship HTML code to the client that is not rendered without
  applying it to the place where needed. The content of the templates can be cloned into several places on the same page.

The `<u-include>` single file component is using a last mentioned `<template>` based approach and a pure declarative HTML
approach where JavaScript or a specific custom element implementation is not required to create instances of the same HTML code. The `<u-include>` itself in a custom element encapsulating the typical coding and also adds some minimal features for enriching placeholder in the template. If functionality beyond this basic implementation is required it can easily be extended to a [sfc].


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-include');
</script>
```

The `<u-include>` tag can be used at the destination place and will be replaced by the content of the referred `<template>` element. This will result in removing the original `<u-include>` element.

## Style Attributes

The `<u-include>` is must not be visible at first rendering. As it will be replaced any further styling is meaningless.

As a good practice a css rule to hide all unreplaced u-includes can be added: 

``` css
u-include {
  display: none;
}
```

## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended `<u-include>` element:

* **`ref`** -- The `ref` value is used to find the relevant template in the current document.  Any CSS selector can be
  used to identify the template element.


## HTML Template code

To provide some HTML to the client side the `<template>` can be used as it is not rendered and the html elements inside are not
part of the page document. Instead the template element provides the inner content as a `DocumentFragment` that can be reached
using the special readonly `content` attribute.

Here is an example of a template to display a simple feedback form that may apear on multiple places on a page.

``` html
<template id='tinyfeedback'>
  <form action="/api/feedback" method="post">
    <p>Do you like to give some feedback?</p>
    <input name="text" placeholder="Type here..."><button>Send</button>
  </form>
</template>
```

## Including the Template

``` html
<u-include ref='#tinyfeedback'></u-include>
```

## Template as Container

Some use-cases for Templates require different inner elements to be used in a common HTML container. Here is an example of a box
with icon for displaying a warning.

``` html
<template id='tinywarning'>
  <div style="background-color: antiquewhite; border:2px solid red;padding:0.4em; width:40ch">
    <p style="color:red;font-size:160%">⚠ Warning</p>
    <slot><p>This is a warning message!</p></slot>
  </div>
</template>
```

The `<u-include>` component also supports a useful mechanism to include nested html code by replacing the `<slot>` element of the template
with the inner HTML of the `<u-include>` element:

``` html
<u-include ref='#tinywarning'>
  <ul>
    <li>This warning is serious.</li>
    <li>Stay away from open devices with contact to mains voltage.</li>
    <li>Never work on a device that is connected to the mains voltage.</li>
    <li>Uploading firmware to devices using the USB port that have contact to mains voltage is dangerous.</li>
    <li>You may kill your computer and yourself.</li>
    <li>When you are making these kind of projects you really need to know what you are doing.</li>
    <li>I have warned you, do not blame on me.</li>
  </ul>
</u-include>
```


## See also

* <https://kittygiraudel.com/2022/09/30/templating-in-html/>
* <https://web.dev/learn/html/template/>

[sfc]: https://github.com/mathertel/sfc
