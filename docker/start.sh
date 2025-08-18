#!/bin/bash
set -e

cd /var/www/html

# Create directories for supervisor
mkdir -p /var/run/supervisor
chmod 755 /var/run/supervisor

# Copy PHP-FPM www.conf
cp /var/www/html/docker/www.conf /usr/local/etc/php-fpm.d/www.conf

# Wait for database to be ready
echo "Waiting for database connection..."
php artisan tinker --execute="DB::connection()->getPdo();" || {
    echo "Database not ready, running migrations..."
    php artisan migrate --force
}

# Clear and cache configurations
echo "Optimizing Laravel..."
php artisan config:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Set proper ownership for Laravel directories
chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

echo "Starting supervisord..."
# Start supervisord in the foreground
exec /usr/bin/supervisord -c /var/www/html/docker/supervisord.conf
