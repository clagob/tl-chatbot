# Conversation Street BOT for Think Life

Project for leads generation commissioned from the Prince of Gambia.


## Docker - Development Enviroment

### TEST ENV

http://localhost:9000/

**API BOT**

http://localhost:9001/


## Folders

- `src`: Source code for JS and SCSS. Images need to be added here
- `web`: web root (for poduction)
- `test`: testing web root


---

# INSTALLATION

## Getting started: prepare your computer

If you already have the following tools installed, skip this section.

### NPM 6.9+ & Node.js 12.4+

Install it now. (https://nodejs.org)

<!-- ### GULP CLI 2.0+

```
npm install --global gulp-cli
``` -->

### Docker (for preview & testing)

Be sure that the `docker` & `docker-compose` are installed.

https://www.docker.com/get-started

More info: https://docs.docker.com/install/

---

## Install all the project dependencies

```
npm i
```

`NPM` not on your computer? Install it now. (https://nodejs.org)

---

## Usage

You can use this repo in different way. Here the list for an easy understanding.


### Build the package

Build all the distribution parts of the package (`/dist/` & `wp-content/themes/{theme_name}/dist/`).

```
npm run build
```


### Developer mode

To expand and add functionalities, please run this command and edit in the `/src/` folder. The code will be rebuilt on fly and automatically refreshed on the browser.

```
npm run dev
```


### Clean all the generate code

Delete all the generated files inside `/dist/`, `/tmp/` and inside the wordpress theme `/web/../dist/`.

```
npm run clean
```

### Rebuild the package

Rebuild all the distribution parts of the package (`/dist/` & `/web/../dist/`). **This task will initially clean (delete) all the previous generated files.**

```
npm run rebuild
```

## Development

**Build and start**

```
docker-compose up -d
```

**Then open in your browser**

```
http://localhost:9000
```

**Stop**

```
docker-compose stop
```

**Shutdown**

This removes the containers and default network.

```
docker-compose down
```

More info about [Docker compose](https://docs.docker.com/compose)
---
