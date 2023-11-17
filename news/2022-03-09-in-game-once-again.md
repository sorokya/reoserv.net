---
title: 'In game once again'
description: 'Re-implemented the welcome packet handler using the new world and map handles'
date: 2022-03-09T16:05:21+01:00
lastmod: 2022-03-09T16:05:21+01:00
---

![screenshot](/img/news/in-game-once-again.png 'Two players logged into the game world')

It has only been a few days since my last post but a lot of new features have been
implemented into the server! 😁

## Map updates

I moved all of the Map files into a new struct called Map

```rust
pub struct Map {
    pub rx: UnboundedReceiver<Command>,
    file: MapFile,
    items: Arc<Mutex<Vec<Item>>>,
    npcs: Arc<Mutex<Vec<NPC>>>,
    players: Arc<Mutex<HashMap<EOShort, PlayerHandle>>>,
}
```

This may look familiar to you if you've seen the Player or World structs because
it's also an Actor! That's right - _every_ map in the game is now behind a [Task](https://docs.rs/tokio/latest/tokio/task/index.html)
and will run independently of the rest of the server.

Like Player and World the Map actor also has a list of commands it can process.

```rust
pub enum Command {
    GetHashAndSize {
        respond_to: oneshot::Sender<([EOByte; 4], EOInt)>,
    },
    Serialize {
        respond_to: oneshot::Sender<PacketBuf>,
    },
    Enter(EOShort, PlayerHandle),
    GetNearbyInfo {
        target_player_id: EOShort,
        respond_to: oneshot::Sender<NearbyInfo>,
    },
}
```

`GetHashAndSize` and `Serialize` are used for letting the player client check if they need
to download the map file and actually serializing the map file into a byte array for the
client to save.

`Enter` is the command we send when we want to add a player to the map. It will add the
`PlayerHandle` to the map's players HashMap and inform nearby players that the new player
has "Entered".

## Welcome handler reimplementation

My original implementation of the welcome family packet handlers were not really great.
I did pretty much the bare minimum to get a player in game and didn't have any concept of
the World actor yet.

I added five new commands to the World actor:

```rust
SelectCharacter {
    character_id: EOInt,
    player: PlayerHandle,
    respond_to:
        oneshot::Sender<Result<welcome::Reply, Box<dyn std::error::Error + Send + Sync>>>,
},
GetFile {
    file_type: FileType,
    player: PlayerHandle,
    respond_to: oneshot::Sender<Result<init::Reply, Box<dyn std::error::Error + Send + Sync>>>,
},
EnterGame {
    player: PlayerHandle,
    respond_to:
        oneshot::Sender<Result<welcome::Reply, Box<dyn std::error::Error + Send + Sync>>>,
},
GetClass {
    class_id: EOChar,
    respond_to: oneshot::Sender<Result<ClassRecord, Box<dyn std::error::Error + Send + Sync>>>,
},
GetItem {
    item_id: EOShort,
    respond_to: oneshot::Sender<Result<ItemRecord, Box<dyn std::error::Error + Send + Sync>>>,
},
```

`SelectCharacter` - is used when the player clicks the login button for their character.

- Loads the character data from the database
- Makes sure the character exists and belongs to the player's account
- Generates the welcome request response data (see [impl](https://github.com/sorokya/reoserv/blob/fbd41cf37187e987257a30b7e08f28d8a2303c26/src/world/world.rs#L354))
- Sets the player's character data with the loaded data
- Sends back the welcome reply to be serialized and sent to the player's client

`GetFile` - is used when player's client requests a file

- Map
  - Get's the player's map id
  - Tries to find the map from the world's maps HashMap
  - Sends back the serialized form of the map file
- Item/NPC/Spell/Class
  - Tries to lock the world's item/npc/spell/class file (panics if these aren't loaded)
  - Sends back the serialized form of the item/npc/spell/class file

`EnterGame` - is used after player's client has verified it has all the needed files and wants to enter the game

- Get's the player's map id
- Tries to find the map from the world's maps HashMap
- Generates the welcome request response data (see [impl](https://github.com/sorokya/reoserv/blob/fbd41cf37187e987257a30b7e08f28d8a2303c26/src/world/enter_game.rs#L12))
  - Get's the player's id
  - Informs the map actor that the player has entered
    - Right now this just adds the player handle to the maps internal Players hashtable but
      it will send player appear packets to other players soon
  - Calculates the player's stats (health, attack power, etc.)
  - Gets the player's Weight, Items, and, Spells
  - Requests the `NearbyInfo` from the map actor (see [impl](https://github.com/sorokya/reoserv/blob/fbd41cf37187e987257a30b7e08f28d8a2303c26/src/map/map.rs#L55))
  - Reads the news from `news.txt`
  - Returns the welcome reply
- Sends back the welcome reply to be serialized and sent to the player's client

To be honest I was really surprised this just works. As I was writing the code
I just had this feeling that things were going to deadlock and never get sent
back to the player clients. It works though!

Next steps are to get all the packets related to player movement implemented!

Hope you enjoyed this update 😁
