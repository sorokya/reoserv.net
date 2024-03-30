# Reoserv.net documentation home

This website hosts the documentation for the [reoserv](https://github.com/sorokya/reoserv) project (authored and maintained by [sorokya](https://github.com/sorokya))

## Prerequisites

Before you can run this project, you need to have the following installed on your machine:

- [Node.js](https://nodejs.org/) v20+ (for local development with the Remix web framework)
- [Bun](https://bun.sh/) v1.0.36+ (a modern package manager & script runner for Node.js projects)

Verify that both are setup on your system and meet our version requirements by running:

```sh
bun --version    # eg: 1.0.36
node --version   # eg: v20.4.0
```

## Installation

To install dependencies, run:

```sh
bun install
```

## Local development

To start the remix dev server, run:

```sh
bun run dev
```

This starts the dev server on the port 3030 - visit http://localhost:3030 in your web browser to see the website up and running!

## Building for production

To build the project, run:

```sh
bun run build
```
