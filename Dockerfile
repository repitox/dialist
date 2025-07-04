# Используем легкий образ nginx для статических файлов
FROM nginx:alpine

# Устанавливаем дополнительные инструменты для разработки
RUN apk add --no-cache \
    curl \
    nano \
    bash

# Копируем файлы проекта в nginx
COPY . /usr/share/nginx/html/

# Копируем кастомную конфигурацию nginx
COPY docker/nginx.conf /etc/nginx/nginx.conf

# Создаем папку для логов
RUN mkdir -p /var/log/nginx

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]