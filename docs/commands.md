---
title: 'Commands'
description: 'In this section you will learn how to change the permissions of admin commands'
---

Defined in [RON (Rust Object Notation)](https://docs.rs/ron/latest/ron/).

Like the main config file this can also be copied to a local file:

```sh
$ cp Commands.ron Commands.local.ron
```

The only thing you should change here is the `admin_level` field for each command. Don't change/add anything else
unless you're also modifying the `handle_command.rs` file in the source code.

`admin_level` defines the minimum AdminLevel required to use a command.

A list of the levels can be found in the eolib documentation https://docs.rs/eolib/latest/eolib/protocol/enum.AdminLevel.html
