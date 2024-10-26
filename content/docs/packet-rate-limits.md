---
title: 'Packet Rate Limits'
description: 'In this section you will learn how to change the rate limits for packets sent from players'
date: 2024-03-29T10:10:13+02:00
lastmod: 2024-04-03T10:10:13+02:00
---

Defined in [RON (Rust Object Notation)](https://docs.rs/ron/latest/ron/).

Like the main config file this can also be copied to a local file:

```sh
$ cp PacketRateLimits.ron PacketRateLimits.local.ron
```

This file is useful to prevent abuse from players (speeding, spamming, etc.)

REOSERV comes with some sensible defaults but if you'd like to change or add any others the format is

- family: [PacketFamily](https://docs.rs/eolib/latest/eolib/protocol/net/enum.PacketFamily.html)
- action: [PacketAction](https://docs.rs/eolib/latest/eolib/protocol/net/enum.PacketAction.html)
- limit: Amount of time (in miliseconds) a player must wait before sending an additional packet

_Note: the maximum limit is 1000 for now but that might change if needed_
