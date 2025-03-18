# Single-File Custom Elements (SFC)

Single File Components (SFC) got popular as they allow to define the code for a component in one place.

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
* 