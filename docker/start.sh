#!/bin/bash
set -e

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

# Set proper permissions
chown -R www-data:www-data /app/storage /app/bootstrap/cache
chmod -R 775 /app/storage /app/bootstrap/cache

# Start supervisor
echo "Starting supervisor..."
exec supervisord -c /etc/supervisor/conf.d/supervisord.conf
