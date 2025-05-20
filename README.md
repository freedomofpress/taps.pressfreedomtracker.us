# Trump Anti-Press Social Media Tracker

This site is built with the static site generator [Eleventy](https://www.11ty.dev/). Templates are written in [WebC](https://www.11ty.dev/docs/languages/webc/).

To run Eleventy directly, you need Node.js . Run `npm install` to install the dependencies, then run `npm run serve` to serve the site on port 8080.

In production, we use a containerized setup. You can also use it to serve the site:

To test the deploy container:

```sh
docker build -t taps -f deploy/Dockerfile .
docker run --rm -p 127.0.0.1:8080:5080 taps
```

This will also serve the site at [localhost:8080](http://localhost:8080/).