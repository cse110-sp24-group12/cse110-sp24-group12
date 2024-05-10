---
# Markdown-it ADR
status: "accepted"
date: 2024/05/08
deciders: Lindsey Rappaport, Ramtin Tajbakhsh, Jordan Chang, Matthew Williams, Sophia Davis, Eban Covarrubias, Guan Huang Chen, Ibraheem Syed, Ritvik Penchala, Sidhant Singhvi, Wen Hsin Chang
informed: Jash Makhija
---
# Choosing `markdown-it` for our Markdown Library

## Context and Problem Statement

Our developer journal application utilizes markdown to store entries. We then had to decide which markdown library we were going to use for the entries.

## Considered Options

* `markdown-it`
* `Marked`
* `MDX`

## Decision Outcome

Chosen option: `markdown-it`, because
it supports extensions and plugins, and it is written in JavaScript and can be used in node.js. Along with this, `markdown-it` is very simple and fast to use, and you can quickly learn how to use it and the results are easy to read. Markdown is also very versatile, as it can be used on developer tools such as Git, and can easily be converted to pdf format, making it useful for a developer's journal. One of the downsides of using `markdown-it` is that it is harder to manage large documents in markdown, but since it is being used for journal entries, this shouldn't be an issue, since most entries will be more manageable.

### Consequences

* Good, because it is fast, easy to use, and is safe
* Bad, because does not really allow details about elements

## Pros and Cons of the Options

### `markdown-it`
Pro: A limited amount of features helps to keep formatting consistent between documents
Con: Unable to indicate classes, warnings, or other structural elements effectively

### `Marked`
Pro: light-weight while implementing all markdown features from the supported flavors & specifications
Con: Strict compliance could result in slower processing when running comparative benchmarking

### `MDX`
Pro: renders/compiles at build-time rather than at runtime
Con: although some frameworks support MDX, setup is required
