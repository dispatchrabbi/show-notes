const promisify = require('util').promisify;
const fs = require('fs');

const transforms = require('./transforms.js');
const OUTPUT_TYPES = Object.keys(transforms);

// get and parse command-line arguments
const argv = require('minimist')(process.argv.slice(2));
const outputType = argv['t'];

if(argv['h'] || argv['help']) {
  // help was requested; print the usage note and exit
  printUsage();

  process.exitCode = 0;
  return;
} else if(!OUTPUT_TYPES.includes(outputType)) {
  // an invalid or non-existent type was given; print an error, helpful usage note, and exit with non-zero status
  console.error(`Unrecognized or blank output type provided: ${outputType}`);
  printUsage();

  process.exitCode = 1;
  return;
}

promisify(fs.readFile)(process.stdin.fd, { encoding: 'utf-8' })
  .then(function(input) {
    // TODO: filter/sanitize the input
    return input;
  })
  .then(function(sanitizedInput) {
    return transforms[outputType](sanitizedInput);
  })
  .then(function(output) {
    console.log(output);
    process.exitCode = 0;
  })
  .catch(function(err) {
    console.error(err.message);
    process.exitCode = 2;
  });

function printUsage() {
  console.error(`Usage: show-notes -t <type>`);
  console.error(`show-notes takes input markdown via stdin and transforms it to the given type.`);
  console.error(`-t\tThe type of output to produce. Valid values: ${OUTPUT_TYPES.join(', ')}`);
  console.error(`-h\tPrint this help message.`);
}
