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
  return input;
}

module.exports = { post, html, youtube };
