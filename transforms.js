const unified = require('unified');
const parse = require('remark-parse');
const remark2rehype = require('remark-rehype');
const sanitize = require('rehype-sanitize');
const format = require('rehype-format');
const stringify = require('rehype-stringify');

const cheerio = require('cheerio');

function post(input) {
  let output = input.trim();

  // first, add a page fold in front of the first empty line.
  const firstBlankLine = output.indexOf('\n\n') + 1;
  output = output.substring(0, firstBlankLine) + '<!--more-->\n' + output.substring(firstBlankLine);

  // then, add frontmatter
  const frontmatter = `---
layout: post
title: ""
tags: [episode, normal episode]
embed:
---
`;

  output = frontmatter + '\n' + output + '\n';

  return output;
}

function html(input) {
  const processor = unified()
    .use(parse)
    .use(remark2rehype)
    .use(sanitize, {
      tagNames: ['h2', 'p', 'ul', 'ol', 'li', 'a', 'strong', 'em', 'b', 'i'],
    })
    .use(format)
    .use(stringify);

    let output = processor.processSync(input).toString();

    // remove mailto: links
    output = output.replace(/<a href="mailto(?:.*)">(.*)<\/a>/, '$1');

    // for some reason, rehype-stringify adds an extra blank line at the top
    return output.trim() + '\n';
}

function youtube(input) {
  let inputLines = input.split('\n');

  // I guess I'm not getting away without building a state machine. Here we go.
  // - if a line begins with "- ", collect it into the list of list items
  // - if a line doesn't begin with "- ", process the list of list items nd then output the current line
  // - processing the list of list items means delinking the item, adding links as subsequent lines, and inserting lines between items
  // - the attribution to Kevin McLeod is a special case.

  let output = '';
  let currentListItems = [];
  inputLines.forEach(function(line) {
    if(line.startsWith('- ')) {
      currentListItems.push(line);
      return;
    }

    // process list items
    const itemSets = currentListItems.map(function(item) {
      const links = [];
      let delinkedLine = item.replace(/\[(.*?)\]\((.*?)\)/g, function(match, linkText, linkHref) {
        links.push(linkHref);
        return linkText;
      });

      // this regex puts a : on the ends of lines with links that don't end with sentence-ending punctuation
      if(links.length) {
        delinkedLine = delinkedLine.replace(/([^!?.:])$/i, '$1:');
      }

      return { line: delinkedLine, links };
      // return [ delinkedLine, ...links ].join('\n') + (links.length ? '\n' : '');
    });

    const anyLinks = itemSets.some(item => item.links.length);
    const listOutput = itemSets
      .map(item => { return [ item.line, ...item.links ].join('\n'); }) // output the list item all in one chunk
      .join(anyLinks ? '\n\n' : '\n') // if it has multiple lines, put a blank line between list items
      + (currentListItems.length ? '\n' : ''); // add a blank line after lists

    // special-case the musical attribution line:
    if(line.includes('Our music is')) {
      line = line.replace(
        'Our music is ["Covert Affair" by Kevin MacLeod](https://incompetech.filmmusic.io/song/3558-covert-affair/).',
        'Our music is "Covert Affair" by Kevin MacLeod: https://incompetech.filmmusic.io/song/3558-covert-affair/'
      );
    }

    output += listOutput;
    output += line + '\n';

    currentListItems = [];
  });

  return output.trim() + '\n';
}

module.exports = { post, html, youtube };
