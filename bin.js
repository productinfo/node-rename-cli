#!/usr/bin/env node
const argv = require('yargs')
    .boolean(['h', 'v', 'u', 'f', 's', 'n'])
    .alias('h', 'help')
    .alias('v', 'version')
    .alias('u', 'undo')
    .alias('f', 'force')
    .alias('s', 'sim')
    .alias('n', 'noindex')
    .argv;
const fs = require('fs-extra');
const index = require('./index');
const os = require('os');
const packagejson = require('./package.json');

const userReplacements = os.homedir() + '/.rename/replacements.js';

// check if ~/.rename/replacements.js exists, if not create it and
// then copy in the text from ./userReplacements.js
fs.ensureFile(userReplacements, err => {
  if (err) throw err;
  fs.readFile(userReplacements, 'utf8', (er, data) => {
    if (er) throw er;
    if (data === '') {
      fs.readFile(__dirname + '/lib/userReplacements.js', 'utf8', (ex, usrRep) => {
        if (ex) throw ex;
        fs.writeFile(userReplacements, usrRep, (e) => {
          if (e) throw e;
          parseArgs();
        });
      });
    } else {
      parseArgs();
    }
  });
});

function parseArgs() {
  if (argv.h) { // display help text
    let help = fs.readFileSync(__dirname + '/lib/help.txt', 'utf8');
    help = help.replace('[[replacements]]', index.getReplacements());
    console.log(help);
    process.exit(0);
  } else if (argv.v) { // print version number
    console.log(packagejson.version);
    console.log('');
    process.exit(0);
  } else if (argv.u) { // undo previous rename
    index.undoRename();
  } else { // proceed to index.js to do the rename
    index.thecommand(argv);
  }
}