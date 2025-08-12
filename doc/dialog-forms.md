# Dialogs and Forms

The 2 HTML elements `<dialog>` and `<form>` of HTML have built-in shared functionality that support easy implementation of model and non-modal dialogs.

## Forms Default Behavior

Forms originally were made to create GET or POST request to the server with the form data as payload resulting in a reload of
the current page.

```html
<form>
  <input name="formdata"> <button>Button</button>
</form>
```

Clicking this button will reload the page with adding a querystring to the url like `?formdata=123`.
This default behavior can be changed.

> Especially modern SPA applications don't like this approach because all Javascript variables and dynamically built HTML will
> be lost at this point. The alternative approach used today by SPA applications is using AJAX / fetch calls initiated by
> JavaScript and call the server functionality in the background leaving all HTML Elements unchanged.


## Forms for Dialogs

Forms can be used without reloading the page by adding attributes:

* A `<button formmethod="dialog">` will not create a reload when this button is pressed. The `formmethod` also exists in `<input>`
  elements with type `submit` or `image`
* A `<form method="dialog">` will not create a reload for all `<button>`s and `<input>`s.

There will be no reload but the `submit` event is still available to trigger some activity.

When you like to use buttons inside of `<forms>` that do not trigger a submit add a `type="button"` to the button as `type="submit"` is the default.


## Form Data Access

As data inside the form elements like inputs is not given to the URL or a POST body. The form data can be retrieved by accessing
the elements directy as they are not changed during the submit event or they can be retrieved by using the built-in `FormData`
Object.

This works as designed but some detailled functionality is missing. To get a good JSON data exchange functionality `<form>`
elements can be extended using the `u-form-json` custom element:

``` html
<form is='u-form-json'>...</form>
```

Data then can be exchanged using the custom methods `getJsonData()` and `setJsonData()` with a propper JSON data object.

See [u-form-json] Control for details on the advantages and how the custom extension works.


## Dialogs with Forms

The Form mechanism have the "dialog" methods for doing exactly this: Providing modal and non-modal form based interactions.

To solve the typical topics when combining `<dialog>` and `<form>` elements the [u-form-dialog] control was implemented as an extension to the `<dialog>` element.


## Opening

* pass data
* `init` event


## The "Init" Event

is dispatched after setting the data to the form and before the dialog is shown.

event details with dialog, form, data, ...

This event can be used for further customization of the dialog or form details like populating select options or dynamically
creating more HTML element in the form.

This example makes an input field "readonly" when the attribute was given in the data object:

```javascript
  const dialog = document.querySelector("dialog#dlg01");
  dialog.addEventListener('init', (evt) => {
    console.debug('init', evt);

    const form = evt.details.form;
    const data = evt.details.data;

form.input firstname . readonly = !!data.firstname;

  });
```

## Action Events

The above mentioned "old" way of working had the possibility to add action/formaction to submit into different use-cases by
specifying a different url instead of a simple reload.

This was useful and allows submitting the same form for different processing by just adding an attribute on the `<button>`.

The [u-form-dialog] control therefore captures clicks on all buttons of the form and dispatches an 'action' event with the details data.

When the button is NOT of type submit as it has no attribute `type="button"` the action event is triggered without closing the
dialog.

When the button is of type submit the action event is triggered after closing the dialog.

event details with action=formaction, dialog, form, data, ...


## closing

There are the following ways of closing a modal dialog that are covered by the u-dialog-form extension:

* The `<esc>` key will close the dialog to cancel the operation.
* submitting a `<form>` with method="dialog" set.
* clicking a button with formmethod="dialog"
* using the close() method

When you like to use buttons inside of `<dialog><forms>` that do not trigger a submit and therefore close the dialog add a
`type="button"` to the button as `type="submit"` is the default.


## See also

* [u-form-json] Custom Control extending the `<form>` element
* [[u-form-dialog] Custom Control extending the `<dialog>` element
* About HTML dialogs <https://web.dev/learn/html/dialog/>
* <https://www.w3.org/WAI/WCAG21/Techniques/html/H102>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog>


[u-form-json]: /doc/u-form-json.md
[u-form-dialog]: /doc/u-form-dialog.md