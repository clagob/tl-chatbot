FROM php:7.3-apache
RUN rm /etc/apt/preferences.d/no-debian-php && \
  apt-get update -y && apt-get install -y \
    libxml2-dev \
    php-soap \
  && apt-get clean -y \
  && docker-php-ext-install soap
