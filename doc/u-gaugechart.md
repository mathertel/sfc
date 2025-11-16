````markdown
# Gauge Chart Web Component

The `<u-gaugechart>` component displays a single-value gauge (dial) using SVG. It's intended as
a lightweight visual indicator for a numeric value within a configurable range.

This project implements charts as pure client-side SFC controls (see `src/loader.ts`). The
`<u-gaugechart>` follows the same patterns as the other chart components (`<u-piechart>`,
`<u-linechart>`) and exposes a small imperative API for updating values.

## Setup

Include the loader and register the component before using it:

```html
<script src="/loader.js"></script>
<script>
  window.loadComponent('u-gaugechart');
</script>
```

Place the element in the page and size it with CSS or the `style` attribute:

```html
<u-gaugechart id="cpu" style="width: 220px; height: 120px"></u-gaugechart>
```

## Basic API

The component exposes a small imperative API on the element instance. Query the element and call these methods:

```javascript
const gauge = document.querySelector('#cpu');

// Set numeric value (will be clamped to [min,max])
gauge.setValue(42);

// Optionally draw a full data object (value + display options)
gauge.draw({ value: 42, color: 'orange' });

// Update configuration options
gauge.setOptions({ min: 0, max: 100, showLabel: true });

// Clear the gauge
gauge.clear();
```

## Options

Use `setOptions()` to configure visual and numeric behaviour. Typical options include:

- `min` (number): lower bound (default: 0)
- `max` (number): upper bound (default: 100)
- `color` (string): default fill/stroke color for the gauge (CSS/SVG color)
- `thresholds` (array): optional array of { value, color } entries to color segments
- `showLabel` (boolean): show the numeric value as text (default: true)

Example:

```javascript
gauge.setOptions({ min: 0, max: 240, color: '#1e90ff', showLabel: true,
  thresholds: [{ value: 160, color: 'orange' }, { value: 200, color: 'red' }] });
```

## Behavior notes

- Values passed to `setValue()` are clamped to the configured range.
- When `thresholds` are provided the gauge background or arc color changes according to the active range.
- The component uses SVG and scales to its container size — prefer explicit `width`/`height` or a well-constrained layout.

## Testing and examples

There is a placeholder test page: `/test/test-gaugechart.htm`. Use the dev server to open
`/test/test-gaugechart.htm` and interact with the component. See `test/test-piechart.htm` for a reference of how markdown docs
can be embedded into a test page.

## See also

- [Pie Chart SFC](/doc/u-piechart.md)
- [Line Chart SFC](/doc/u-linechart.md)

````
