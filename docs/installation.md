---
title: 'Installation'
description: 'In this section you will learn how to download a prebuilt REOSERV binary or download the source code and build it yourself!'
---

## Download a prebuilt binary for your OS

REOSERV is automatically built and released for x64 Windows, Mac OS (Intel and Apple Silicon), and x64 Linux (GNU and MUSL).

You can find a release zip or tarball for your OS at the latest release page on GitHub:

https://github.com/sorokya/reoserv/releases/latest

Once downloaded simply extract the binary archive to your desired installation location.

## Build REOSERV from source

REOSERV is written in rust and rust is the only build time dependency.

To get rust I recommend using [rustup](https://rustup.rs).

For Windows users you can download and run [rustup-init.exe](https://win.rustup.rs/x86_64) then follow the onscreen instructions.

For WSL/Linux/Mac OS you can run the following shell script and follow the prompts.

```bash
$ curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

<br />

### Getting the source code

Once you have installed rust you can get the REOSERV source code by either:

Cloning the GitHub repository (recommended)

```bash
$ git clone https://github.com/sorokya/reoserv
```

Or you can download the latest code as a zip from GitHub

https://github.com/sorokya/reoserv/archive/refs/heads/master.zip

### Building REOSERV

Once you have the source code in a directory on your machine simply run:

```bash
cargo build
```

<br />

Click [here](/docs/database) to continue with the database setup.
