# syntax=docker/dockerfile:1

# Stage 1: Build frontend assets using Node 20
FROM node:20-alpine AS node_builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY vite.config.js postcss.config.js tailwind.config.js jsconfig.json ./
COPY resources ./resources
COPY public ./public

RUN npm run build

# Stage 2: Install PHP dependencies without dev packages
FROM composer:2 AS vendor
WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --optimize-autoloader

# Stage 3: Production runtime with PHP-FPM and Nginx
FROM webdevops/php-nginx:8.3-alpine AS runtime

ENV WEB_DOCUMENT_ROOT=/app/public
WORKDIR /app

COPY . /app
COPY --from=vendor /app/vendor /app/vendor
COPY --from=vendor /app/composer.lock /app/composer.lock
COPY --from=vendor /app/composer.json /app/composer.json
COPY --from=node_builder /app/public/build /app/public/build

RUN chown -R application:application /app/storage /app/bootstrap/cache \
    && chmod -R ug+rwx /app/storage /app/bootstrap/cache

EXPOSE 80

CMD ["/opt/docker/bin/entrypoint.sh"]
