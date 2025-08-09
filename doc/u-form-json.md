# Extended Form Element to support JSON Data

This is an extension to the HTML `<form>` element to enable getting and setting the  
values in the form elements by using a JavaScript Data Object or JSON.

The browsers support the FormData class that can be used to fetch all data from form elements.

This is implementing the behavior that is known from the classic Form Submit to submit all data using a POST request and the application/form-data or other data formats. This can be converted to a JavaScript Object.

But the JSON object created from the FormData is not strictly following the JSON approach:

* HTML Input elements with an empty value do not create an attribute
* Checkboxes create an attribute with value "on" when selected - not a boolean value.
* Also a reverse operation to modify a form value is not implemented.

These are small gaps in the native browser implementation that can be healed easily by using a WebControl that is attached to the form element. It supports getting and setting the form data using a propper JavaScript object.


## Setup

The loader script and the custom element definition must be included in the page:

```html
<script src="/loader.js"></script>
<script>
window.loadComponent('u-form-json');
</script>
```

Any form element then can be extended by this functionality using the HTML `is` attribute:

``` html
<form name="contactForm" is="u-form-json" method="dialog">
  ...
</form>
```

The attribute method="dialog" is used here to disable the standard "submit" behavior of the form.


## Read the Data in the form elements

The extended `<form>` element exposes a function on the form element that retrieves the data returns the current values
from the form:

```javascript
  const f = document.forms.contactForm;
  const jsonData = f.getJsonData();
  console.log ('data', jsonData);
```

The returned JavaScript Object will contain attributes for all html elements that are contained in the form.

* The `name` attribute of the HTML element will define the attribute name in the data Object.
* Empty `<input>`, `<textareas>` and `<select>` elements are returned as empty strings.  This includes also other
  text-like `<input>` elements (`hidden`, `password`, `email`, `url`, `tel`, `search` ...).
* Empty `<input type="range">` will return the value 0.
* Empty `<input type="color">` will return the value `#000000`.
* Empty `<input type="checkbox">` will return the value `false`.
* When there is no selected `<input type="radio">` element an empty string is returned.
* All HTML elements with actual values will return the current value.


The script also supports setting the value for the following output-related elements:

* `<output>`
* `<meter>`


## Update the Data in the form elements

The extended `<form>` element exposes a function on the form element that will set the given values
to the HTML elements that are contained in the form.

```javascript
  const f = document.forms.contactForm;
  const jsonData = 
    {
      "id": "136",
      "email": "me@internet.com",
      "name": "Joe Dummy",
      "registered": false,
      "color": "#223355"
    }
  f.setJsonData(jsonData);
```

The setJsonData(d) method can be used to set a single or multiple form values without directly accessing the HTML elements directly.
The 'METER' and 'OUTPUT' Elements are included to show the given values.

All elements that are not mentioned in the given data JavaScript Object will not be changed.


## Submit button

On every `key` ir `change` event on the form the form is validated by calling the `checkValidity` function. When false is returned
all button with type=Submit are disabled.


## Implementation details

When the form is ready it gets analyzed once to retrieve the possible object attributes and to create a default record
with the default values.

* The attributes that should be treated as booleans are found as they are represented by checkboxes.

The work was published by my blogging in [Advent 2022](https://mathertel.github.io/advent2022/15formjson.htm).  This is
a slightly enriched sfc version.


## See also

* [Advent 2022 Blog](https://mathertel.github.io/advent2022/15formjson.htm)
* [checkValidity() method](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity)
