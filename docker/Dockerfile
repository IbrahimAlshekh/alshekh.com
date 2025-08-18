FROM php:8.4-fpm

RUN apt-get update && apt-get install -y \
    nginx \
    curl \
    unzip \
    git \
    libicu-dev \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    libssl-dev \
    libpq-dev \
    supervisor \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) pcntl opcache pdo pdo_pgsql intl zip gd exif ftp bcmath \
    && pecl install redis \
    && docker-php-ext-enable redis

RUN echo "opcache.enable=1" > /usr/local/etc/php/conf.d/custom.ini \
    && echo "opcache.jit=tracing" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "opcache.jit_buffer_size=256M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "memory_limit=512M" > /usr/local/etc/php/conf.d/custom.ini \
    && echo "upload_max_filesize=64M" >> /usr/local/etc/php/conf.d/custom.ini \
    && echo "post_max_size=64M" >> /usr/local/etc/php/conf.d/custom.ini

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

WORKDIR /var/www/html

RUN mkdir -p /var/www/html/storage /var/www/html/bootstrap/cache

RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage

COPY .. .

# Install PHP dependencies
RUN composer install --prefer-dist --optimize-autoloader --no-interaction

# Install Node.js dependencies and build assets (including SSR)
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs \
    && npm install --production \
    && npm ci \
    && npm run build:ssr \
    && npm cache clean --force \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

RUN chown -R www-data:www-data storage bootstrap/cache && chmod -R 775 storage bootstrap/cache

# Copy Nginx configuration
COPY docker/nginx.conf /etc/nginx/sites-available/default

# Create start script
COPY docker/start.sh /start.sh
RUN chmod +x /start.sh

EXPOSE 8000

CMD ["/start.sh"]
