# Web component to sum table columns

The `u-tablesum` custom element calculates the sum of the table column containing it.
Place it in a footer cell; it reads that column from every `<tbody>` and displays the
total in place. It can be used together with `u-tablesort` because it is a child
element, not a customized table element.

## Setup

Load the SFC loader and the component:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-tablesum');
</script>
```

Place `<u-tablesum>` in the footer cell to sum. Set `currency` to format the result as
currency. Its `locale` attribute, the cell's `lang` attribute, or the table's `lang`
attribute selects the number format; otherwise the browser language is used.

```html
<table is="u-tablesort" lang="de-DE">
  <tbody>
    <tr><td>12,50</td></tr>
    <tr><td>7,50</td></tr>
  </tbody>
  <tfoot>
    <tr><td><u-tablesum currency="EUR"></u-tablesum></td></tr>
  </tfoot>
</table>
```

## Instance Properties

- `currency` optionally formats the result as currency using an ISO 4217 currency code.
- `locale` selects the locale used to parse and format values. If omitted, the
  containing cell's or table's `lang` is used, then the browser language.

## Instance Methods

- `sum()` recalculates the total. Call it after changing table data.