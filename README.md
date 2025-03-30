# Single-File Custom Elements (SFC)

Custom Elements also known as Web Components is a set of functionality and technologies enabling creating new HTML tags
side-to-side with the existing standard elements and utilize them in your web pages and apps.  They offer the same
general benefits of React/Angular/Vue components without being tied to a specific framework.

**Single File Components (SFC)** got popular as they allow to define the code for a component in one place.

Web standards for HTML, CSS, and JavaScript have matured significantly, providing a robust foundation for modern web
development.  While these standards offer extensive capabilities, they can't cover every possible use case.

One way to extend HTML's declarative nature is through JavaScript, enabling functionality beyond standard tags.  This
approach has a long history, including proprietary solutions like HTML Components (.htc) in Internet Explorer 5.5.

As of 2024, web standards now include official support for creating and extending HTML tags through Web Components and
Custom Elements, utilizing the browser's `customElements` interface.

Single-File Components (SFC) have become increasingly popular as they allow developers to define all component code in
one file, eliminating the need to:

* Maintain separate CSS files for styling
* Keep JavaScript code in separate files
* Store HTML markup in distinct files
* Create runtime scripts for generating CSS and HTML


## Benefits of Single-File Components

Why would you want to use Single-File Components instead of traditional separated files? Here's why:

* **Cohesive Organization** -- Instead of spreading component code across multiple files (HTML, CSS, and JavaScript),
  everything related to the component lives in one place.

* **Direct Implementation** -- Unlike frameworks like Vue, where components are transformed into JavaScript during build
  time, this approach loads component definitions directly in the browser.

* **Native Processing** -- HTML, CSS, and JavaScript are handled natively without transformation into pure JavaScript
  code, resulting in more straightforward debugging and maintenance.

* **Build Process Independence** -- Components can be developed and tested without complex build pipelines, making the
  development process more efficient.

The component loading mechanism described here brings these benefits directly to the browser, enabling a more
streamlined development experience while maintaining web standards compliance.


## SFC file syntax

The SFC files are using the HTML format for defining JavaScript, templates and styles.

``` html
<template> ... </template>
<style> ... </style>
<script> ... </script>
```

* `<script>` -- The script must export the class for the custom component implementation.

  By specifying the `extends` attribute an existing html element can be extended using the `is='u-class'` attribute.

  The class can include methods starting with a `on` prefix.  These methods are automatically added as listeners for the
  given events like `onClick(evt)` will be called in a `click` event.  This naming convention is known from several HTML
  frameworks and adopted in the loader.

* `<style>` -- This optional part of the SFC is used to define a set of css rules specific to the custom component

  By using the `scoped` attribute the CSS rules are added to the Shadow DOM.  Without the `scoped` attribute the CSS
  rules are added to the header of the main DOM once when the componend is defined.  The rules will be there even when
  no custom component is present.

  The HTML style node can be accessed in the class functions by using `this.constructor.uStyle`.

* `<template>` -- This optional part defines a HTML template for the custom component.

  The HTML template node can be accessed in the class functions by using `this.constructor.uTemplate`.


## Implementation as a Lean / Pure Web Framework

The framework was initially developed to support a framework approach for situations where size matters.

The initial use-case is the [HomeDing Library](https://homeding.github.io/) with these key features:

* **Minimal Footprint**: Designed for IoT devices like ESP8266 or ESP32 processors, where the Web UI must fit within 2MB of Flash memory
* **Standards-First Approach**: Leverages modern HTML and CSS capabilities instead of heavy JavaScript implementations
* **IDE-Friendly**: Uses standard HTML file format for maximum development tool support
* **Pure Web Philosophy**: Adheres to principles outlined in the [pureweb.dev](https://pureweb.dev/manifesto) manifesto

Both the loader and components include development-friendly features like documentation and console logging.  For
production deployment, these can be stripped using tools like terser:

```bash
npx terser loader.js -o loader.min.js -c drop_console -m
```

Bundling multiple controls into a single bundle file is supported by a simple javascript bundler that can be started as command line

```bash
npx packsfc <components> -o bundle.htm
```

Both will massively reduce the required download size.


## See Also

* [Components](doc/index.md)
* [Test Pages](test/index.htm)

* <https://github.com/web-padawan/awesome-web-components/tree/main>
* Many hints and repositories from Andrea Giammarchi:
  * <https://github.com/WebReflection/>
  * <https://gist.github.com/WebReflection/ec9f6687842aa385477c4afca625bbf4>





