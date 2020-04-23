const assert = require('assert');
const fs = require('fs');

const transforms = require('../transforms.js');

describe('post transform', function() {
  // TODO: the reference implementations should probably eventually be strings stored here rather than in files
  it('works against the reference implementation', function() {
    const expected = fs.readFileSync('reference/post.md', { encoding: 'utf-8' });

    const input = fs.readFileSync('reference/input.md', { encoding: 'utf-8' });
    const actual = transforms.post(input);

    assert.equal(actual, expected);
  });
});

describe('html transform', function() {
  // TODO: the reference implementations should probably eventually be strings stored here rather than in files
  it('works against the reference implementation', function() {
    const expected = fs.readFileSync('reference/anchor.html', { encoding: 'utf-8' });

    const input = fs.readFileSync('reference/input.md', { encoding: 'utf-8' });
    const actual = transforms.html(input);

    assert.equal(actual, expected);
  });
});

describe('youtube transform', function() {
  // TODO: the reference implementations should probably eventually be strings stored here rather than in files
  it('works against the reference implementation');
});
