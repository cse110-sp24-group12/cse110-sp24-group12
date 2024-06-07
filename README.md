# Infinite Loops Developer Journal

Welcome to the Thanos Developer Journal! Inspired by the formidable and balanced approach of the Mad Titan, our journal is designed to help developers keep track of their daily accomplishments, challenges, and progress. This project aims to provide a structured and efficient way to document your development journey, much like Thanos’ methodical quest for the Infinity Stones. Whether you're conquering bugs, building new features, or refining your code, the Thanos Developer Journal is your companion in achieving balance and excellence in your workflow.

Also if you don't know who Thanos is, here is a picture:

<img src="admin/branding/mascot-thanos.jpeg" width=200>

## Table of Contents
- [Infinite Loops Developer Journal](#infinite-loops-developer-journal)
  - [Table of Contents](#table-of-contents)
  - [Important Links](#important-links)
  - [Dependencies used in this project](#dependencies-used-in-this-project)
  - [Instructions to run this project locally (for developers)](#instructions-to-run-this-project-locally-for-developers)
  - [Repo Organization](#repo-organization)

## Important Links

- Our [team](admin/team.md) page
- Designs on Figma: [<img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTx28mg8aQ39CEGURVztotd5VC0bO7Ik-ZpBw&s" width=60>](https://www.figma.com/design/Vcmpxe7RRHcT9bNZ1PNhe7/Brainstorm?node-id=0-1&m=dev)
- Miro board: [<img src="https://1000logos.net/wp-content/uploads/2023/10/Miro-Logo.jpg" width=60>](https://miro.com/app/board/uXjVKSQWSxU=/)

## Dependencies used in this project

- `Electron`: We used Electron as the main framework for our web application because it allows us to have a more local-first approach and access the files in the local file-system. Read this [ADR](specs/adrs/050924-why-electron.md) for more on our reasoning behind this decision
- `markdown-it`: We used this library for real time markdown rendering of the users' journals. The reason we chose this library over others can be found in this [ADR](specs/adrs/050924-markdown-it.md)
- `markdown-it-task-lists`: the `markdown-it` library by itself doesn't render task lists but with this extension we'll be able to render them as checkboxes
- `highlight.js`: To render code blocks in different programming languages in markdown
- `crypto.js`: To encrypt and decrypt the password for security reasons

## Instructions to run this project locally (for developers)

1. Clone the repo:

```sh
git clone https://github.com/cse110-sp24-group12/cse110-sp24-group12
```

2. install the required packages in the `source` directory

```sh
cd source
npm install
```

3. Run electron

```sh
npm start
```
## Repo Organization

- [admin](admin): Contains administrative information about our team and the process we followed to do the project
  - [branding](admin/branding): Logo and mascot
  - [cipipeline](admin/cipipeline/): Diagram and video going over the CI/CD pipeline of our project
  - [headshots](admin/headshots/): Headshots of all of our group members
  - [meetings](admin/meetings/): Meeting notes of all of our sprint reviews, retrospectives, and TA meetings
- [specs](specs): Contains brainstorming material and decision records for the project
  - [adrs](specs/adrs/): Architectural Decision Records that we made for the project
  - [brainstorm](specs/brainstorm/): Raw brainstorming material collected from our Miro board
  - [pitch](specs/pitch/): Our pitch that was delivered to the TA before starting the project
- [source](source): Contains the source code of the project (this one is self-explanatory so we won't have sub items here)