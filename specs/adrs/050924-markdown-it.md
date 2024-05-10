---
# Markdown-it ADR
status: "accepted"
date: 2024/05/08
deciders: Lindsey Rappaport, Ramtin Tajbakhsh, Jordan Chang, Matthew Williams, Sophia Davis, Eban Covarrubias, Guan Huang Chen, Ibraheem Syed, Ritvik Penchala, Sidhant Singhvi, Wen Hsin Chang
informed: Jash Makhija
---
# Choosing `markdown-it` for our Markdown Library

## Context and Problem Statement

Our developer journal application utilizes markdown to store entries. We then had to decide which markdown library we were going to use for the entries that best fit our desired features.

## Considered Options

* `markdown-it`
* `Marked`
* `MDX`

## Decision Outcome

Chosen option: `markdown-it`, because it supports extensions and plugins like syntax highlighting in code snippets and footnotes to describe images, while being written in JavaScript, meaning that it is usable in node.js. Along with this, `markdown-it` is very simple and fast to use, meaning that you can quickly learn how to use it and the results are easy to read. Markdown is also very versatile, as it can be used on developer tools such as Git, and can easily be converted to pdf format, making it useful for a developer's journal. One of the downsides of using `markdown-it` is that it is harder to manage large documents in markdown, but since it is being used for journal entries, this shouldn't be an issue, since most entries will be more manageable.

### Consequences

* Good, because it is fast, easy to use, gives the perfect amount of creative freedom, makes for easy file conversion, and is safe
* Bad, because it does not really allow details about elements, and can get complicated depending on how many plugins you choose to implement. 

## Pros and Cons of the Options

### `markdown-it`
Pro(s): A limited amount of features helps to keep formatting consistent between documents and stop the user from getting lost in the documentation <br>
Con(s): Unable to indicate classes, warnings, or other structural elements effectively

### `Marked`
Pro(s): light-weight while implementing all markdown features from the supported flavors & specifications <br>
Con(s): Strict compliance could result in slower processing when running comparative benchmarking

### `MDX`
Pro(s): renders/compiles at build-time rather than at runtime <br>
Con(s): although some frameworks support MDX, setup is required

