---
title: 'Pub files'
description: 'In this section you will learn where to put your pub files'
date: 2024-04-07T10:10:13+02:00
lastmod: 2024-04-07T10:10:13+02:00
---

REOSERV by default will load the binary pub data files. JSON is also supported.

## Binary data files

Place the following files in the `/pub` directory.

- dat001.ecf (Classes)
- dat001.eif (Items)
- dsl001.esf (Spells)
- dtn001.enf (Npcs)

You can also supply the [server binary](https://tehsausage.com/temporary/neweopub.txt) data files in the `/pub` directory.

- din001.eid (Inns)
- dsm001.emf (Skill masters)
- dtd001.edf (Drops)
- dts001.esf (Shops)
- ttd001.etf (NPC Chatter)

## JSON (Recommended)

Place your JSON files in the subdirectories of `/pub`.

You can use [pub2json](https://github.com/sorokya/pub2json) to generate json files from the binary files above.
