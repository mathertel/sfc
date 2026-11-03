# Locale Formatting

The `<u-format>` component displays plain text by default or formats currency using
`Intl.NumberFormat`. The `locale` attribute selects the locale; its default is
`navigator.language`.

## Setup

Load the component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent("u-format");
</script>
```

Supply text or a number as inner text or with the `value` attribute:

```html
<u-format mode="text">Amount pending</u-format>
<u-format mode="text" value="9876.54">Fallback text</u-format>
<u-format value="1234.56" currency="EUR" locale="de-DE"></u-format>
```

The first two examples display `Amount pending` and `9876.54` unchanged. The third
formats the number as euros with German grouping, decimal separators, and currency
symbol placement.

Currency input must be an unformatted number using a dot as the decimal separator, not
an already locale-formatted amount. Default `Intl.NumberFormat` grouping and rounding
rules apply. Invalid numeric input displays empty text in currency mode; text mode
preserves the supplied value without numeric conversion.

## Instance Properties

- `value` -- Input as an attribute or JavaScript property. Takes precedence over inner
  text. If omitted initially, the component captures its trimmed inner text during
  initialization. Updates automatically refresh the output.
- `currency` -- Currency code such as `EUR`, `USD`, or `JPY`. Uses `Intl.NumberFormat`
  currency style, including currency-specific decimal places, and automatically switches
  `mode` to currency internally. Supply a valid currency code; to return to plain text,
  set `mode="text"` rather than clearing `currency`.
- `mode` -- Display mode, either `text` (the default) or `currency`. Text mode displays
  input literally, preserving numeric spelling such as leading zeros. Currency mode uses
  the configured currency. Setting `currency` selects currency mode; to start in text
  mode with a currency configured, place `mode="text"` after `currency`.
- `locale` -- Locale identifier such as `de-DE` or `en-US`. Defaults to
  `navigator.language`. Changes automatically refresh currency formatting and do not
  alter text-mode output.

All four attributes are also accessible as JavaScript properties.

## Instance Methods

- `init()` -- Lifecycle hook that captures inner text if no value has been supplied and
  refreshes the output. Called automatically by the loader.
- `attributeChangedCallback(name, oldValue, newValue)` -- Lifecycle hook that
  synchronizes changes to `value`, `currency`, `mode`, and `locale`. Called
  automatically by the browser.

Rendering is private; update the attributes or their corresponding properties to refresh
the display.
