#!/bin/bash
set -e

cd /var/www/html

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

# Start Inertia SSR in the background
echo "Starting Inertia SSR server..."
php artisan inertia:start-ssr > /var/www/html/storage/logs/ssr.log 2>&1 &

# Wait a moment for SSR to initialize
sleep 3

# Start PHP-FPM in the background
echo "Starting PHP-FPM..."
php-fpm -D

# Start Nginx in the foreground
echo "Starting Nginx..."
nginx -g "daemon off;"
