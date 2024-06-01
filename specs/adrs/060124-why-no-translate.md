---
status: "accepted"
date: 2024-06-01
deciders: Lindsey Rappaport, Ramtin Tajbakhsh
consulted: Lindsey Rappaport, Ramtin Tajbakhsh, Sophia Davis, Eban Covarrubias
informed: Entire team
---
# Decision to Not use Translate Function

## Context and Problem Statement

We wanted to decide whether or not to use a translate function on our app since we were having issues getting it to work with Electron.

## Decision Drivers

* Electron web security prevents the Google translate widget from working
* Trying to fix said web security would negate the intentions of using Electron

## Considered Options

* Manually create translate function 
* Try to work around Electron web security for the Google widget
* Scratch the idea of using the translate function due to time restraints and focus on other parts of the project that are more achievable

## Decision Outcome

Chosen option: "Scratch the idea of using the translate function due to time restraints and focus on other parts of the project that are more achievable", because
we could not successfully get our widget to appear in Electron and we felt that our time would be better spent on other areas of the project.

### Consequences

* Good, because we can focus on other parts of the project
* Bad, because we are losing a feature

## Pros and Cons of the Options

### Manually create translate function

* Good, because we would have a translate function
* Bad, because manually inputting every language would take an extremely long time 

### Try to work around Electron web security for the Google widget

* Good, because we would have a translate function
* Bad, this negates the whole reason we wanted to use Electron and sacrifices our security 

### Scratch the idea of using the translate function due to time restraints and focus on other parts of the project that are more achievable

* Good, because we can save time and work on finalizing other parts of the project
* Bad, because we no longer have a translate function 

## More Information

The team discussed the maatter and decided that given the time constraints, it would be best to scratch the feature and move on to finalizing other pieces of the project.
