# show-notes

Transform podcast show notes into different formats for different channels.

## Description

This script takes a chunk of markdown as input and transforms it to produce various outputs:

- markdown for posting on a Jekyll-based website
- HTML for distribution via RSS
- text suitable for a YouTube video description

## Usage

```sh
$ show-notes -t markdown < ./notes.md
$ show-notes -t html < ./notes.md
$ show-notes -t youtube < ./notes.md
```

### CLI flags

| Flag | Description |
|---|---|
| -t | The type of output to produce. Valid values are `markdown`, `html`, and `youtube`. |

## TODO

I'm basically writing this TDD-style, since I have an end goal and know what I'm working toward. Here are the big steps:

- [ ] Get input and CLI flags working
- [ ] Make markdown output work
- [ ] Make HTML output work
- [ ] Make YouTube text output work
- [ ] Filter/sanitize input against allowed elements
