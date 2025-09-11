# Dialogs and Forms

The 2 HTML elements `<dialog>` and `<form>` of HTML have built-in shared functionality that support easy implementation of model and non-modal dialogs.

## Forms Default Behavior

Forms originally were made to create GET or POST request to the server with the form data as payload resulting in a reload of
the current page.

```html
<form>
  <input name="field1" value="abc">
  <button>Button</button>
</form>
```

Clicking this button will reload the page with adding a querystring to the url like `?field1=abc`.
This default behavior can be changed.

> Especially modern SPA applications don't like this approach because all Javascript variables and dynamically built HTML will
> be lost at this point. The alternative approach used today by SPA applications is using AJAX / fetch calls initiated by
> JavaScript and call the server functionality in the background leaving all HTML Elements unchanged.


## Forms for Dialogs

Forms can be used without reloading the page by adding attributes:

* A `<button formmethod="dialog">` will not reload the page by adding parameters when the button is pressed. The `formmethod` also exists for `<input>`
  elements with type `submit` or `image`
* A `<form method="dialog">` will not create a reload for all `<button>`s and `<input>`s.

There will be no reload but the `submit` event is still available to trigger some activity.

When you like to use buttons inside of `<forms>` that do not trigger a submit add a `type="button"` to the button as `type="submit"` is the default.


## Form Data Access

As data inside the form elements like inputs is not given to the URL or a POST body. The form data can be retrieved by accessing
the elements directly as they are not changed during the submit event or they can be retrieved by using the built-in `FormData`
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

The skeleton for a dialog with form data looks like this:

``` html
<dialog is="u-form-dialog">
  <form is="u-form-json" method="dialog">
    <input name="field1">
    <input name="field2">
    <button type="submit">Button</button>
  </form>
</dialog>
```

The names of the input elements will define the properties of the data structure. The `<button>` will trigger the submit event.

Here 2 custom elements help in the implementation:

* **`u-dialog-form` component** -– This is a custom control that extends the `<dialog>` element to better support the combination of a form inside a dialog.
* **`u-form-json` component** -– This is a custom control that extends to the `<form>` element to better support JSON data that can be handled locally without reloading.


## Using Modal Dialogs

To show the dialog with the embedded form in a modal mode the `showModal(data)` function can be used as known from the standard HTML doalog element.

The `<u-form-dialog>` extension extends this function by accepting the initial form data as an Object.

The `<u-form-dialog>` extension also return a Promise that is resolved or rejected when the dialog is closed. It provides the current data as parameter when resolved.

``` javascript
const data = {
  target: "switch/0",
  sound: "bell"
};
dlg.showModal(data)
  .then(data => {
    // result of action dialog 
    alert("Dialog result=\n"
      + JSON.stringify(data, undefined, 2));
  });
```


## `Init` Event

The `Init` event is dispatched after setting the data to the form and before the dialog is shown.  This event can
trigger the functionality for further customization of the dialog or form details like populating select options or
dynamically creating more HTML element in the form.

Listeners to events are typically registered once by the page or application to support how the dialog works including
"internal" processing that do not close the dialog.  Events can also be used to setup a process that requires the dialog
as a step but it is hard to include the same dialog indifferent processes or use-cases by this approach.

The `event.detail` attribute that provides the following information:

* action -- 'init',
* dialog -- a reference to the dialog element.
* firstInit -- is `true` when called the first time.
* data -- The initial data of the form.
* form -- a reference to the form element.

The following example makes an input field "readonly" when the attribute was given in the data object:

```javascript
const dialog = document.querySelector("dialog#dlg01");
dialog.addEventListener('init', (evt) => {
  console.debug('init', evt);

  const form = evt.details.form;
  const data = evt.details.data;

  const inObj = form.querySelector('input#firstname');

  inObj.readonly = !!data.firstname;
});
```


## `Action` Event

The above mentioned "old" way how forms work had the possibility to add action/formaction to submit into different use-cases by
specifying a different url instead of a simple reload.

This was useful and allows submitting the same form for different processing by just adding an attribute on the `<button>`.

The [u-form-dialog] control therefore captures clicks on all buttons of the form and dispatches an 'action' event with the details data. When the button is NOT of type submit as it has no attribute `type="button"` the action event is triggered without closing the dialog.

The `event.detail` attribute that provides the following information:

* action -- The value from the `u-action` attribute on the HTML element.
* dialog -- a reference to the dialog element.
* data -- The initial data of the form.
* form -- a reference to the form element.

The following example adds functionality to the 'ok' action in the dialog.  This must not result in closing the dialog.

``` javascript
dialog.addEventListener('action', evt => {
  if (evt.detail.action === 'ok') {
    ... do something with the data
  }
});
```

As click events are dispatched before submit the action event is dispatched before closing the dialog.


## Closing a Dialog

There are the following ways of closing a modal dialog that are covered by the u-dialog-form extension:

* The `<esc>` key will close the dialog to cancel the operation.
* submitting a `<form>` with method="dialog" set.
* clicking a button with formmethod="dialog"
* using the close() method

With this extension the dialog also can be closed by using the `close` action int the `u-action` attribute: 

``` html
<div class="u-close" u-action="close"></div>
```

When you like to use buttons inside of `<dialog><forms>` that do not trigger a submit and therefore close the dialog add
a `type="button"` to the button as `type="submit"` is the default -- or just don't use a `<button>`.


## Use the Promise for processing dialog results

When closing the dialog the standard events submit, cancel and close are captured by the extension and the resulting
dataset is given to the application using the created Promise.  

The submit, cancel and close actions are available on the dialog but are not offering direct access to the details
through the event object as they are created by the unchanged default implementation of the dialog element.

Dialogs are opened using the customized versions of show(initialData) or showModal(initialData) function that creates a
Promise and gives it back as a result of the function.  When this promise resolves the by submitting the dialog (not
cancel) the promise resolves with passing the final dataset.  When the dialog is canceled the Promise will be rejected.

This Promise based mechanism is used best for using the resulting data in the application.  In contrast to actions this
can be used even when the dialog is used in different situations.

``` javaScript
  myDialog.showModal({ i01: 99 })
    .then((data) => { 
      ...  use data  })
    .catch(() => { 
      ... dialog was cancelled });
``` 


## See also

* [u-form-json] Custom Control extending the `<form>` element
* [u-form-dialog] Custom Control extending the `<dialog>` element
* About HTML dialogs <https://web.dev/learn/html/dialog/>
* <https://www.w3.org/WAI/WCAG21/Techniques/html/H102>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/form>
* <https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog>


[u-form-json]: /doc/u-form-json.md
[u-form-dialog]: /doc/u-form-dialog.md