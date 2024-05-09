---
# ESlint ADR  
status: "accepted"
date: 2024/05/08
deciders: Lindsey Rappaport, Ramtin Tajbakhsh
consulted: Lindsey Rappaport, Ramtin Tajbakhsh
informed: Lindsey Rappaport, Ramtin Tajbakhsh
---
# Choosing `eslint-config-airbnb-base` as our ESlint Configuration  

## Context and Problem Statement  

ESLint configurations ensure consistent uniform coding standards, error prevention, and customization options. They help teams improve and maintain their code quality and follow best JavaScript practices. We wanted to decide on which ESlint configuration to use for our project.  

## Considered Options

* `eslint-config-airbnb-base`  
* `eslint-plugin-markdown`  
* `eslint-plugin-node`  

## Decision Outcome

Chosen option: `eslint-config-airbnb-base`. We chose `eslint-config-airbnb-base` because of its very extensive coverage of JavaScript best practices. It provides a strong foundation for maintaining our code’s quality in our Electron-wrapped DevJournal app. `eslint-plugin-markdown` and `eslint-plugin-node` serve more specific purposes, but we need to prioritize consistent JavaScript standards/practices for our project, so `eslint-config-airbnb-base` is the option we decided on.

### Consequences

* Good, because it will lead to enhanced code consistency and compliance with industry practices, improving overall code and project quality.  
* Bad, because it could potentially create a slight learning curve for team members who are unfamiliar with Airbnb's coding conventions.  

## Pros and Cons of the Options

### `eslint-config-airbnb-base`  

* Pro: Provides code consistency and follows industry best practices and JS standards.
* Con: May cause a learning curve due to its strict rules.

### `eslint-plugin-markdown`  

* Pro: Ensures consistent formatting/linting for Markdown code blocks.
* Con: Limited scope of application and usefulness, mainly useful for Markdown-specific linting.

### `eslint-plugin-node`    

* Pro: Provides rules tailored to a Node.js environment.
* Con: Could have irrelevant rules for a project like ours where Node.js is mostly utilized for unit testing rather than core functionality.
