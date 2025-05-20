---
title: 'Inicio Rápido'
description: '¡Pon en marcha un servidor rápidamente!'
date: 2025-05-20T13:15
lastmod: 2025-05-20T13:15
---

## Descarga un binario preconstruido para tu sistema operativo

REOSERV se construye y publica automáticamente para Windows x64, Mac OS (Intel y Apple Silicon), y Linux x64 (GNU y MUSL).

Puedes encontrar un archivo ZIP o TAR para tu sistema operativo en la última página de lanzamientos en GitHub:

https://github.com/sorokya/reoserv/releases/latest

Una vez descargado, simplemente extrae el archivo en la ubicación donde quieras instalar el servidor.

## Configura la base de datos MySQL

El servidor necesita una base de datos MySQL para guardar los datos de jugadores y del juego. Aquí te explicamos cómo configurarla:

### 1. Instala MySQL

Si aún no lo has hecho, instala MySQL:

- **Windows o Mac:** Descárgalo e instálalo desde [https://dev.mysql.com/downloads/installer/](https://dev.mysql.com/downloads/installer/)
- **Linux (como Ubuntu):** Ejecuta esto en una terminal:
  ```sh
  sudo apt update
  sudo apt install mysql-server
  ```

### 2. Crea la base de datos

Una vez instalado MySQL:

1. Abre la línea de comandos de MySQL (en Windows, busca "MySQL Command Line Client" en el menú de inicio).
2. Ejecuta los siguientes comandos uno por uno:
   ```sql
   CREATE DATABASE reoserv;
   CREATE USER 'reoserv'@'localhost' IDENTIFIED BY 'reoserv';
   GRANT ALL PRIVILEGES ON reoserv.* TO 'reoserv'@'localhost';
   FLUSH PRIVILEGES;
   ```

Estos comandos:

- Crean una base de datos llamada `reoserv`
- Crean un usuario llamado `reoserv` con la contraseña `reoserv`
- Dan acceso completo a ese usuario sobre la base de datos

> 💡 Si usas otro nombre de usuario o contraseña, recuerda cambiarlo también en el siguiente paso.

### 3. Carga los archivos de configuración

Ahora necesitas ejecutar dos archivos `.sql` para preparar la base de datos:

- *Windows*: Abre la Consola de Comandos en la carpeta de reoserv y ejecuta:
  ```sh
  mysql -u reoserv -p reoserv < db-init\1-init.sql
  mysql -u reoserv -p reoserv < db-init\2-get-guild-details.sql
  ```
- *Mac o Linux*: Abre la Terminal y ejecuta:
  ```sh
  mysql -u reoserv -p reoserv < db-init/1-init.sql
  mysql -u reoserv -p reoserv < db-init/2-get-guild-details.sql
  ```

Cuando se te pida, escribe la contraseña: `reoserv`

### 4. Actualiza el archivo de configuración

Abre el archivo `config/Config.toml` con un editor de texto y encuentra esta sección:

```toml
[database]
host = "127.0.0.1"
port = "3306"
name = "reoserv"
username = "reoserv"
password = "reoserv"
```

Si usaste un nombre de usuario, contraseña o host diferente, cámbialo aquí. Si no, puedes dejarlo igual.

### 5. Añade los datos del juego

Descarga y extrae los archivos necesarios para que el servidor funcione:

#### 1. Descarga estos archivos

- [eo-v28-pubs.zip](/static/eo-v28-pubs.zip)
- [eo-v28-maps.zip](/static/eo-v28-maps.zip)
- [eo-quests-master.zip](https://github.com/cirras/eo-quests/archive/refs/heads/master.zip)

#### 2. Extrae los archivos

- Extrae **todo** el contenido de `eo-v28-pubs.zip` en:  
  `data/pubs`

- Extrae **todo** el contenido de `eo-v28-maps.zip` en:  
  `data/maps`

- De `eo-quests-master.zip`, abre la carpeta `quests/` y extrae su contenido en:  
  `data/quests`

> 💡 Asegúrate de que las carpetas como `data/pubs` y `data/maps` contengan los archivos directamente (no una subcarpeta extra como `eo-v28-pubs`).

### 6. Inicia el servidor

Una vez que todo esté configurado, ¡ya puedes iniciar el servidor!

#### 🖥️ En Windows

1. Abre la carpeta donde descomprimiste o compilaste el servidor.
2. Haz doble clic en el archivo `reoserv.exe`.

Se abrirá una ventana del servidor y comenzará a mostrar mensajes. Si ves errores, revisa que la base de datos y el archivo de configuración estén bien configurados.

#### 💻 En macOS o Linux

1. Abre una terminal.
2. Navega hasta la carpeta donde está el servidor. Por ejemplo:
   ```sh
   cd ~/reoserv
   ```
3. Ejecuta el servidor con:
   ```sh
   ./reoserv
   ```

Si ves un error de “permiso denegado”, ejecuta primero:

```sh
chmod +x reoserv
```

Y luego vuelve a iniciarlo:

```sh
./reoserv
```

Si todo está funcionando correctamente, el servidor debería empezar y estar listo para aceptar conexiones. 🎉

### 7. Prueba tu servidor

Consigue un cliente compatible con la versión 28:

- [Endless028.zip](https://cache.tehsausage.com/EndlessOnline/EOzipped028.zip) (El cliente v28 oficial)
- [Endless Patch 0.3.X](https://www.endless-online.com/deep/patch.html) (Cliente v28 actualizado por Vult-r)
- [EndlessClient](https://github.com/ethanmoffat/EndlessClient/) (Cliente v28 de código abierto por EthanMoffat y equipo)

Actualiza el archivo de configuración del cliente para que apunte a tu servidor:

```
Host=localhost
Port=8078
```

Intenta crear una cuenta e iniciar sesión. Después de crear tu personaje, puedes cambiar su valor `admin_level` en la tabla de personajes de la base de datos a `5` (el nivel más alto).

Si tu cliente no puede conectarse, revisa la configuración y busca mensajes de error en la ventana del servidor.
