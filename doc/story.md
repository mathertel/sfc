# Effective Implementation for Storytelling

Demonstrate a minimal approach to implement storytelling and creating storytelling effects on the web
using modern browser technologies best suited to the task.

## Storytelling is still important

Storytelling is still a good approach to tell, demonstrate or teach using well-sized chunks of
information and include movie style visuals, animations, illustrations or even audio next to text
based content. Visual storytelling is the best way to stand out and grab the attention of users.

To fit into the economics of the internet the text part of any page or article should not be
underestimated. This is the content that gets indexed and highlighted when searching and this is the
information that AI agents can understand easily.

Here I assemble the techniques for an effective storytelling on the web with a minimal set of
techniques and tools by leveraging the capabilities of modern web technologies, especially CSS.


## Storytelling done right from the start

As a general approach I recommend what also is best practice in many frameworks:

* Breaking down the story into discrete steps, each represented by a section or container element.
* These steps should be visually distinct and can be enhanced with animations or transitions that are
  triggered as the user scrolls through the story.
* Trigger animations or transitions when a story step enters (or leaves) the viewport.
* Annotate the html container objects with appropriate classes or data attributes to indicate their
  role in the story.

This ensures that the user focuses on one piece of content at a time, creating a more engaging and
immersive storytelling experience.

In the age of AI not only humans are reading so I propose to stick to the foillowing rules as well:

* The steps should use text as the main content, complemented by visuals, animations, or other media
  to enhance the storytelling experience.
* visuals like pictures or illustrations should complement the text content only but bring no
  additional meaningfull information.

So let's bring together:

Content, Formatting, Triggers, Effects and Interactivity

<!--
There are some anti-patterns as well:
* Don't put relevant information into the pixels of images only.
-->


## Story Telling CSS

Here a simple framweork independent CSS only approach is used for showing the steps vertically by
marking a series of sections with the `story-step` class:

```CSS
.story-step {
  height: 100vh;
  overflow: hidden;
}
```

This results in each story step taking up the full height of the viewport, ensuring that the user
focuses on one step at a time as they scroll through the story.

In the final CSS you will find also some additional classes for centering content or column layouts,
but this is all in addition to the basic `story-step` class.

IN HTML the story steps are represented by sections with the `story-step` class:

``` html
<section class="story-step">
  <div class="story-content">
    < -- Your content here -- >
  </div>
</section>
<section class="story-step">
  <div class="story-content">
    < -- Your content here -- > 
  </div>
</section>
```

## Visual Effects

You can find various examples off effects and techniques used in storytelling. Here I show 
some cases to line out the  approaches that are available without massive custom coding.

### CSS Transitions
### CSS Animations
### Sound Effects


## Triggers

An important trigger used in storytelling on the web is the ability to detect when a part of the story
gets visible or becomes visible or leaves the viewport. This allows for triggering animations or
effects at the right moment, enhancing the user's experience.

There are quiet a lot frameworks available for handling storytelling effects on the web. Be aware that
some of them are outdated as the browser technology was evolving or are no longer maintained. However,
using the Intersection Observer API provides a lightweight and native solution without the need for
additional dependencies.

This can easily be implemented using the Intersection Observer API that is widely available as of
today. It provides a way to asynchronously observe changes in the intersection of a target element
with an ancestor element or with a top-level document's viewport.

<https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API>

When implementing storytelling effects using simple CSS based transitions and animations a 
simple implementation is to use the Intersection Observer API to set a `focus` class on the story step when it enters the viewport.

All elements flagged with `story-step` or `story-content` will get that class added and removed.

``` javascript
// Create a intersection observer that adds or removes the 'focus' class based on visibility
const stepObserver = new IntersectionObserver((entries) => {
  for (const step of entries) {
    step.target.classList.toggle('focus', step.isIntersecting);
  }
}, { threshold: 0.5 });

// Apply to all elements with the 'story-step' or 'story-content' class:
document.querySelectorAll('.story-step, .story-content').forEach(step => stepObserver.observe(step));
```

- `threshold: 0.5` -- // Trigger when 50% of the element is visible


### CSS Transitions

Simnple transitions and animations can be applied to these elements now using CSS only:

Example:

``` css
.story-slide-right {
  transition: transform 1s ease;
  transform: translateX(100vw);

  &.focus, .focus > & {
    transform: translateX(0);
  }
}
```

Now when focus is set on a story step, or a story content element, the CSS transform value changes and
the transition will be triggered.

This together is already a minimal implementation for creating storytelling effects on the web.

## CSS Animations


## Interactivity

t.b.d.: story scroll button




, and the `focus` class
will trigger them when the element enters the viewport.

that should respond to the viewport visibility need to be observed by the Intersection Observer.



For simple stories 
you can use the Intersection Observer API to detect when each story step enters or leaves the viewport and trigger the corresponding animations or effects.
