#!/usr/bin/env node

// pack-sfc.js
// copy all files for the full featured web server into the dist folder
// ready to be published on http://homeding.github.io/vxx 

// ===== Packages used =====

import { readFile, writeFile, glob } from 'node:fs/promises';
import console from 'node:console';

import yargs from 'yargs';

import * as HTMLMinifier from 'html-minifier-terser';
import { existsSync } from 'node:fs';

const sfcFolder = ".";
const sfcExt = ".sfc";

// ===== Command line support =====

const options = yargs(process.argv.slice(2))
  .usage('Usage: npx pack-sfc [options] <sfc-names> ... -o <outfile>')
  .example('npx pack-sfc u-code u-toast -o all', 'pack into all.sfc')
  .example('npx pack-sfc -p 0 u-code u-toast', 'pack without minifying')
  .option('v', { alias: 'verbose', describe: 'Verbose logging', type: 'boolean', demandOption: false, default: false })
  .option('p', { alias: 'pack', describe: 'pack resulting file', type: 'boolean', demandOption: false, default: true })
  .option('o', { alias: 'outfile', describe: 'name of the output file', type: 'string', demandOption: false, default: "bundle" + sfcExt })
  .alias('help', 'h')
  .demandCommand(1)
  .argv;

if (options.verbose) {
  console.log("argv:", process.argv.join(' '))
  console.log("parsed options:", options)
}

// ===== initializing modules =====

// wrap component
async function wrapSFC(sfcName, pack = false) {
  let txt;
  let tagName = sfcName.replace(/\.sfc$/, '');

  // extract tag name from path
  tagName = tagName.substring(tagName.lastIndexOf('\\') + 1);
  tagName = tagName.substring(tagName.lastIndexOf('/') + 1);

  if (!sfcName.endsWith(sfcExt)) {
    sfcName += sfcExt;
  }

  const filePath = sfcFolder + '/' + sfcName;
  if (! existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    process.exit(1);
  }

  console.log(`defining ${tagName} from file ${filePath} ...`);

  txt = await readFile(filePath, 'utf8');
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
  txt = `<sfc tag='${tagName}'>\n${txt}\n</sfc>\n`;

  return (txt);
}

console.log(`Start bundling SFCs...`);

let txt = '';

for (const p of options._) {
  if (options.verbose) console.log(`processing ${p} ...`);
  if (!p.startsWith('@')) {
    const matches = [];
    if (p.includes('*') || p.includes('?') || p.includes('[')) {
      for await (const match of glob(p)) matches.push(match);
    }
    for (const name of matches.length ? matches : [p]) {
      txt += await wrapSFC(name, options.pack);
    }

  } else {
    // read file p[1...] and treat every line as a SFC name, use '//' to comment out empty lines
    const filePath = p.substring(1);
    if (! existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      process.exit(1);
    }
    console.group(`reading file ${filePath} ...`);
    const lines = (await readFile(filePath, 'utf8')).split('\n');
    for (const line of lines) {
      if (line.startsWith('//')) continue;
      if (line.trim()) {
        txt += await wrapSFC(line.trim(), options.pack);
      }
    }
    console.groupEnd();
  }
} // for

console.log(`writing ${options.outfile} ...`);
await writeFile(options.outfile, txt, 'utf-8');

if (options.verbose) {
  console.log(txt);
}


console.log(`done.`);
