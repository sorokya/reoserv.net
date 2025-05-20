---
title: 'Quick Start'
description: 'Quickly get a server up in running!'
date: 2025-05-20T13:15
lastmod: 2025-05-20T13:15
---

## Download a prebuilt binary for your OS

REOSERV is automatically built and released for x64 Windows, Mac OS (Intel and Apple Silicon), and x64 Linux (GNU and MUSL).

You can find a release zip or tarball for your OS at the latest release page on GitHub:

https://github.com/sorokya/reoserv/releases/latest

Once downloaded simply extract the binary archive to your desired installation location.

## Setup MySQL Database

The server needs a MySQL database to store player and game data. Here’s how to set it up:

### 1. Install MySQL

If you haven’t already, install MySQL:

- **Windows or Mac:** Download and install it from [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- **Linux (like Ubuntu):** Run this in a terminal:
  ```sh
  sudo apt update
  sudo apt install mysql-server
  ```

### 2. Create the Database

Once MySQL is installed:

1. Open the MySQL command line (on Windows, look for "MySQL Command Line Client" in the Start menu).
2. Run the following commands one at a time:
   ```sql
   CREATE DATABASE reoserv;
   CREATE USER 'reoserv'@'localhost' IDENTIFIED BY 'reoserv';
   GRANT ALL PRIVILEGES ON reoserv.* TO 'reoserv'@'localhost';
   FLUSH PRIVILEGES;
   ```

These commands:

- Create a database called `reoserv`
- Create a user named `reoserv` with the password `reoserv`
- Give that user full access to the database

> 💡 If you want to use a different username or password, just update the next step to match.

### 3. Load the Setup Files

You now need to run two setup files that create the tables and data your server needs.

If you're on:

- *Windows*: Open Command Prompt in the reoserv directory and run:
  ```sh
  mysql -u reoserv -p reoserv < db-init\1-init.sql
  mysql -u reoserv -p reoserv < db-init\2-get-guild-details.sql
  ```
- *Mac or Linux*: Open Terminal and run:
  ```sh
  mysql -u reoserv -p reoserv < db-init/1-init.sql
  mysql -u reoserv -p reoserv < db-init/2-get-guild-details.sql
  ```

When prompted, type the password: `reoserv`

### 4. Update the Config File

Open the file `config/Config.toml` in a text editor and find this section:

```toml
[database]
host = "127.0.0.1"
port = "3306"
name = "reoserv"
username = "reoserv"
password = "reoserv"
```

If you used a different username, password, or host, change it here. Otherwise, you can leave it as is.

### 5. Add game data

Download and extract the necessary game data files:

1. Download These Files

- [eo-v28-pubs.zip](/static/eo-v28-pubs.zip)
- [eo-v28-maps.zip](/static/eo-v28-maps.zip)
- [eo-quests-master.zip](https://github.com/cirras/eo-quests/archive/refs/heads/master.zip)

2. Extract the Files

- Extract **everything** from `eo-v28-pubs.zip` into:  
  `data/pubs`

- Extract **everything** from `eo-v28-maps.zip` into:  
  `data/maps`

- From `eo-quests-master.zip`, open the `quests/` folder and extract its contents into:  
  `data/quests`

> 💡 Make sure the folders like `data/pubs` and `data/maps` contain actual game files (not a subfolder named `eo-v28-pubs` or similar).

### 6. Start your Server

Once everything is set up, you’re ready to launch the server!

#### 🖥️ On Windows


1. Open the folder where you unzipped or built the server.
2. Double-click the `reoserv.exe` file.


The server window should open and start showing logs. If you see errors, double-check your database setup and config file.

#### 💻 On macOS or Linux

1. Open Terminal.
2. Navigate to the folder where the server is located. For example:
   ```sh
   cd ~/reoserv
   ```
3. Start the server by running:
   ```sh
   ./reoserv
   ```

If you get a “permission denied” error, you may need to make the file executable:

```sh
chmod +x reoserv
```

Then run it again:

```sh
./reoserv
```

If everything is working, the server should start and listen for player connections. 🎉

### 7. Testing your server

Get yourself a v28 compatible client:

- [Endless028.zip](https://cache.tehsausage.com/EndlessOnline/EOzipped028.zip) (The official v28 client)
- [Endless Patch 0.3.X](https://www.endless-online.com/deep/patch.html) (Updated v28 client from Vult-r)
- [EndlessClient](https://github.com/ethanmoffat/EndlessClient/) (Open source v28 client by EthanMoffat and team)

Update the config to point to your server:

```
Host=localhost
Port=8078
```

Try creating an account and logging in. After your character is created you can change their `admin_level` value in the characters database table to `5` (The highest level).

If your client fails to connect double check your client config and see if there are any errors being logged from reoserv.
