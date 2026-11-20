# Story container

The purpose of the `<u-story>` component is to support storytelling implementations by
using a sequence of story sections in a way that is accessible and respects the user's reduced-motion preference.

The component is designed to be flexible and can be used in a variety of storytelling scenarios, such as interactive narratives, guided tours, or educational content.

The `<u-story>` component presents a sequence of story sections in the light DOM. Each direct story section should use the
`story-step` class. When motion is allowed, visible steps receive a `focus` class, which can be used to trigger CSS
transitions on their content. With reduced motion, the story host stays focused so the content remains visible.

The component includes a button that scrolls to the next step and disables itself when there are no later steps. It uses
`IntersectionObserver` to toggle step focus and respects the user's reduced-motion preference.

## Setup

Load the SFC loader and component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-story');
</script>
```

Add a `<u-story>` element with one or more `.story-step` sections:

```html
<u-story class="story-container focus">
  <section class="story-step" style="background-color: #c1f4c5;">
    <h2>First step</h2>
    <p>Story content goes here.</p>
  </section>
  <section class="story-step" style="background-color: #ffd6e0;">
    <h2>Second step</h2>
    <p>More story content goes here.</p>
  </section>
</u-story>
```

The initial `focus` class keeps story effects in their readable state until the component initializes. The component adds
`story-container` and updates `focus` according to the reduced-motion preference.

## Instance Properties

`u-story` has no observed HTML attributes.

## Instance Methods

* **`init()`** -- Loader lifecycle hook that configures step observation and button behavior. It is called automatically
  when the element connects and is not intended for direct use.

* **`connectedCallback()`** -- Starts component initialization when the element is connected.

* **`disconnectedCallback()`** -- Stops observation and removes the scroll listener when the element is disconnected.
