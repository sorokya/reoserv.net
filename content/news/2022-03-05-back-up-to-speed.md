---
title: 'Back Up to Speed'
description: 'After a break from the project I spent the last few days actually implementing that actor pattern I was so excited about! There were a few hurdles along the way, but the server is so much cleaner now.'
date: 2022-03-05T15:12:07+01:00
lastmod: 2022-03-05T15:12:07+01:00
---

I took a couple of weeks off from the project because I got **married!** _woo_ 🎉

A few weeks ago I wrote an [article](/news/2022-02-21-the-actor-pattern-with-async-rust/) about the actor design pattern
and how excited I was to implement it into [reoserv](https://github.com/sorokya/reoserv).

In this article I will describe how the migration went and what I learned along the way.

The biggest decision to make when implementing an actor system is **who owns what data**.

## Ownership before actor model

Things started from main and ownership stemmed downwards like a traditional program

- `fn main()`
  - _players_ - a hash map of PlayerId/[Tx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.UnboundedSender.html) (the write half of a [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel)
  - _active_account_ids_ - a vec of logged in account ids
  - _characters_ - a vec of logged in character data
  - _world_ - the world struct
    - _maps_ - a hash map of id/map file
    - _pub data_ - all of the pub files
  - `fn handle_player(world, players, characters, active_account_ids, socket, pool)`
    - _player_ - the player struct
      - _packet_bus_ - responsible for sequencing/encoding/etc
        - _socket_ - the raw tcp stream for the player
      - _[rx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.Receiver.html)_ - the read half of the [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel
    - _queue_ - a queue of packets

## Ownership after actor model

The ownership model is a lot more flat. A single world struct (inside it's own task) and individual
player structs (also in their own tasks) own all of their data and are interacted with via message passing
(made convient via the handle structs).

- `fn main()`
  - _world_handle_ - a world "handle" creates the world struct/task and keeps the write half of the [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel
- _world_ - the world struct
  - _[rx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.Receiver.html)_ - the read half of the [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel
  - **player_handles** - a hash map of PlayerId/PlayerHandle (creates the player struct/task and keeps the write half of the [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel)
  - _accounts_ - a vec of logged in account ids
  - _maps_ - a hash map of id/map file
  - _pub data_ - all of the pub files
- _player_ - the player struct
  - _[rx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.Receiver.html)_ - the read half of the [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html) channel
  - _queue_ - a queue of packets
  - _packet_bus_ - responsible for sequencing/encoding/etc
    - _socket_ - the raw tcp stream for the player
  - **world_handle** - this is a copy of the world handle from main. Allows for easy communication with the world

The two important fields above are the **player_handles** and **world_handle**. These are convenience structs that own only a single
field. The [Tx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.UnboundedSender.html) half of the Player's or World's [mpsc](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/index.html).
The struct has a wrapper function for each command the underlying actor handles.

## Actor Handle function example

Here's an example from world_handle that is responsible for processing a login request.

```rust
pub async fn login(
    &mut self,
    name: String,
    password: String,
) -> Result<(login::Reply, EOShort), Box<dyn std::error::Error + Send + Sync>> {
    // Setup the oneshot channel so we can wait for the response from the world
    let (tx, rx) = oneshot::channel();

    // Send the command with the request parameters and our oneshot's write half
    let _ = self.tx.send(Command::Login {
        name,
        password,
        respond_to: tx,
    });

    // Return the result of the world's internal login request handler
    rx.await.unwrap()
}
```

Inside the world struct we have a function that handles any incoming commands

```rust
pub async fn handle_command(&mut self, command: Command) {
    match command {
        /* other commands */
        Command::Login {
            name,
            password,
            respond_to,
        } => {
            // Get a MySQL connection from the pool
            let mut conn = self.pool.get_conn().await.unwrap();

            // Get a mutable lock on the accounts field so we can
            // check if the account is already logged in and
            // add the new account if login is successful
            let mut accounts = self.accounts.lock().await;

            // Verifies the username/password, checks for bans, checks if account is already logged in
            let result = login(&mut conn, &name, &password, &mut accounts).await;

            // Send the response back to the oneshot receiver
            let _ = respond_to.send(result);
        }
        /* other commands */
    }
}
```

The handle struct makes your higher level code a _lot_ neater and easier to understand
because you're not setting up oneshot channel's or manually sending commands to raw [Tx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.UnboundedSender.html)'s
all over the place every time you want to communicate with an actor.

Account create handler **without** the WorldHandle

```rust
// Setup the oneshot channel so we can wait for the response from the world
let (tx, rx) = oneshot::channel();

// Send the command with the request parameters and our oneshot's write half
let _ = world_tx.send(Command::Login {
    name,
    password,
    respond_to: tx,
});

// Return the result of the world's internal login request handler
let result = rx.await.unwrap();
let reply = match result {
    Ok(reply) => reply,
    Err(e) => {
        error!("Create account failed: {}", e);
        // Not an ideal reply but I don't think the client has a "creation failed" handler
        Reply::no(AccountReply::NotApproved)
    }
};
```

Account create handler **with** the WorldHandle

```rust
let reply = match world.create_account(create.clone(), player_ip).await {
    Ok(reply) => reply,
    Err(e) => {
        error!("Create account failed: {}", e);
        // Not an ideal reply but I don't think the client has a "creation failed" handler
        Reply::no(AccountReply::NotApproved)
    }
};
```

## Hurdles

The biggest problem I had initially is that I couldn't figure out a way to
pass the PlayerHandle to the packet handler function.

The player and task are spawned from within the PlayerHandle constructor itself.
It's not like I could pass the PlayerHandle to the task before it even exists.

```rust
impl PlayerHandle {
    pub fn new(player_id: EOShort, socket: TcpStream, world: WorldHandle) -> Self {
        // Setup the player's mpsc channel
        let (tx, rx) = mpsc::unbounded_channel();

        // Create the actual player struct
        let player = Player::new(player_id, socket, rx, world);
        tokio::task::Builder::new()
            .name("run_player")
            .spawn(run_player(player, tx.clone())); // <- I would need to pass the handle here

        Self { tx }
    }
    /*snip*/
async fn run_player(mut player: Player, player: mpsc::UnboundedSender<Command>) {
    loop {
        if let Some(packet) = player.queue.get_mut().pop_front() {
            tokio::task::Builder::new()
                .name("handle_packet")
                .spawn(handle_packet(
                    packet,
                    player.id,
                    player.clone(), // <- Same crappy raw mpsc write half
                    player.world.clone(),
                ));
        }
    }
}
```

Without this I was stuck with manually setting up oneshot channels and passing messages like I showed above.
I went with that approach initially because I couldn't find a way to make it work.

That is until.. earlier today! It hit me! I can just make a constructor of PlayerHandle
that takes an existing [Tx](https://docs.rs/tokio/1.17.0/tokio/sync/mpsc/struct.UnboundedSender.html) instead of creating a new one!

```rust
impl PlayerHandle {
    pub fn new(player_id: EOShort, socket: TcpStream, world: WorldHandle) -> Self {
        let (tx, rx) = mpsc::unbounded_channel();
        let player = Player::new(player_id, socket, rx, world);
        tokio::task::Builder::new()
            .name("run_player")
            .spawn(run_player(player, PlayerHandle::for_tx(tx.clone())));

        Self { tx }
    }

    fn for_tx(tx: mpsc::UnboundedSender<Command>) -> Self {
        Self { tx }
    }
    /*snip*/
    async fn run_player(mut player: Player, player_handle: PlayerHandle) {
        loop {
            if let Some(packet) = player.queue.get_mut().pop_front() {
                tokio::task::Builder::new()
                    .name("handle_packet")
                    .spawn(handle_packet(
                        packet,
                        player.id,
                        player_handle.clone(), // <- Awesome convenient wrapper!
                        player.world.clone(),
                    ));
            }
        }
    }
}
```

Now I have an actually useful implementation of the actor pattern and I can
happily continue implementing the rest of the server! 😎

I hope you enjoyed reading about this as much as I enjoyed implementing it!

Stay tuned for more development news!
