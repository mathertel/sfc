# Dialog with Form

This is a extension to standard HTML dialogs that contain a form element to display and update data in a given data
object.

These dialogs are useful when a client side data model should be extended by the user using modal input.

The dialog is opened by passing a reference to the data object that will be updated when the user closes the dialog
without aborting.

The lifecycle of the dialog includes events that can trigger custom listeners for several purposes.


## Opening the dialog

The `open` function allows opening the dialog element in the center of the screen by passing the initial data for the form inside the dialog and a callback function that will be called when the dialog is closed submitting the form.

``` javascript
const dlg = document.querySelector('dialog#contactDetails');
dlg.open(
  {
    firstname: context.firstname,
    lastname: context.lastname,
    language: 'en'
  }, function(d) {
    // update the context data
    context.firstname = d.firstname,
    context.lastname = d.lastname,
    context.language = d.language
  });
```

After initializing the form and showing the dialog an `open` event is created with passing the detail attributes in the
event:
  
  * detail.dialog -- the dialog element.
  * detail.data -- the passed data object
  * detail.form -- the form element in the dialog.

  A typical use-case is to modify or enrich the form and adjust it to the given data like adding OPTIONS to SELECT
  elements or creating more form elements.

* The data object is then given to the form to populate all the form elements with the values.  This typically is done
  by using a form element extended by the `u-form-json` control.  See [u-form-json](u-form-json.md).

* The dialog is opened in modal mode.

## -- form element value changed

* a `datachange` event is created

  * detail.dialog
  * detail.data
  * detail.form
  * detail.name
  * detail.oldValue
  * detail.newValue

newValue can be modified ?





// DialogClass.ts: Behavior implementation for native dialogs with forms.
// This file is part of the Widget implementation for the HomeDing Library.

// Dialogs are implemented as HTML <dialog> elements containing a <from> element.
// Dialogs can be opened using DialogClass.openModalForm(id, data)

<!--

Implementation of a web component that enriches the functionality of regular <form> element
  to support data exchange with JSON data.

<form is="u-form-json" method="dialog">
...
</form>
