# Web component to display time in user local formatting

The <u-time> custom Element implementation extends the functionality of the standard `<time>` element to support locale
specific formatting of date, time datetime values by using the SFC loader.

![u-time component](../doc/u-time.png)


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-time');
</script>
```

The `u-time` tag can be placed at the destination and the size can be applied in the style attribute:

```html
<time is='u-time' datestyle='short' timestyle='short' datetime='31.01.2024'></time>
```


## Style Attributes

The standard `<time>` component can be styled according the standard CSS styling attributes.


## HTML and JavaScript accessible Attributes

The following attributes can be used to configure the behavior of the extended time element:

* `datetime` -- the value of the date/time to be displayed. A date object or ISO date format can be used.
* `datestyle` -- the style of the date part beeing displayed. Possible values are `"full"`, `"long"`, `"medium"`, and `"short"`.
* `timestyle` -- The style of the time part beeing displayed  Possible values are `"full"`, `"long"`, `"medium"`, and `"short"`.

The convertion of the given time is done by using the `Intl.DateTimeFormat` API in the browser.


## See also

* [HTML time element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/time)
* [About time formatting](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat)

