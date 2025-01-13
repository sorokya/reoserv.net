---
title: 'Announcing eolib-rs!'
description: 'I finally got around to making eolib-rs and migrated reoserv to it'
date: 2024-01-01T03:28:00+02:00
lastmod: 2024-01-01T03:28:00+02:00
---

I mentioned [last March](/news/2023-03-23-refactoring) that [@cirras](https://github.com/cirras)
had ported the eo protocol to XML and that I might switch reoserv over to a library based on it.

Well over the Christmas break I finally got around to it.

## eolib-rs

I'm happy to announce [eolib-rs](https://github.com/sorokya/eolib-rs). It has a lot of improvements
over my old [eo](https://github.com/sorokya/eo) crate (now archived).

### Improvements

- Based on the same [XML protocol](https://github.com/cirras/eo-protocol) as the other eolib projects
- Data reader and writer structs now do data validation and require the user to handle errors
- Data reader struct now supports chunked reading mode
- Slightly improved packet encoding methods
- Simplified packet sequencer
- Data reader and writer now use `u8` or `i32` rather than exotic integer types (`u8`, `u16`, `u32`)
  - This is more accurate to the original game server and client
- NodeJS is no longer required to build the crate (RIP my [disgusting code generator](https://github.com/sorokya/eo_protocol_parser))

## The great reoserv migration

Migrating reoserv was no simple task.

- All of the imports were broken (e.g `use eo::foo::bar`)
- It was littered with my exotic integer types (`EOByte`, `EOChar`, `EOShort`, `EOThree`, `EOInt`)
- All packet structs were renamed
- Lots of fields were renamed or had their type changed

I was able to do a simple find and replace for a lot of things:

- `StreamBuilder` -> `EoWriter`
- `StreamReader` -> `EoReader`
- `EOByte` -> `u8`
- `EOChar`, `EOShort`, `EOThree`, `EOInt` -> `i32`

But beyond that it was hours and hours of pain. I won't bore you with the details but I finally got
everything working with eolib-rs a couple of days ago.

## Some reoserv refactoring

As I was going through the entire code base making everything work with eolib-rs I saw a ton of
old code that I hadn't revisited for a year or more. It wasn't pretty.

There were a lot of packet handlers being routed into the `World` actor rather than the `Player` when
they really didn't need to at all.

- Request account creation
- Create account
- Change password
- Login
- Request character creation
- Create character
- Request character deletion
- Delete character
- Select character
- Enter game
- Download file

These were all being routed into `World` for whatever reason I had at the time with lots of data going
back and forth between the `World` and `Player` actors.

I've now moved all of these into `Player` which removed the need for most of the data marshalling between
`Player` and `World`.

The other huge benefit is for any of these slow methods (e.g password hashing, database queries) these now only make
the individual `Player` task lag rather than the entire `World` actor.

Thanks for reading! Get ready for many more updates in 2024!
