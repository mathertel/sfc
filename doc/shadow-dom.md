# Shadow DOM in Web Components

Shadow DOM is an optional feature for web components aka.  custom elements in HTML.  While not mandatory, it solves
specific problems in web development and is particularly useful for component-based solutions.

For components that don't require style and content encapsulation, you can continue using the traditional "Light" DOM
approach.  However, Shadow DOM becomes valuable when you need:

* CSS scoping
* DOM encapsulation
* Resilient composition for reusable elements

Shadow DOM makes components more self-contained and helps prevent conflicts in HTML, CSS, and JavaScript.

## Key Benefits

* **Isolated DOM**: Components with Shadow DOM can be updated independently.  Using 'closed' mode enforces strict
  encapsulation, preventing access through `document.querySelector()`.

* **Scoped CSS**: While CSS is globally scoped by default, Shadow DOM provides natural CSS scoping.  Styles remain
  contained within the component, preventing both external leaks and interference.  This enables simpler CSS selectors.

* **Composition**: Components can be built using native web technologies (HTML, CSS, JavaScript).  Many frameworks now
  support Custom Elements composition.

* **Team Productivity**: When working with multiple teams or external components, encapsulation can improve
  productivity.  However, consider the trade-offs in terms of memory usage and loading times.


## Alternative: iframes

Note that `<iframe>` elements provide stricter encapsulation, especially for external content from other domains.
Unlike Custom Elements, iframes offer additional security features like CORS rules and scoped cookies.


## Light DOM vs Shadow DOM

Light DOM refers to the standard DOM tree within HTML elements, commonly referenced when discussing web components.

| Feature           | Light DOM            | Shadow DOM                  |
| ----------------- | -------------------- | --------------------------- |
| DOM Structure     | Standard DOM tree    | Encapsulated DOM tree       |
| Accessibility     | Standard DOM methods | Isolated from main document |
| Style Isolation   | None                 | Complete or partial*        |
| CSS Scope         | Global               | Component-scoped            |
| CSS Penetration   | Global CSS applies   | Global CSS blocked          |
| CSS Features      | -                    | ::part() selector available |
| JavaScript Access | Direct               | Requires shadowRoot*        |

\* Note: Shadow DOM can be created in 'open' or 'closed' mode, affecting accessibility.


## When to Use Each

Some rules of thumb:

Choose Light DOM when:

* Server-side rendering is required
* Elements are styled in the main page
* Global CSS rules are preferred

Choose Shadow DOM when:

* Importing components that might have CSS conflicts
* Strong content encapsulation is needed
* CSS rules come from multiple sources
* `<slot>` elements are required


## See also

* [Learn more about Shadow DOM](https://web.dev/articles/shadowdom-v1)