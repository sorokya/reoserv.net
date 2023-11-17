---
title: 'Big update!'
description: "It's been a while and I've recently been back at it again adding lots of missing features and fixing bugs."
date: 2023-10-11T16:03:28+02:00
lastmod: 2023-10-11T16:03:28+02:00
---

I'll be honest. I got a little burnt out on reoserv. Lots of stuff has happened since my last post.

- Vult-r has launched the new main server [Endless Online "Recharged"](https://endless-online.com/)
- I got distracted and made a 0.4.x compatible proxy with a web app GUI
- Vult-r updated the protocol/encoding multiple times and broke our fun new toys
- Cirras has announced a new server emulator! Croissant 🥐
  - It's being written in Java and using a similar actor model to reoserv. I'm excited to see how it
    goes as he develops and releases it.

# So what's new in REOSERV?

## Features ✨

- Killing monsters now grants experience and players can level up
- Players can spend stat points to level up their stats
- Players can now interact with shop keeper NPCs to trade and craft items
- Players can now sit and stand from chairs
- Players can now interact with skill master NPCs to learn skills, forget skills, and reset their character
- Players can now cast healing and combat spells 🪄
  - Limited to PvE combat for now
- Players can now open and deposit items into their bank vault
  - But they can't take anything out yet 😅

## Bug fixes 🐛

- Fixed Server side range checks
  - NPCs shouldn't "disappear" from player view without manually refreshing
  - Ghost Players/NPCs shouldn't appear near the edges of your screen
- Fixed a bug with NPC chase behavior so they will attempt to move around obstacles
  - This still needs some work. NPCs can get caught in a loop where they just walk back and forth if there's another NPC
    blocking their path
- Fixed NPC spawn logic so they should spawn in bounds of walls/npc walls
- Fixed player weight issues when dropping/picking up items from the ground
  - Player weight should now always be capped at 250
- Fixed player death code so that NPCs drop the player from their opponent list after death
- Fixed NPC damage handler so that a "Miss" attack still registers the player as an opponent
- Fixed character loading code so that necklace equipment properly loads

## Code cleanup 🧹

- Packet handlers now take the existing StreamReader object, rather than allocating a new one
- Replaced the giant pattern match statement for packet handlers with individual modules for each family.
  - This makes the code a lot more readable
  - Like EOSERV you can now find all the handlers for a particular packet family in one file
- Got rid of most of the `debug!` statements in the code base. I felt they didn't really add much value and just
  made the output noisy
- Split up the character struct implementation into smaller modules to make my editor more happy when changing them

# What's left?

REOSERV is getting closer and closer to feature complete, but there is still **so much** to do.

- Finish player vault handlers
- Bank NPC handlers
- Party system
- Player trading
- Kill steal protection system
- Guild system
- Town boards
- Anti-speed system
- Timed map events
  - Spikes
  - Earthquakes
  - HP/TP Drain
  - Warp "Suck" (being warped if you stand next to a warp tile for too long)
- Boss & Minion system
- Moderation commands (kick, jail, ban, mute, player info)
- Admin interaction (reports, messages)
- Admin commands (hide/unhide, map mutation)
- Player commands (#find, #ping)
- Law & Marriage
- Quest system

# Release?

I don't expect anyone to use REOSERV in its current state, but I do want to begin releasing updates
and updating the documentation on how to set it up.

We've been version 0.0.0 since I started and it's starting to bother me.. 😅

Hope you enjoyed this update! I'll try to get the next one out soon 😜
