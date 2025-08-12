# Dialog with Form

This is a extension to standard HTML dialogs that contain a form element to display and update data in a given data
object.

These dialogs are useful when a client side data model should be extended by the user using modal input.

The dialog is opened by passing a reference to the data object that will be updated when the user closes the dialog
without aborting.

The lifecycle of the dialog includes events that can trigger custom listeners for several purposes.

The HTML elements inside the dialog can be attributed with `u-text` for adding variable text and `u-action` to trigger
pre-defined activities.


## Opening the dialog

The `open` function allows opening the dialog element in the center of the screen by passing initial data and a callback function 

``` javascript
const dlg = document.querySelector('dialog#contactDetails');
dlg.open(
  {
    firstname: context.firstname,
    lastname: context.lastname,
    greeting: 'Hello'
  }, function(d) {
    // update the context data
    context.firstname = d.firstname,
    context.lastname = d.lastname,
  });
```

The opening is executed by the following steps:

### Data for opening

The data object passed in the parameter is used for 2 purposes:

* The inner text of the elements with an attribute `u-text` and a corresponding attribute in the data will be set to the
  given values.  This enables customizing decorative and explaining text in the dialog.

* All attributes that match any form-related element will be initialized with the passed values as documented in the
   of the .
  The data object is then given to the form using the `setJsonData` function to populate all the form elements with the values
  as described in the custom [u-form-json extension](u-form-json.md).

### Displaying the modal dialog

The dialog is shown using the `showModal` function.  

### Opened Event

After initializing the form and showing the dialog an `open` event is dispatched with passing the detail attributes in the
event:
  
* detail.dialog -- the dialog element.
* detail.action -- "opened".
* detail.data -- the passed data object
* detail.form -- the form element in the dialog.

A typical use-case for the open Event is to modify or enrich the form and adjust it to the given data like adding
OPTIONS to SELECT elements or creating more form elements.

### Actions with dialog data

To add specific actions to close the dialog the click on buttons in the dialog can be attributed with
`u-action=[cancel,...]". This is equal to calling the close(action) function.


### Closed Event

The "closed" event is dispatched by the u-form-dialog extension after the dialog has been closed with passing the detail
attributes in the event:
  
* detail.dialog -- the dialog element.
* detail.action -- the value of the `u-action` attribute of the clicked button or undefined.
* detail.data -- the passed data object
* detail.form -- the form element in the dialog..


Do not mixup with the close event issued by the dialog element out-of-the-box.




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
