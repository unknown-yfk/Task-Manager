# Use official PHP image with Laravel dependencies
FROM php:8.2-fpm

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libzip-dev \
    unzip \
    curl \
    git

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_pgsql zip

# Install Composer
COPY --from=composer:2.6 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Install dependencies
RUN composer install --optimize-autoloader --no-dev

# Expose port
EXPOSE 9000

# Start PHP-FPM server
CMD ["php-fpm"]
