---
title: 'Speech and Stats'
description: 'After fixing up NPC movement I thought it would be fun giving them something to say.'
date: 2022-09-12T10:10:13+02:00
lastmod: 2022-09-12T10:10:13+02:00
---

We determined in the last [post](/news/2022-09-10-discoveries-and-broken-shit) that NPC speech happens at an interval of _4800ms_.

So all I needed to do was add a timestamp to each NPC instance.

```rust
pub does_talk: bool,
pub last_talk: DateTime<Utc>,
```

Also discovered that for a group of NPCs in a spawn only 20% of them will actually speak.
That is what the `does_talk` bool is for. We evenly pick 20% of them at initialization.

```rust
// Only 20% of npcs in a group will speak
let num_of_chatters = cmp::max(1, (spawn.amount as f64 * 0.2).floor() as EOChar);
let mut chatter_indexes: Vec<usize> = Vec::with_capacity(num_of_chatters as usize);
let chatter_distribution = spawn.amount / num_of_chatters;
for i in 0..num_of_chatters {
    chatter_indexes.push(((i * chatter_distribution) + npc_index) as usize);
}
```

Really not a fan of how this code turned out. It'll need to be changed once I implement
combat anyway because GameServer shifts who the 20% talking NPCs are when any NPC on the map dies.

NPCs also have a `rate` at which they do speak. Turns out this is just a percent chance from 1-100.

To tell if an NPC should chat or not we generate a number from 0-100. If it's less than rate then they
speak. We also pick a random message out of the pool of messages they can say.

```rust
let roll = rng.gen_range(0..=100);
if roll <= talk_record.rate {
    let message_index = rng.gen_range(0..talk_record.messages.len());
    talk_updates.push(NPCChat {
        index: *index,
        message: talk_record.messages[message_index].to_string(),
    })
}
npc.last_talk = now;
```

That's pretty much it for NPC speech. It's not 100% accurate and needs to be fixed once
combat is implemented but it works.

# Stat calculation

If you've been following along you probably noticed that the health and magic bars
are always empty in screenshots and recordings of reoserv. This is because I've been
putting off player character stat calculation for a while. Up until now the client was
just told that all of their stats are 0.

You may be wondering what even are the stats in Endless Online.

The player receives stat points for each level and can put them into any of the following:

- Strength - Increases max carrying weight and influences attack power depending on class
- Intelligence - Increases mana pool and influences attack power depending on class
- Intelligence - Increases mana pool and influences attack power depending on class
- Agility - Increases accuracy and dodge rate depending on class
- Consistution - Increases max health and armor depending on class
- Charisma - Does _literally_ nothing - don't put points in this

Using those stat points and the players class we calculate the following

- Damage - The minimum amount of damage points dealt
- Accuracy - How likely your attack is to land
- Evade - How likely you are to dodge an enemy attack
- Defense - How much damage is neglected when you are attacked

Hit rate is calculated with the following formula

```
// Credits to Sausage for these formulas
if target_sitting {
    1.0
} else {
    min(0.8, max(0.2, if accuracy + target_evade == 0 {
        0.5
    } else {
        accuracy / (target_evade * 2)
    }))
}
```

And damage like this

```
// Credits to Sausage for these formulas
let multiplier = if critical {
    1.5
} else {
    1.0
};

max(1, if(damage >= target_armor * 2.0) {
    damage
} else {
    damage * pow((damage / (target_armor * 2.0), 2.0))
})
```

Each class has a stat table variable to determine which formulas are used
for calculation. We define those stat tables like so

```
classes: [
    // Melee
    (
        damage: "str / 3.0",
        accuracy: "agi / 3.0",
        evade: "agi / 5.0",
        defense: "con / 4.0",
    ),
    // Rogue
    (
        damage: "str / 5.0",
        accuracy: "agi / 3.0",
        evade: "agi / 3.0",
        defense: "con / 4.0",
    ),
    // Caster
    (
        damage: "int / 3.0",
        accuracy: "wis / 3.0",
        evade: "agi / 4.0",
        defense: "con / 5.0",
    ),
    // Archer
    (
        damage: "str / 6.0",
        accuracy: "agi / 5.0",
        evade: "agi / 5.0",
        defense: "con / 5.0",
    ),
    // Peasant (default class)
    (
        damage: "0.0",
        accuracy: "0.0",
        evade: "0.0",
        defense: "0.0",
    ),
]
```

So anyway! Stats are being calculated now and at least the health and mana bars
aren't empty anymore. I'm not really sure if hit rate/attack/armor/etc are
working yet because there is no combat yet. We'll get there soon.

# What's coming next?

There are a few things I could work towards next

- Chest spawns and interaction
- Basic combat system (aggresive mob behavior, kills, loot drops, exp, level up, etc)
- Inventory management (being able to hold/use items, wear armor & weapons)

Then down the road there's some bigger systems to tackle

- Spells
- Quest engine
- Boss & Child NPC mechanics

I'm thinking for now I'll shift focus to inventory management. My character has been
exploring the lands of Endless naked for too long. I want to be able to conjure items
from thin air and use them!
