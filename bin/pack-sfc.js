#!/usr/bin/env node

// packsfc.js
// copy all files for the full featured web server into the dist folder
// ready to be published on http://homeding.github.io/vxx 

// ===== Packages used =====

import { readFile, writeFile, glob } from 'node:fs/promises';
import console from 'node:console';

import yargs from 'yargs';

import * as HTMLMinifier from 'html-minifier-terser';

const sfcFolder = ".";
const sfcExt = ".sfc";

// ===== Command line support =====

const options = yargs(process.argv.slice(2))
  .usage('Usage: npx pack-sfc [options] <sfc-names> ... -o <outfile>')
  .example('npx pack-sfc u-code u-toast -o all', 'pack into all.sfc')
  .example('npx pack-sfc -p=0 u-code u-toast', 'pack without minifying')
  .option('v', { alias: 'verbose', describe: 'Verbose logging', type: 'boolean', demandOption: false, default: false })
  .option('p', { alias: 'pack', describe: 'pack resulting file', type: 'boolean', demandOption: false, default: true })
  .option('o', { alias: 'outfile', describe: 'name of the output file', type: 'string', demandOption: false, default: "bundle" + sfcExt })
  .alias('help', 'h')
  .demandCommand(1)
  .argv;

// ===== initializing modules =====

// wrap component
async function wrapSFC(sfcName, pack = false) {
  let txt;
  console.log(`reading ${sfcName} ...`);

  if (!sfcName.endsWith(sfcExt)) {
    sfcName += sfcExt;
  }

  txt = await readFile(sfcFolder + '/' + sfcName, 'utf8')
  // console.log(txt);

  if (pack) {
    txt = await HTMLMinifier.minify(txt, {
      collapseWhitespace: true,
      removeComments: true,
      removeTagWhitespace: true,
      minifyCSS: true,
      minifyJS: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      verbose: true,
      quoteCharacter: "'"
    });
  }
  txt = `<sfc tag='${sfcName}'>\n${txt}\n</sfc>\n`;

  return (txt);
}

console.log(`Start bundling SFCs...`);

let txt = '';

for await (const f of glob(options._)) {
  console.log(`reading ${f} ...`);
  txt += await wrapSFC(f, options.pack);
}

console.log(`writing ${options.outfile} ...`);
await writeFile(options.outfile, txt, 'utf-8');

if (options.verbose) {
  console.log(txt);
}


console.log(`done.`);
