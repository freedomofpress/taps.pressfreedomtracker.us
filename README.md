# Trump Anti-Press Social Media Tracker

This site is built with the static site generator [Eleventy](https://www.11ty.dev/). Templates
are written in [WebC](https://www.11ty.dev/docs/languages/webc/).

> [!NOTE]
> The Node.js version is documented in the `.nvmrc` file. If you are using 
> [`nvm`](https://github.com/nvm-sh/nvm) the correct version will be activated automatically.


To run Eleventy directly, you need Node.js . Run `npm install` to install the dependencies, then
run `npm run serve` to serve the site on port 8080.

The production site is deployed to 
[https://taps.pressfreedomtracker.us](https://taps.pressfreedomtracker.us) by Cloudflare Pages. A
Cloudflare Worker rebuilds the site every hour to deploy new items added to the data source.
