---
title: Downloads
description: How to set up reoserv as a docker service
date: 2024-04-03T20:16:42+01:00
lastmod: 2024-04-03T20:16:42+01:00
---

<div class="px-4 md:px-6 text-amber-12 bg-amber-2 border border-amber-6 dark:textamberdark-12 dark:bg-amberdark-2 dark:border-amberdark-6">
  <p>There are no binary downloads available for REOSERV yet!</p>
  <p>However, there is a docker image published at the GitHub Container Registry.</p>
</div>

## Recommended setup with docker compose:

### 1. Clone the repository

```sh
git clone https://github.com/sorokya/reoserv.git
```

### 2. Add your pub and map files

### 3. Create the .env file and edit values

```sh
cp .env.example .env
nvim .env
```

### 4. Create docker-compose.yml

```yaml
version: '3.8'

services:
  reoserv:
    image: ghcr.io/sorokya/reoserv:master
    ports:
      - 8078:8078
    volumes:
      - ./:/reoserv
    depends_on:
      db:
        condition: service_healthy
  db:
    image: mysql
    command: --default-authentication-plugin=mysql_native_password
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_USER: reoserv
      MYSQL_DATABASE: reoserv
      MYSQL_PASSWORD: ${MYSQL_REOSERV_PASSWORD}
      TZ: UTC
    ports:
      - 3306:3306
    volumes:
      - ./db-init/:/docker-entrypoint-initdb.d/
    healthcheck:
      test: mysqladmin ping -h 127.0.0.1 -u $$MYSQL_USER --password=$$MYSQL_PASSWORD
      start_period: 5s
      interval: 5s
      timeout: 5s
      retries: 5
```

### 5. Update config

```sh
cp Config.toml Config.local.toml
nvim Config.local.toml
```

In `Config.local.toml`:

```plaintext
[database]
host = "db"
port = "3306"
name = "reoserv"
username = "reoserv"
password = "<SAME PASSWORD FROM .env>"
```

### 6. Start reoserv

```sh
docker compose up
```
