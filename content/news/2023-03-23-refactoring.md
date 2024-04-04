---
title: 'Refactoring'
description: 'Recently picked the project back up again and have been doing some much needed refactoring'
date: 2023-03-23T11:14:15+01:00
lastmod: 2023-03-23T11:14:15+01:00
---

I started writing a blog post about all the protocol related work that has been going on
in the community but for now here's the gist of it:

- [Cirras](https://github.com/cirras) ported the protocol files to [XML](https://github.com/Cirras/eo-protocol)
- I wrote a [parser/code generator](https://github.com/sorokya/eo_protocol_parser) for the [original pseudocode files](https://github.com/sorokya/eo_protocol)
- Cirras also made [eolib-java](https://github.com/Cirras/eolib-java) and [eolib-ts](https://github.com/Cirras/eolib-ts) that generate code from the XML files
- I integrated my [parser/code generator](https://github.com/sorokya/eo_protocol_parser) into the [eo](https://github.com/sorokya/eo) crate (and by extension [reoserv](https://github.com/sorokya/reoserv) and [eoproxy](https://github.com/sorokya/eoproxy))

Basically it means we don't need to write packet structures by hand anymore.

It sucks that there are now two "official" definitions of the protocol. I might end up just
switching over to Cirras's XML protocol at some point but at the moment the psuedocode is working
just fine (aside from it not having ["chunking"](https://github.com/Cirras/eo-protocol/blob/master/docs/chunks.md)
flags but that's a whole other blog post).

## Refactoring you say?

Yes! it started with my frustration with the state of my actors in the server (`player`, `map`, and `world`).
These files were super long and hard to navigate. Felt like I couldn't find anything easily in them. So I wanted
to find a way to make them more modular. After a quick search on the web I discovered that you can
[split struct impls across files](https://stackoverflow.com/a/63378744). So I went ahead and did that for the three
main actors and am happy with the result.

## The packet sequence tangent

After the actor refactoring I ended up trying to fix a long standing bug in reoserv
The EO networking has a kind of "security" we call the sequence. It works basically like this

1. Upon initial handshake the server generates a random number between 0 and 240 (we call this `sequence_start`).
2. Then using the some math it converts it into two bytes that the client converts back into the number
3. The server and client both keep a counter that starts at 0 (we call this `sequence`)
4. Each time the client sends a packet this counter is incremented
5. When the counter reaches 10 it is reset to 0
6. The client adds an extra byte to each encoded packet that is `sequence_start + sequence`
7. The server verifies that this byte matches its own
8. If it does not then the client is disconnected
9. When the server sends a "Ping" it also sends a new random `sequence_start` between 0 and 240 (`sequence` does not change)

The problem I had was reoserv was processing packets async. This means that some packets could get processed out of
order and the sequence checking code would brilliantly fail. To fix this I made a change to the packet queing system so that
we only ever process one packet per player at a given time.

One other thing I changed is limiting the size of `sequence_start` to 240. [EOServ](https://eoserv.net) generates a number between
0 and 1757 and can result in a sequence number too big to fit in a single byte. The official server never generates a number
larger than can fit in a single byte and there's even a bug (with a workaround) in account creation if the sequence is larger than 253.
So I figured it would just be cleaner to emulate how the official server does it.

Am happy to say that enforced packet sequencing now works perfectly in reoserv and I can stop disabling it while I test things!

## Save the RAM

Another thing I've been meaning to address in reoserv is the gross amount of copying that happens. It's mostly
in scenarios where we have a packet that we end up sending to more than one player. Such as a player saying something. Take this
psuedo code

```rust
let packet = talk::Player {
    player_id: target_player_id,
    message,
};
let buf = packet.serialize(); // returns a Vec<u8>

for character in self.characters.values() {
    if target_player_id != character.player_id.unwrap()
        && target.is_in_range(character.coords)
    {
        character.player.as_ref().unwrap().send(
            PacketAction::Player,
            PacketFamily::Talk,
            buf.clone(), // <-- this creates a copy of the buf for every single player
        );
    }
}
```

The problem is that due to the nature of channels/message passing when you want
to send data to an actor it has to move. You can't (as far as I know) send a reference.

The `TALK_PLAYER` packet isn't very big but given a lot of players in an area it could add up.

So I ended up migrating from raw `Vec<u8>` objects to using the [bytes](https://github.com/tokio-rs/bytes) crate.

> Bytes values facilitate zero-copy network programming by allowing multiple Bytes objects to point to the same underlying memory. This is managed by using a reference count to track when the memory is no longer needed and can be freed.

Perfect! After a couple hours of painstakingly updating [StreamBuilder](https://github.com/sorokya/eo/blob/master/src/data/stream_builder.rs)
and [StreamReader](https://github.com/sorokya/eo/blob/master/src/data/stream_reader.rs) to use `Bytes` rather than `Vec<u8>` I got
a pretty decent boost in memory performance (the test was just me logging in and entering a few maps while clearing the client's map folder before starting).

```
# with Bytes
total runtime: 46.97s.
bytes allocated in total (ignoring deallocations): 18.06MB (384.41KB/s)
calls to allocation functions: 118007 (2512/s)
temporary memory allocations: 52076 (1108/s)
peak heap memory consumption: 8.15MB
peak RSS (including heaptrack overhead): 291.84MB
total memory leaked: 692.92KB

# with Vec<u8>
total runtime: 31.09s.
bytes allocated in total (ignoring deallocations): 22.43MB (721.47KB/s)
calls to allocation functions: 1193707 (38400/s)
temporary memory allocations: 1078050 (34679/s)
peak heap memory consumption: 8.20MB
peak RSS (including heaptrack overhead): 293.70MB
total memory leaked: 812.92KB
```

But this will really prevent issues from cropping up further down the road if somebody ever decides to host a server with
more than one player on it.

## Bonus RAM saving measures

I updated the `serialize()` method to take a `StreamBuilder` rather than create its own.
This means that complex structures with many structure members of their own will always be
serializing into the same contiguous section of memory rather than concatenating the different
byte arrays together as they go.

This adds a little extra boiler plate in that you need to create a `StreamBuilder` yourself before being
able to serialize a packet but I think it's worth it.

```rust
let packet = talk::Player {
    player_id: target_player_id,
    message,
};
let mut builder = StreamBuilder::new();
packet.serialize(&mut builder);
let buf = builder.get();
```

One other thing I'm aware of that'll help with performance is pre-allocating the known size of
each packet before beginning serialization (e.g `StreamBuilder::with_capacity(TALK_PLAYER_SIZE)`).

I need to update the protocol parser/generator to be able to define these contants at compile time.
But that's for another day!

## Conculsion

I'm back and working on the project! Did some much needed cleaning up and I'm excited to start working on fun
new features! Hope you enjoyed reading.
