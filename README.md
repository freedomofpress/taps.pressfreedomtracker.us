# Trump Anti-Press Social Media Tracker

This site is built with the static site generator [Eleventy](https://www.11ty.dev/). Templates are written in [WebC](https://www.11ty.dev/docs/languages/webc/).

## Setup

To run Eleventy directly, you need Node.js . Run

```sh
npm install
```

to install the dependencies.

## Development

Run

```sh
npm run serve
```

This will serve the site at [localhost:8080](http://localhost:8080/).

## Production

To build the site in production mode, run `npm run build`. This will build the site into the [dist](./dist) directory.

In production, we use a containerized setup. You can also use it to serve the site:

To test the deploy container:

```sh
docker build -t taps -f deploy/Dockerfile .
docker run --rm -p 127.0.0.1:8080:5080 taps
```

This will also serve the site at [localhost:8080](http://localhost:8080/).

## Architecture

### Configuration

The configuration entrypoint is [eleventy.config.js](./eleventy.config.js). Configuration files are imported into it from the [_config](./_config) directory.

* [globals.js](./_config/globals.js) - Global data for the site such as data source URLs
* [esbuild.js](./_config/esbuild.js) - ESBuild configuration
* [preact.js](./_config/preact.js) - Preact build-time rendering filter configuration

### Data

The data loader is in [src/_data/posts.js](./src/_data/posts.js). It is responsible for fetching the data from the Google Sheets and parsing it into a format that can be used by the templates.

### Components

This project uses a combination of WebC and Preact components.

WebC components are used for elements of the site that are rendered at build-time _only_. WebC components can be found in the [src/_components](./src/_components) directory.

Preact components are used for elements of the site that are rendered either at build-time or in-browser. Preact components can be found in the [src/preact/components](./src/preact/components) directory.

Since WebC provides CSS bundling functionality, we store all the CSS in the WebC component files as a compromise. If styling a Preact component, edit the CSS in the file that's responsible for rendering that component.