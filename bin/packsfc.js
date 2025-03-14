#!/usr/bin/env node

// packsfc.js
// copy all files for the full featured web server into the dist folder
// ready to be published on http://homeding.github.io/vxx 

// ===== Packages used =====

import { readFile, writeFile } from 'node:fs/promises';
import console from 'node:console';

import yargs from 'yargs';

import * as HTMLMinifier from 'html-minifier-terser';

const sfcFolder = ".";
const sfcExt = ".sfc";

// ===== Command line support =====

const options = yargs(process.argv.slice(2))
  .usage('Usage: $0 [options] <sfc-names> ...')
  .option('v', { alias: 'verbose', describe: 'Verbose logging', type: 'boolean', demandOption: false, default: false })
  .option('p', { alias: 'pack', describe: 'pack resulting file', type: 'boolean', demandOption: false, default: true })
  .option('o', { alias: 'outfile', describe: 'name of the output file', type: 'string', demandOption: false, default: "bundle" + sfcExt })
  .demandCommand(1)
  .argv;

// ===== initializing modules =====

// wrap component
async function wrapSFC(sfcName, pack = false) {
  let txt;
  console.log(`reading ${sfcName} ...`);

  txt = await readFile(sfcFolder + '/' + sfcName + sfcExt, 'utf8')
  // console.log(txt);

  if (pack) {
    txt = await HTMLMinifier.minify(txt, {
      collapseWhitespace: true,
      removeComments: true,
      removeTagWhitespace: true,
      minifyCSS: true,
      minifyJS: true,
      verbose: true,
      quoteCharacter: "'"
    });
  }
  txt = `<sfc tag='${sfcName}'>\n${txt}\n</sfc>\n`;

  return (txt);
}

console.log(`Start bundling SFCs...`);

let txt = '';

for (const c of options._) {
  txt += await wrapSFC(c, options.pack);
}

console.log(`writing ${options.outfile} ...`);
await writeFile(options.outfile, txt, 'utf-8');

if (options.verbose) {
  console.log(txt);
}


console.log(`done.`);
