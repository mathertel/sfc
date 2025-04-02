# Web component to display time in user local formatting

The `<time>` element is one of the newer elements in the HTML standard tag collection. Its purpose is to display date and time
values while providing a machine-readable timestamp as an attribute for semantic purposes.

The `u-time` custom Element implementation extends the functionality of the standard `<time>` element to support locale
specific formatting of date, time datetime values by using the SFC loader.

![u-time component](../doc/u-time.png)

Formatting time or date output is challenging because the appropriate format for users depends on user language preferences. As
this is known at runtime only this cannot be pre-calculated in HTML generating frameworks like Angular or Eleventy. You either
need a dynamic server or handle it client-side.

## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-time');
</script>
```


## Example

The `u-time` extended `<time>` tag can be placed at the destination and the size can be applied in the style attribute:

```html
<time is='u-time' datetime='2025-03-28 14:09:29' datestyle='short' timestyle='short'>2025-03-28 14:09:29</time>
```

will show up as `3/28/25, 2:09 PM` on `en` locales.

```html
<time is='u-time' datetime='${new Date().toISOString()}' datestyle='medium' timestyle='medium'>${new Date().toISOString()}</time>
```

will show up as `Mar 28, 2025, 2:09:29 PM` on `en` locales.


## Implementation details

The browser's `Intl` namespace, which aids in internationalization, makes it easy to format dates and times into
user-expected formats.

in JavaScript this is done by some script:

``` js
const fmt = new Intl.DateTimeFormat(navigator.languages, {
  dateStyle: 'medium',
  timeStyle: 'short',
});
this.textContent = fmt.format(new Date('2025-03-28 14:09:29'));
```

This formatting is wrapped into a Custom Component implementation named `u-time` that extends the regular `<time>` element
by adjusting the shown textual value from the given datetime attribute. No need to specify a text inside the time element.


## Style Attributes

The standard `<time>` component can be styled according the standard CSS styling attributes.


## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended time element:

* `datetime` -- the value of the date/time to be displayed. A date object or ISO date format can be used.
* `datestyle` -- the style of the date part beeing displayed. Possible values are `"full"`, `"long"`, `"medium"`, and `"short"`.
* `timestyle` -- The style of the time part beeing displayed  Possible values are `"full"`, `"long"`, `"medium"`, and `"short"`.

The `"medium"` format is default for datestyle and timestyle.

The convertion of the given time is done by using the `Intl.DateTimeFormat` API in the browser.


## See also

* [HTML time element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
* [About time formatting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)

