# Building and Bundling in the SFC library

A customized building and bundling can be established to create optimal results regarding the number of files and size to be downloaded.

### SFC Loader

The SFC loader is implemented in Typescript (not ESM module) and can be transpiled and minified to JavaScript using the
esbuild tool with `npm run build:loader`.  This will also remove and debugger and console statements not required for
production but helpful while developping.

While developing the SFC loader the minification is unwanted and constantly reporting the compilation status may help.

To report detailed error message created by the TypeScript compilation use the TypeScript compiler without creating
output files `npm run test:src`.  This is more detailed than the output from esbuild.

To watch and re-create during development the loader use `npm run build:loader-watch` or `npm run dev`.

These npm scripts are defined in package.json.


### Data-Hub

The [Data Hub](data-hub.md) is implemented in Typescript as a ESM module and can be transpiled and minified to
JavaScript using the esbuild tool too.

To create the bundle file for the data hub use the npm script `npm run build:hub`.

To watch and re-create during development the loader use the npm script `npm run build:hub-watch`.


## Bundling Controls

Bundling multiple controls into a single bundle file is supported by a simple javascript bundler that can be started as
command line. This will also remove and debugger and console statements not required for production but helpful while developping.

```bash
npx packsfc <components> -o bundle.htm
```

The packing should be configured to include all required components into one file.  This can reduce the required
download size.
