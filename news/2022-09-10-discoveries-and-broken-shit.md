---
title: 'Discoveries and Broken Shit'
description: 'Did some more NPC research with GameServer and had a very rough first implementation of NPC movements'
date: 2022-09-10T05:55:30+02:00
lastmod: 2022-09-10T05:55:30+02:00
---

# What's up with NPC movement speed?

In my testing with GameServer I noticed that certain NPCs moved
a lot faster than they do on the [clone server](https://game.eoserv.net). Especially biters underneath the
aeven grocery compare the speed between clone and gameserver below.

Biter speed on clone server
{{<video ratio="16x9" attributes="controls" mp4-src="/mp4/news/eo-clone.mp4">}}

Biter speed on GameServer.exe
{{<video ratio="16x9" attributes="controls" mp4-src="/mp4/news/game-server.mp4">}}

You can see there's a HUGE difference. [Here's a youtube video](https://youtu.be/cWwcnI1m6cc?t=111) from 2015
showing the same mobs moving. It might seem a bit slower but that could be due to:

- AI pathing to multiple targets
- Ping between the player and server
- Server load

# Recording the data

So we know that NPCs moved faster on the original server but how do we record the speed?

At first I turned to existing tools like Plasmastar's EOStarProxy which can print timestamps of when packets are received from
the server. This wasn't going to be good enough though because it only printed the timestamp to the current second
and these packets come in multiple times per second.

![eostarproxy](/img/news/eostarproxy.png 'Timestamps are there but only in seconds')

# A new proxy

I created a new proxy using the existing [eo](https://github.com/sorokya/eo) crate in just an hour or two.

{{<video ratio="16x9" attributes="controls" mp4-src="/mp4/news/new-proxy.mp4">}}

It's pretty basic but it got the job done. With this I was able to accurately measure the rate at which
NPC update packets were coming in from the server.

# The results

Below are the results of the 8 different speed value types for NPC spawns.

| **Speed** | **GameServer.exe** | **EOServ (config/npc.ini)** |
| --------- | ------------------ | --------------------------- |
| 0         | 400ms              | 900ms (+500ms)              |
| 1         | 400ms              | 600ms (+200ms)              |
| 2         | 800ms              | 1300ms (+500ms)             |
| 3         | 1200ms             | 1900ms (+700ms)             |
| 4         | 2400ms             | 3700ms (+1300ms)            |
| 5         | 4800ms             | 7500ms (+2700ms)            |
| 6         | 9600ms             | 15000ms (+5400ms)           |
| 7         | Frozen             | Frozen                      |

# A shoddy implementation

I was feeling great after this discovery and quickly went to implement basic NPC movements
in [reoserv](https://github.com/sorokya/reoserv). The results are.. pretty funny!

{{<video ratio="16x9" attributes="controls" mp4-src="/mp4/news/broken.mp4">}}
