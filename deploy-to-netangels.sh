#!/bin/bash

# Скрипт для развертывания на NetAngels хостинге
# Использование: ./deploy-to-netangels.sh

set -e

echo "🚀 Развертывание Dialist на NetAngels хостинге..."

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Настройки
SSH_USER="c107597"
SSH_HOST="h60.netangels.ru"
REMOTE_PATH="dialist.ru/www"

echo -e "${YELLOW}📋 Этап 1: Сборка React приложения...${NC}"

# Переходим в папку frontend и собираем приложение
cd frontend
echo "📦 Установка зависимостей React..."
npm install

echo "🔨 Сборка React приложения для продакшн..."
npm run build

echo -e "${GREEN}✅ React приложение собрано${NC}"

echo -e "${YELLOW}📋 Этап 2: Подготовка Laravel...${NC}"

# Переходим в папку backend
cd ../backend

echo "📦 Установка зависимостей Laravel..."
composer install --no-dev --optimize-autoloader

echo -e "${GREEN}✅ Laravel подготовлен${NC}"

echo -e "${YELLOW}📋 Этап 3: Загрузка файлов на сервер...${NC}"

# Создаем временную папку для деплоя
cd ..
mkdir -p deploy_temp

# Копируем собранный React
echo "📤 Копирование React build..."
cp -r frontend/build/* deploy_temp/

# Копируем Laravel backend
echo "📤 Копирование Laravel backend..."
cp -r backend deploy_temp/

# Копируем конфигурационные файлы
cp .env deploy_temp/
cp -r docker deploy_temp/ 2>/dev/null || true

# Создаем .htaccess для правильной маршрутизации
cat > deploy_temp/.htaccess << 'EOF'
RewriteEngine On

# Обработка API запросов - перенаправляем в backend
RewriteRule ^api/(.*)$ backend/public/index.php/$1 [L,QSA]

# Обработка статических файлов React
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/backend/
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule . /index.html [L]
EOF

# Создаем конфигурацию для backend
cat > deploy_temp/backend/.htaccess << 'EOF'
# Указываем версию PHP для NetAngels
AddHandler application/x-httpd-php84 .php

RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ public/index.php [L]
EOF

# Создаем конфигурацию для backend/public
cat > deploy_temp/backend/public/.htaccess << 'EOF'
# Указываем версию PHP для NetAngels
AddHandler application/x-httpd-php84 .php

RewriteEngine On

# Handle Authorization Header
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

# Redirect Trailing Slashes If Not A Folder...
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} (.+)/$
RewriteRule ^ %1 [L,R=301]

# Send Requests To Front Controller...
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
EOF

echo "🔄 Загрузка файлов на сервер..."
rsync -avz --delete deploy_temp/ ${SSH_USER}@${SSH_HOST}:${REMOTE_PATH}/

echo -e "${YELLOW}📋 Этап 4: Настройка на сервере...${NC}"

# Выполняем команды на сервере
ssh ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
cd dialist.ru/www

echo "🔧 Настройка Laravel на сервере..."

# Проверяем версию PHP
echo "📋 Проверка версии PHP..."
/usr/bin/php8.4 --version

# Устанавливаем зависимости через Composer с правильной версией PHP
echo "📦 Установка зависимостей Laravel..."
/usr/bin/php8.4 ~/composer.phar install --no-dev --optimize-autoloader

# Настройка прав доступа
chmod -R 755 backend/storage
chmod -R 755 backend/bootstrap/cache

# Генерация ключа приложения (если нужно)
cd backend
echo "🔑 Генерация ключа приложения..."
/usr/bin/php8.4 artisan key:generate --force

# Запуск миграций
echo "🗄️ Запуск миграций базы данных..."
/usr/bin/php8.4 artisan migrate --force

# Кэширование конфигурации
echo "⚡ Кэширование конфигурации..."
/usr/bin/php8.4 artisan config:cache
/usr/bin/php8.4 artisan route:cache
/usr/bin/php8.4 artisan view:cache

echo "✅ Настройка завершена!"
ENDSSH

# Очистка временных файлов
rm -rf deploy_temp

echo -e "${GREEN}🎉 Развертывание завершено!${NC}"
echo -e "${GREEN}🌐 Сайт доступен по адресу: https://dialist.ru${NC}"
echo -e "${GREEN}📡 API доступен по адресу: https://dialist.ru/api${NC}"

echo -e "${YELLOW}📋 Следующие шаги:${NC}"
echo "1. Проверьте работу сайта: https://dialist.ru"
echo "2. Проверьте API: https://dialist.ru/api/health"
echo "3. Протестируйте авторизацию через Telegram"