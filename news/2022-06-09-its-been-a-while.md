---
title: 'Its Been a While'
description: "I haven't been working on reoserv as much as I'd like these past months."
date: 2022-06-09T05:41:07+02:00
lastmod: 2022-06-09T05:41:07+02:00
---

I finally re-opened the project last week and started toying around with NPCs. Sadly I didn’t get any appearing in the game yet. I wanted to do some research first and see how eoserv had implemented the feature.

There isn’t really much documentation around on how NPC behavior works exactly. Eoserv’s implementation works and is close enough to how the original server worked but I wanted to do my own experiments and see what I could gather.

# Spawn times

I first wanted to test how NPCs spawn in the game. There is a field in the NPC [spawn record](https://docs.rs/eo/latest/eo/data/map/struct.NPCSpawn.html) we call respawn_time. It’s been known to corrospond to number of seconds after an NPC dies that a new one is spawned.

This wasn’t what I saw when testing with the original game server though. The first time an NPC spawned it would always match the number. If I set a goat to spawn after 30 seconds then the goat would spawn 30 seconds after the map loaded.

But, after killing a the goat it would not re-appear immediately after 30 seconds. There seemed to be a random addition of 0-20 seconds. Some people in the EO Dev discord said this could be because the NPC just didn’t send a “action” packet that would make it appear in the game client and this could be true. I still need to do further testing on this one.

# Speech

There is a rate value in each NPC [speech record](https://docs.rs/eo/latest/eo/data/pubs/struct.TalkRecord.html) that is currently not understood. I believe it has something to do with the start delay of when an NPC in a spawn group will first speak.

After the initial message is spoke the NPC will speak again every 25 seconds on the dot.

# Kill-steal protection / Player targeting

Eoserv does not implement Kill-steal protection. A system in the original game that locked killable NPCs to a player so that a higher level player couldn’t “steal” the kill and the EXP+Items that come with it.

I found the way that the NPC targets players to be pretty interesting. It will of course target and keep attacking the original attacker but will get bored after 20 seconds. If no other player attacked in those 20 seconds the NPC will go back to passive wandering mode.

But, if another player tried attacking while the NPC was protected and then gets “bored” of the first attacker it will switch target to the player who attacked.

The interesting bit which I’m not exactly sure how is triggered is an NPC seems to permanently target a list of players who have attacked it. Even through death! If a player is killed by the NPC and then returns to the map the NPC will target it again. This is pretty neat behavior that doesn’t happen in eoserv. I’ll need to do further testing to figure this out.

# What am I doing next?

I want to continue focusing on NPCs and getting them alive and working in the game I feel it will add an essential feature to the server and really make the game feel alive :)
