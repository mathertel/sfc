# Web component to display a pie chart

The <u-piechart> component can be used to display a pie with segments corresponding to the fraction of the given values.

It is a pure JavaScript based implementation that uses SVG to display the graph and axis wrapped into a SFC control.

The JSON object passed as parameter defines the options for the chart and includes the data of the pie chart.

![piechart example](/doc/u-piechart.png){ style="width:400px" }


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
var allSFCLoaded = window.loadComponent('u-piechart');
</script>
```

The `u-piechart` tag can be placed at the destination and the size can be applied in the style attribute:

```html
<u-piechart id="meminfo" style="width:220px;height:200px"></u-piechart>
```


### Draw the data

The data passed to the **draw()** method is an array of objects with title, value and color. All but the value are optional.

``` javascript
var memoryChart = document.querySelector('#meminfo');
memoryChart.draw(
  { title: 'used', value: 800000, color: 'rgb(0,0,128)' },
  { title: 'reserved', value: 200000, color: 'hsl(180,50%,50%)'},
  { title: 'available', value: 1200000, color: 'silver' });
```

Based on the values the total and percentage of the segment will be calculated.

When updating the value all values must be given at once.


## Options

The Pie Chart requires to set the options to create the scale of the chart including the colors of the arc in the
background.

``` js
var memoryChart = document.querySelector('#meminfo');
memoryChart.setOptions({
  showTitle: false,
  showValue: false,
  showPercentage: true,
  colors: []
});
```

* **showTitle** - The title of the data will be displayed on top of every segment.
* **showValue** - The value of the data will be displayed on top of every segment.
* **showPercentage** - The percentage of the data will be displayed on top of every segment.
* **colors** - Array of colors or comma separated string of colors.

Any color can be used in the colors properties that is understood by SVG. It can either be passed in the options or in the data.

When there are more data items than colors, the colors will be used from the start again.


### Add additional elements

The Pie Chart has no additional elements to be added. The **add()** method is available but without any effect.


### Clear the data

The **clear()** method will remove the pie completely.

Have a look at the source of the [Pie Chart Test Page](/test/test-piechart.htm) to see how the example buttons use the
api of this web component.


## See also

* [Line Chart SFC](/doc/u-linechart.md)

