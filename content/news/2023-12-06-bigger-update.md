---
title: 'Bigger update!'
description: "Remember that big list of stuff left to do? It's a lot smaller now"
date: 2023-12-06T11:03:28+02:00
lastmod: 2023-12-06T11:03:28+02:00
---

I've been having a blast implementing the missing features I mentioned in the
[last](/news/2023-10-11-big-update) update.

## So what's new in REOSERV?

### Features ✨

- Switched to [Argon2id](https://en.wikipedia.org/wiki/Argon2) password hashing
- Lockers and Bank Bob fully implemented
- Town Boards implemented
  - Stole the timestamp display idea from [EOSERV](https://eoserv.net)
- Reporting and "Speak to admin" features implemented
  - Based off [EOSERV](https://eoserv.net) (reports/messages go to admin board and admin chat)
- #ping command implemented
- Client will now show online friends
- Admin hide command implemented
  - Should be completely invisible to players and NPCs (even if player is sniffing packets)
- Changed to tick based timers for most server events
- Timed quake events implemented
- Implemented spike damage and timed spike events
- Implemented timed hp/tp drain events
- Implemented timed warp "suck" (players adjacent to warp tiles will auto warp after so long)
- Door open state is now tracked on the server
  - This prevents players from walking through closed doors
  - Also prevents players from being "sucked" into closed door warps
- Implemented timed save for all players
- Implemented map relog coordinates (used to reset a player's position after logging back in to a map)
- Implemented server rescue map if player attempts to login to an invalid map
- Server side validation for door and chest keys
- Inn keeper system implemented
  - Players can now register and cancel citizenship, and sleep at inn keeper npcs
- Implemented player trading system
- Implemented player parties
  - Using party exp share formula that was derived from GameServer
- Implemented ranged weapons
- Implemented arena system
- Players can now change their account password
- Optionally freeze NPCs that are out of range of players (GameServer behavior)
- Pub files can now be generated from JSON (JSON can be created with new tool [pub2json](https://github.com/sorokya/pub2json))
- Admin moderation commands implemented
  - $ban player [duration] (IP and account ban)
  - $kick player
  - $jail player (also works for offline player)
  - $free player (also works for offline player)
  - $freeze player (client side only)
  - $unfreeze player (client side only)
  - $mute player (client side only)
  - $global (toggle global channel lock)

### Bug fixes 🐛

- Fixed adding items to chests
- Chests are now created when maps are loaded rather than the first time the spawn items event triggers
- No longer sending player walk packets to the player that walked
  - This caused laggy client behavior that wasn't noticable on localhost

### Code cleanup 🧹

- Created Dockerfile
- Switched to rustls for tls encryption
  - This allows the program to easily be containerized

## What's left?

REOSERV is just missing a few larger features now

- Kill steal protection system
- Guild system
- Anti-speed system
- Boss & Minion system
- Law & Marriage
- Quest system

Hope you enjoyed this update! I'll try to get the next one out soon 😜
