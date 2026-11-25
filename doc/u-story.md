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
<u-story class="focus">
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

The initial `focus` class keeps story effects in their readable state until the
component initializes. The component updates the `focus` classname according to the
reduced-motion preference.

## Styling the go-next button

The button is inside the component's shadow root, so page styles cannot target its `.go-next` class directly. It exposes
the `go-next` part for page-level styling:

```css
u-story::part(go-next) {
  color: white;
  background-color: darkblue;
  border: 0;
}

u-story::part(go-next):disabled {
  opacity: 0.1;
}
```

## Focus-based transitions

The component toggles `focus` on story steps as they enter and leave the viewport. Add an effect class to content inside a
step, then use the step's `focus` state to transition it into view. These examples follow the fade and slide effects in
`test-story.htm`:

```css
.story-fade-1 {
  transition: opacity 1s ease;
  opacity: 0;

  &.focus,
  .focus & {
    opacity: 1;
  }
}

.story-slide-left {
  transition: transform 1s ease;
  transform: translateX(-100vw);

  &.focus,
  .focus & {
    transform: translateX(0);
  }
}

.story-slide-right {
  transition: transform 1s ease;
  transform: translateX(100vw);

  &.focus,
  .focus & {
    transform: translateX(0);
  }
}
```

Use the effect classes on content within a `.story-step`:

```html
<section class="story-step">
  <div class="story-content story-fade-1">
    <h2>This content fades into view</h2>
  </div>
</section>
```

Start the `<u-story>` host with `class="focus"` so content is in its readable end state before JavaScript
initializes. The component checks the user's reduced-motion preference: when reduced motion is requested, it keeps `focus`
on the host and does not observe individual steps, so the transition targets remain in their final positions. Otherwise it
removes the host's `focus` class and applies `focus` to intersecting steps, triggering the transitions. This uses the
component's focus state to keep the story readable without separate CSS preference rules.

## Instance Properties

`u-story` has no observed HTML attributes.

## Instance Methods

* **`init()`** -- Loader lifecycle hook that configures step observation and button behavior. It is called automatically
  when the element connects and is not intended for direct use.

* **`connectedCallback()`** -- Starts component initialization when the element is connected.

* **`disconnectedCallback()`** -- Stops observation and removes the scroll listener when the element is disconnected.
