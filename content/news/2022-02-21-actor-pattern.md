---
title: 'The Actor pattern with async rust'
description: 'This weekend I listed to a podcast with one of the maintainers of tokio and learned how I could cleanup my server'
date: 2022-02-21T07:45:48+01:00
lastmod: 2022-02-21T07:45:48+01:00
---

Listened to a podcast over the weekend with one of the maintainers of the tokio (the async runtime I’m using for [reoserv](https://github.com/sorokya/reoserv)) crate for rust. She wrote a [blog post](https://ryhl.io/blog/actors-with-tokio/) about the “Actor” model and how I can refactor my server to be a lot more modular/cleaner.

I was kind of half way there with my implementation. For every connection to the server I spawn a tokio::task (green thread) that owns the underlying Tcp socket.

```rust
loop {
    let (socket, addr) = listener.accept().await.unwrap();

    // these clones look expensive but they're just reference counted mutexes so it's cheap
    let players = players.clone();
    let active_account_ids = active_account_ids.clone();
    let world = world.clone();

    let num_of_players = players.lock().await.len();
    if num_of_players >= SETTINGS.server.max_connections as usize {
        warn!("{} has been disconnected because the server is full", addr);
        continue;
    }

    info!(
        "connection accepted ({}) {}/{}",
        addr,
        num_of_players + 1,
        SETTINGS.server.max_connections
    );

    let pool = pool.clone();

    // Spawn a new task to handle each player async
    tokio::spawn(async move {
        if let Err(e) = handle_player(world, players, active_account_ids, socket, pool).await {
            error!("there was an error processing player: {:?}", e);
        }
    });
}
```

For the main loop to communicate with the socket I created a multi-producer-single-consumer channel (this gets split into two halves: one for reading, and one for writing). The “player” data structure owns the read half, and the main server function owns a mutex guarded hashmap of player id, write channels.

```rust
impl Player {
    pub async fn new(players: Players, socket: TcpStream, player_id: EOShort) -> Self {
        /// this creates the channel for writing/reading to the player task
        let (tx, rx) = mpsc::unbounded_channel();

        // we insert the write half into the hashmap owned by the main server function
        players.lock().await.insert(player_id, tx);

        Self {
            rx,
            bus: PacketBus::new(socket),
            state: State::Uninitialized,
            account_id: 0,
            character_id: 0,
            num_of_characters: 0,
        }
    }
}
```

The part I was missing is that I can create channels for single purpose “get” operations.

There’s a lot more data the the player structure owns that I need access to within some of the packet handlers. What I’ve been doing up till now is just passing this data down to the `handle_packet` function which is getting pretty big (10 arguments).

```rust
if let Some(packet) = queue.get_mut().pop_front() {
    let db_pool = db_pool.clone();
    match handle_packet(
        player_id,
        packet,
        &mut player.bus,
        world.clone(),
        players.clone(),
        active_account_ids.clone(),
        db_pool,
        &player_ip,
        player.account_id,
        player.num_of_characters,
        &character,
    )
    .await
    {
        Ok(()) => {}
        Err(e) => {
            error!("error handling packet: {:?}", e);
        }
    }
}
```

What I can instead do is create new message types for the player channel that takes a one-shot channel and just await a response in the middle of the packet handler.

For example during the initial handshake between the client and server I need to tell the client some information about how the packets I send them
are going to be encoded. I pass this data down to the init handler like so:

```rust
match family {
    Family::Init => match action {
        Action::Init => {
            handlers::init::init(
                buf,
                player_id,
                bus.sequencer.get_init_sequence_bytes(), // <- data I need to tell the client about
                bus.packet_processor.decode_multiple, // <- data I need to tell the client about
                bus.packet_processor.encode_multiple, // <- data I need to tell the client about
                players.lock().await.get(&player_id).unwrap(), // <- already providing the write half of the player channel
            )
            .await?;
        }
        _ => {
            error!("Unhandled packet {:?}_{:?}", action, family);
        }
    },
```

What I could instead do is just send a new kind of message from inside the init handler like so:

```rust
let (send, recv) = oneshot::channel();
let _ = tx.send(Command::GetSequenceBytes(send)).await;
let sequence_bytes = recv.await.expect("Player task has been killed");

// do rest like normal

```

I might even experiment with creating a "handle" struct around the player struct where I can write some helper functions that do
all of the channel communications for you. I think the code would come out looking cleaner. That would look something more
like this:

```rust
let sequence_bytes = match player_handle.get_sequence_bytes().await?;

// do rest like normal
```

Anyway - I'm very excited to try implementing this pattern in my server! Thanks to [https://rustacean-station.org/](https://rustacean-station.org/) and [Alice Ryhl](https://ryhl.io/) for
sharing this design pattern :)
