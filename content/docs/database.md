---
title: 'Database'
description: 'In this section you will learn how to setup the MySQL database for your server'
date: 2024-03-29T10:10:13+02:00
lastmod: 2024-04-03T10:10:13+02:00
---

## MySQL vs MariaDB

REOSERV is built for MySQL based databases and has been thoroughly tested with MySQL though MariaDB should also work.

## Installing MySQL or MariaDB to your system

This is recommended for a production or test server environment.

Please follow the documentation for your database choice to install them:

- MySQL: https://dev.mysql.com/doc/en/installing.html
- MariaDB: https://mariadb.com/docs/server/deploy/

## Running MySQL or MariaDB via Docker

This is recommended for local development or testing.

You can use either image:

- MySQL: https://hub.docker.com/_/mysql
- MariaDB: https://hub.docker.com/_/mariadb

## Setting up the REOSERV database

Create a user and database for REOSERV to use.

Your reoserv directory (either pre-built binary or source code) should contain a `/db-init/init.sql` SQL script.

Run this script against your SQL server and it should create the tables and stored procedures that REOSERV needs.

_Note: if you're using a different database name than `reoserv` please modify the first 2 lines of the script to use a different name_

Click [here](/docs/configuration) to continue with the configuring your server.
