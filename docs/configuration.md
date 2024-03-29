---
title: 'Server Configuration'
description: 'In this section you will learn how to configure your server'
---

REOSERV uses [TOML](https://toml.io/en/) as the configuration language.

Similar to [EOSERV](https://eoserv.net) you can create a copy of the configuration file to avoid checking in to source control.

```bash
$ cp Config.toml Config.local.toml
```

Most keys are either self explanatory or have a comment explaining them.

We'll go over the sections you'll likely want to modify now.

## Server

- host: Leave as `0.0.0.0` if you want anyone to be able to connect to your server
- port: The default port is `8078` the same default port the vanilla client uses
- generate_pub: Default is `false` but you might want to enable this if you plan to use JSON files for your data
- num_of_maps: Change to highest map ID for your server

## Database

- host: Defaults to `127.0.0.1`. Change this to the address of your database server if it's not on the same machine
- port: Defaults to `3306`. Change this if your database server is listening on a different port
- name: The name of your REOSERV database.
- username: The username for REOSERV to access the database
- password: The password for REOSERV to access the database

## SLN

- enabled: Defaults to `false`. Enable this if you want your server to show up on the SLN list
- url: Defaults to Apollo's SLN. Don't change this unless you know what you're doing
- site: A website URL for your server
- hostname: The domain or ip address for users to connect to your server (e.g `game.endless-online.com`)
- rate: Defaults to 5 minutes. This is how often the SLN will ping your server for updates
- zone: The name of the zone your server should appear under

See Apollo's site for additional guidance: http://apollo-games.com/SLN/SLN.php/info

## New Character

Change the spawn location and home of new characters

## Jail

Change the location players are teleported to when Jailed and Freed

## Rescue

Change the location players are teleported to when they end up in an invalid location (Missing map or out of bounds).

## Combat

Define ranged weapons, their range, and if they require arrows.
