# Stage 1: Build frontend assets
FROM node:20-alpine AS frontend

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source files
COPY resources/ resources/
COPY public/ public/
COPY vite.config.js postcss.config.js tailwind.config.js jsconfig.json ./

# Build assets
RUN npm run build

# Stage 2: Install PHP dependencies
FROM composer:2 AS composer

WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies (no dev)
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader

# Stage 3: Runtime image
FROM webdevops/php-nginx:8.3-alpine

# Set working directory
WORKDIR /app

# Install PostgreSQL extension
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql pgsql

# Copy application files
COPY --chown=application:application . /app

# Copy vendor from composer stage
COPY --from=composer --chown=application:application /app/vendor /app/vendor

# Copy built assets from frontend stage
COPY --from=frontend --chown=application:application /app/public/build /app/public/build

# Set correct permissions
RUN chown -R application:application /app/storage /app/bootstrap/cache \
    && chmod -R 775 /app/storage /app/bootstrap/cache

# Set web root
ENV WEB_DOCUMENT_ROOT=/app/public

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
    CMD curl -f http://localhost/ || exit 1
