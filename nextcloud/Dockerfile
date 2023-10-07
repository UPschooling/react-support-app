FROM nextcloud:latest

RUN apt update && apt install -y sqlite3 curl
COPY ./upschoolingsupport /var/www/html/custom_apps/upschoolingsupport
RUN chown -R www-data:www-data /var/www/html