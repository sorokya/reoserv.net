---
title: 'NPCs NPCs NPCs'
description: "I've spent the last few months working mainly on NPCs for reoserv. Join me while I share the latest updates!"
date: 2023-05-09T23:45:50+02:00
lastmod: 2023-05-09T23:45:50+02:00
---

![npcs](/img/news/npcs-npcs-npcs.jpg 'A player in combat with a goat')

# NPC Types

(Only showing combat npc types here. There are others for things like shops, quests, inn keepers, etc.)

| ID  | Name       | Description                                        |
| --- | ---------- | -------------------------------------------------- |
| 1   | Passive    | Won't attack unless attacked first.                |
| 2   | Aggressive | Will target, chase, and attack any nearby players. |

# NPC Logic

Every 50ms every NPC in the server has their logic updated. This happens
at a map level.

First we loop through every NPC in the map. We ignore any that are dead
since dead NPCs can't do anything.

Next we make sure that enough time has passed since the NPCs last action
based on their act_rate.

# NPC Act Rate

Now you may remember my [post](/news/2022-09-10-discoveries-and-broken-shit/)
where I shared that GameServer NPCs were much faster than EOServ. Turns
out these results were not entirely accurate. I ran the testing while
hosting GameServer on a VirtualBox VM which doesn't have the most accurate
timer virtualization.

I'd like to introduce you to Jeffy. My old Windows 2003 server.

![jeffy](/img/news/jeffy.jpg)

Jeffy is pretty bad ass. He has a dual Intel Xeon DP 5050, and 4GB of RAM.

Anyway the point is we have Jeffy now for official server testing and he
is awesome. Even made it onto the official [Endless Online credits page](https://www.endless-online.com/contributors.html)!

![jeffy-credits](/img/news/jeffy-credits.png)

After some more testing with Jeffy I can confirm that the _OFFICIAL_ act
rates for NPCs are...

| **Act Rate** | **Jeffy ❤** | **VirtualBox** | **EOSERV** |
| ------------ | ------------ | -------------- | ---------- |
| 0            | 625ms        | 400ms          | 900ms      |
| 1            | 625ms        | 400ms          | 600ms      |
| 2            | 1250ms       | 800ms          | 1300ms     |
| 3            | 1875ms       | 1200ms         | 1900ms     |
| 4            | 3750ms       | 2400ms         | 3700ms     |
| 5            | 7500ms       | 4800ms         | 7500ms     |
| 6            | 15000ms      | 9600ms         | 15000ms    |
| 7            | Frozen       | Frozen         | Frozen     |

This means EOSERV was actually a lot closer than I originally though.
Good job [Sausage](https://tehsausage.com)!

It's also worth noting that GameServer doesn't "really" time these things
in milliseconds. The original server and client are tick based. Things
happen after so many ticks have passed. Server ticks are 125ms and Client
ticks are 120ms.

| **Act Rate** | **Jeffy (ticks) ❤** |
| ------------ | -------------------- |
| 0            | 5                    |
| 1            | 5                    |
| 2            | 10                   |
| 3            | 15                   |
| 4            | 30                   |
| 5            | 60                   |
| 6            | 120                  |
| 7            | Frozen               |

# NPC Logic Continued

So if enough time has passed since the NPCs last action we check if
they need to talk, attack, and/or walk in that order.

```rust
let talk_update = self.act_npc_talk(index, npc_id);

let now = Utc::now();
let act_delta = now - last_act;
let should_act = act_delta >= Duration::milliseconds(act_rate as i64);

// Special case for Static NPCs the only action they perform is talking
// also talk updates happen independently of attack/walk actions
// always at 4800ms intervals
if act_rate == 0 || !should_act {
    (None, talk_update, None)
} else {
    let attack_update = self.act_npc_attack(index, npc_id);

    // We don't bother checking for a walk action because the NPC
    // is currently in combat
    let pos_update = if attack_update.is_some() {
        None
    } else {
        self.act_npc_move(index, npc_id, act_rate, &act_delta)
    };
    (pos_update, talk_update, attack_update)
}
```

# Walk Logic

![chasing](/img/news/chasing.png)

Non-static NPCs will idle walk unless they have a target. The idle walk
routine was shamelessly ripped from EOSERV and seems close enough to
official server behavior. Basically every walk update:

- 10% chance to stop moving for 0-3 seconds
- 30% chance to change facing direction
- Move in the direction the NPC is facing if it's [walkable](https://github.com/sorokya/reoserv/blob/18b9b48797b9478d0cc1250e35f4ef732503092b/src/map/map/is_tile_walkable_npc.rs).

For aggressive NPCs or Passive NPCs with an opponent the logic is pretty
simple.

## NPCs with opponents

- Find all the opponents in chase distance range of the NPC
- Pick the one that has dealt the most damage to the NPC
- Move in the direction of that player

## Aggressive NPCs without opponents

- Find all players in chase distance range of the NPC
- Pick the closest one
- Move in the direction of that player

# Attack Logic

![snake-hit](/img/news/snake-hit.png)

Attacking is very similar to chasing.

- Check all directly adjacent tiles from the NPC for a player
- Pick an adjacent opponent who has dealt the most damage
- If there aren't any adjacent opponents or the NPC is aggressive we pick a random adjacent player.
  - This also means that if an NPC is "blocked" from attacking an opponent it will attack any adjacent player instead.

# Damaging the Player

We do some math with the hit rate and damage formulas I mentioned in
[this](/news/2022-09-12-speech-and-stats/) post to figure out how much damage the
player takes and broadcast that info to nearby players.

If the player HP hits 0 we need to kill them. The routine for that looks
like this.

- Make player leave the map
  - This tells all nearby players that the player has left and removes them from their view
- Set character map id to 0
- Set character coords to 0,0
- Request the player warp to their spawn map and coords

One fun this is players can block the warp request packet using a proxy. The
The EO community has dubbed this map between death and respawn "Nirvana". It's
a pretty neat mechanic. REOSERV doesn't quite emulate it properly. There is
no real map 0 so players can't see/interact with each other like you could on GameServer.
I plan to add it in though just because it's cool. I can't find any old
screenshots of it or I'd share it with you but maybe another day!

# Damaging the NPC

We use the same formulas I mentioned before to figure out how much damage
a player deals to the NPC given their stats and the NPCs stats.

Attacking an NPC registers you as an opponent for attack and chase logic.

## Drops

When an NPC dies it can drop an item. NPCs can have multiple items they
can possible drop but only one item can drop at a time. At the time of death
we:

- Sort the drops rarest to least rare
- Loop over each potential drop
  - Roll a number between 0 and 64,000
  - If it's less than drop rate (a number between 0 and 64,000)
    - Pick a random amount between drop minimum and maximum amount.
    - return the dropped item id and amount

Drops are protected for some time so that only the player who is awarded
the drop can pick it up.

## Experience and Leveling Up

That's what I'm working on now! So stay tuned for my next update!
