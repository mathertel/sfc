<link Content-Type="text/css" href="/docstyle.css" rel="stylesheet" />

# Web component to add a sort function to HTML tables

The `u-tablesort` custom element implementation extends the functionality of the standard `<table>` element to support
sorting of the table content by the values of a column.

A click on the header sorts the table.

<!-- ![u-tablesort component](../doc/u-tablesort.png) -->

## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-tablesort');
</script>
```

By adding the attribute `is='u-tablesort'` the `<table>` tag is extended with the functionality of the
UTableSort class. To enable sorting on a column the sort attribute in the header must be set:

```html
<table is="u-tablesort">
  <thead>
    <tr>
      <th sort="num">id</th>
      <th sort>web site</th>
      <th sort>purpose</th>
      <th sort='date'>last online</th>
    </tr>
  </thead>
...
</table>
```

A click on a header cell starts building an array of the sort value and a reference to the table row that is sorted in
ascending order.  After sorting the rows are re-added to the table in sorted order.


## Sorting Attributes

The way of sorting the data in the table is specified by the `sort` attribute on the table header cells.

| Attribute              | Sorting behavior                                 |
| ---------------------- | ------------------------------------------------ |
| sort='' or sort='text' | Take text of cell for comparing.                 |
| sort='num'             | convert table text to a number before comparing. |
| sort='date'            | convert table text to a date before comparing.   |


## See also

* <https://developer.mozilla.org/en-US/docs/Web/Web_Components>
* <https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements>
