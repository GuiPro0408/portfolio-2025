FROM php:8.3-cli

ARG UID=1000
ARG GID=1000

RUN apt-get update && apt-get install -y \
        bash \
        git \
        gosu \
        unzip \
        libpq-dev \
        libzip-dev \
        libpng-dev \
        libxml2-dev \
        libonig-dev \
        libcurl4-openssl-dev \
        libsodium-dev \
        libssl-dev \
        procps \
    && docker-php-ext-install \
        bcmath \
        pcntl \
        pdo_pgsql \
        pgsql \
        zip \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/local/bin/composer

RUN groupadd -g "${GID}" laravel \
    && useradd -m -u "${UID}" -g laravel laravel

WORKDIR /var/www/html

COPY docker/dev/php-entrypoint.sh /usr/local/bin/php-dev-entrypoint
RUN chmod +x /usr/local/bin/php-dev-entrypoint

ENV PATH="/var/www/html/vendor/bin:${PATH}" \
    COMPOSER_HOME="/home/laravel/.composer"

ENTRYPOINT ["php-dev-entrypoint"]
CMD ["sh", "-lc", "cd public && exec php -S 0.0.0.0:8000 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php"]
