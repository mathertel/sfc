# Building and Bundling in the SFC library

A customized building and bundling can be established to create optimal results regarding the number of files and size to be downloaded.

## SFC Loader

The SFC loader is implemented in Typescript (not ESM module) and can be transpiled and minified to JavaScript using the
esbuild tool with `npm run build:loader`.  This will also remove and debugger and console statements not required for
production but helpful while developping.

While developing the SFC loader the minification is unwanted and constantly reporting the compilation status may help.

To report detailed error message created by the TypeScript compilation use the TypeScript compiler without creating
output files `npm run test:src`.  This is more detailed than the output from esbuild.

To watch and re-create during development the loader use `npm run build:loader-watch` or `npm run dev`.

These npm scripts are defined in package.json.


## [Data Hub](u-datahub.md)

The [Data Hub](u-datahub.md) is implemented as the `u-datahub.sfc` component and is loaded via the SFC loader.
There is no separate standalone `data-hub.js` build anymore.

Use the component in a page with `window.loadComponent("u-datahub")` and then access the instance via
`window.datahub`.


## Bundling Controls

Use a bundle for production only to reduce download size and avoiding console logging and debugger
breakpoints.

During bundling the following is removed to minimize download:

* all not relevant whitespace for html, script and css
* all comments
* all `console` output
* all `debugger` statements
* variable names are shortend when used internally only

Bundling is implemented by a simple javascript command line tool.

### Examples

To create a complete packed bundle containing all controls:

``` cmd
node bin\pack-sfc.js -o bundle.sfc --pack u-*.sfc
```

To create a complete unpacked bundle:  

``` cmd
node bin\pack-sfc.js -o bundle.sfc --no-pack u-*.sfc`
```

To create a bundle of selected components:

``` cmd
node bin\pack-sfc.js -o cc-bundle.sfc --no-pack u-card u-code
```

It is supported to maintain a text file with the list of components to be bundeled using a textfile
with file names on each line:
`node bin\pack-sfc.js -o cc-bundle.sfc --no-pack @select`

The extension .sfc is used when not specified in the filenames. Parameters with wildcards are supported.

