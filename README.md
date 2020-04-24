# show-notes

Transform podcast show notes into different formats for different distribution channels.

## Description

This script takes a chunk of markdown as input and transforms it to produce various outputs:

- markdown suitable for posting on a Jekyll-based website
- HTML for distribution via RSS
- text suitable for a YouTube video description

## Usage

```sh
$ show-notes -t post < ./notes.md
$ show-notes -t html < ./notes.md
$ show-notes -t youtube < ./notes.md
```

### CLI flags

| Flag | Description |
|---|---|
| -t | The type of output to produce. Valid values are `post`, `html`, and `youtube`. |
