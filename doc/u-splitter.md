# Split regions with interactive horizontal or vertical sizing

This is an implementation of a custom element that enables horizontal or vertical sizing of a pair of regions inside
this containter element.

<!-- ![u-splitter component](./images/u-splitter.png){style="margin-left:2em"} -->

The 2 regions inside this custom container element will be given enough width/height to cover the whole defined space.
An additional element is created that can be shifted by using a mouse or touchscreen pointer.

This custom container element is not using the shadow dom, leaves the original html structure in place and only acts on
sizing the 2 contained elements.  The `<u-splitter>` and the 2 contained elements must use `display:block` to work.

## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-splitter');
</script>
```

## Example

```html
<u-splitter style="height:240px">
  <div>Text in the left region...</div>
  <div>Text in the right region...</div>
</u-splitter>
```

## Style Attributes

The `<u-splitter>` component can be styled according the standard CSS styling attributes of a `display:block` element.

The 2 contained elements must also use the `display:block` style to work. The can define padding and margin to separate
the inner regions.

To specify the initial size e.g.  the widths on the inner regions for horizontal splitting can be specified on the inner
regions.

In case the initial size of the nested components do not fit to the whole available space the inner regions are sized by keeping the ration.
The same is true when resizing or zooming.

## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended time element:

* `vertical` -- when this attribute is present the splitter will vertically split the container and show the inner regions above and below the
  split bar. Otherwise the container is split horizontally.

<!-- ## See also -->

