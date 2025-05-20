# sha256 as of 2024-03-15
FROM node:23.11.1-alpine3.21 AS eleventy-build

WORKDIR /usr/src/page
COPY package.json package-lock.json eleventy.config.js ./
COPY src ./src
RUN npm ci
RUN npm run build

# sha256 as of 2023-07-05
FROM nginx:mainline-alpine

COPY deploy/nginx.conf /etc/nginx
RUN mkdir -p /opt/nginx/run /opt/nginx/webroot/assets && chown -R nginx:nginx /opt/nginx

USER nginx
COPY --from=eleventy-build --chown=nginx:nginx /usr/src/page/dist /opt/nginx/webroot/
EXPOSE 5080