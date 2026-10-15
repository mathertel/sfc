# Web component for capturing duration typed values

The `<input is='u-duration'>` extends the functionality of the standard `<input>` element for
capturing duration values.

![u-duration component](/doc/images/u-duration.png){style="margin-left:2em"}

> [!note] The standard html `<input>` element can be used to capture values from many different data
> types like numbers, dates, times, colors and more.
>
> What is missing for some use-cases is capturing durations. This sfc control is using a regular text
> input for capturing and but converts the input into a duration presentation using the HH:MM:SS
> format.

## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-duration');
</script>
```

The `<input is='u-duration'>` element can be placed at any place in the document like any other
`<input>` element.

* Valid input formats are `NN` (one number), `NN:NN` (two numbers) and `HH:MM:SS`.

* The `prefUnit` attribute controls how inputs with one or two numbers are interpreted. It accepts
  `H` (hours), `M` (minutes), or `S` (seconds, the default); values are case-insensitive.

  | `prefUnit` | One number | Two numbers | Three numbers |
  |------------|------------|-------------|---------------|
  | `H`        | `HH`       | `HH:MM`     | `HH:MM:SS`    |
  | `M`        | `MM`       | `MM:SS`     | `HH:MM:SS`    |
  | `S`        | `SS`       | `MM:SS`     | `HH:MM:SS`    |

  For example, use `<input is="u-duration" prefUnit="H">` to enter hours or hours and minutes.

* Any non digit characters are converted into ':' characters.
  This allows input with different characters e.g.  on the numeric input pad using `9/22` that will be converted to
  `00:09:22`.

* The interim value the duration is calculated in seconds.  
  This enables input values that overflow like `80:00` for 80 minutes that will be converted into `01:20:00`


## Style Attributes

The `<input is='u-duration'>` element can be styled according the standard CSS styling attributes for `<input>`
elements.


## HTML and JavaScript accessible Attributes

The `<input is='u-duration'>` element offers all attributes of the `<input>` element and can be used within forms.


<!-- ## See also -->

<!-- * <https://en.wikipedia.org/wiki/ISO_8601> -->
* [Need a input type for duration](https://stackoverflow.com/questions/47506366/need-a-input-type-for-duration)
* [tc39/proposal duration-format](https://github.com/tc39/proposal-intl-duration-format)
