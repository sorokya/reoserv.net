---
title: 'Arenas'
description: 'In this section you will learn how to define PvP arenas for your server'
---

Defined in [RON (Rust Object Notation)](https://docs.rs/ron/latest/ron/).

Like the main config file this can also be copied to a local file:

```sh
$ cp Arenas.ron Arenas.local.ron
```

Each arena has the following data:

- `map`: Map where the arena is
- `rate`: Number of seconds before spawning players into the arena
- `block`: If there are less players in the arena than this number then more players can join by waiting in a spawn point
- `spawns`: A list of spawn points (x,y) and where they teleport the player to in the arena (x,y)

### Example of the main red arena in vanilla EO

```rust
(
  map: 46,
  rate: 720,
  block: 4,
  spawns: [
	( from: ( x: 11, y: 44 ), to: ( x: 12, y: 24 ) ),
	( from: ( x: 13, y: 44 ), to: ( x: 12, y: 17 ) ),
	( from: ( x: 15, y: 44 ), to: ( x: 12, y: 10 ) ),
	( from: ( x: 17, y: 44 ), to: ( x: 18, y: 24 ) ),
	( from: ( x: 19, y: 44 ), to: ( x: 18, y: 10 ) ),
	( from: ( x: 21, y: 44 ), to: ( x: 24, y: 24 ) ),
	( from: ( x: 23, y: 44 ), to: ( x: 24, y: 17 ) ),
	( from: ( x: 25, y: 44 ), to: ( x: 24, y: 10 ) ),
  ]
)
```
