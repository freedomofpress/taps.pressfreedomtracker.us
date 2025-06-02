FROM docker.io/library/node:23.11.1-alpine3.21@sha256:169ee1b69bd3f5c7c8508a9919e8b367bba9dc7fa9a03097ec9f85d2e8179631 AS eleventy-build

WORKDIR /usr/src/page
COPY package.json package-lock.json eleventy.config.js ./
COPY src ./src
RUN npm ci && npm run build

FROM docker.io/library/nginx:mainline-alpine@sha256:62223d644fa234c3a1cc785ee14242ec47a77364226f1c811d2f669f96dc2ac8

COPY deploy/nginx.conf /etc/nginx
RUN mkdir -p /opt/nginx/run /opt/nginx/webroot/assets && chown -R nginx:nginx /opt/nginx

USER nginx
COPY --from=eleventy-build --chown=nginx:nginx /usr/src/page/dist /opt/nginx/webroot/
EXPOSE 5080