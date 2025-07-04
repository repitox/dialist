# 🚀 Развертывание Dialist на сервере

## Требования к серверу

- **OS**: Ubuntu 20.04+ / CentOS 8+ / Debian 11+
- **RAM**: минимум 2GB, рекомендуется 4GB+
- **Диск**: минимум 10GB свободного места
- **Docker**: версия 20.10+
- **Docker Compose**: версия 2.0+

## ⚠️ Важные настройки перед развертыванием

### 1. Переменные окружения

**Основной .env файл:**
```env
# Telegram Bot Configuration (ОБЯЗАТЕЛЬНО ИЗМЕНИТЕ!)
TELEGRAM_BOT_TOKEN=ваш_реальный_токен_бота
TELEGRAM_BOT_USERNAME=ваш_реальный_username_бота

# Database Configuration (ИЗМЕНИТЕ ПАРОЛИ!)
POSTGRES_DB=dialist
POSTGRES_USER=dialist_user
POSTGRES_PASSWORD=ваш_безопасный_пароль_базы

# Laravel Configuration
APP_KEY=base64:ваш_сгенерированный_ключ
APP_ENV=production
APP_DEBUG=false

# React Configuration (ЗАМЕНИТЕ НА ВАШ ДОМЕН!)
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_TELEGRAM_BOT_USERNAME=ваш_реальный_username_бота
```

**backend/.env файл:**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Telegram (те же значения что в основном .env)
TELEGRAM_BOT_TOKEN=ваш_реальный_токен_бота
TELEGRAM_BOT_USERNAME=ваш_реальный_username_бота

# Database (те же пароли что в основном .env)
DB_HOST=postgres
DB_DATABASE=dialist
DB_USERNAME=dialist_user
DB_PASSWORD=ваш_безопасный_пароль_базы

# Cache
CACHE_STORE=database
```

**frontend/.env файл:**
```env
REACT_APP_API_URL=https://yourdomain.com/api
REACT_APP_TELEGRAM_BOT_USERNAME=ваш_реальный_username_бота
```

### 2. Настройка домена в Nginx

В файле `docker/nginx/default.conf` замените:
```nginx
server_name localhost yourdomain.com www.yourdomain.com;
```

## 🔧 Пошаговая установка

### 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Установка Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Перезайдите в систему!
exit
```

### 2. Развертывание приложения

```bash
# Клонирование репозитория
git clone <your-repository-url> dialist
cd dialist

# Настройка переменных окружения
cp .env.example .env
nano .env  # Заполните реальными значениями!

cp backend/.env.example backend/.env
nano backend/.env  # Заполните реальными значениями!

cp frontend/.env.example frontend/.env
nano frontend/.env  # Заполните реальными значениями!

# Генерация APP_KEY для Laravel
docker run --rm -v $(pwd)/backend:/var/www/html php:8.2-cli-alpine sh -c "cd /var/www/html && php artisan key:generate --show"
# Скопируйте полученный ключ в backend/.env

# Создание необходимых директорий
mkdir -p docker/logs

# Запуск приложения
make start
```

### 3. Проверка работоспособности

```bash
# Проверка статуса контейнеров
make status

# Проверка API
curl http://localhost/api/health

# Проверка фронтенда
curl http://localhost
```

## 🔒 Настройка SSL (HTTPS)

### Вариант 1: Let's Encrypt

```bash
# Установка Certbot
sudo apt install certbot python3-certbot-nginx

# Остановка Nginx в контейнере временно
docker-compose -f docker-compose.dev.yml stop nginx

# Получение сертификата
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Настройка SSL в Nginx конфигурации
# Добавьте в docker/nginx/default.conf:
```

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com www.yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # Остальная конфигурация...
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}
```

### Вариант 2: Cloudflare (проще)

1. Добавьте домен в Cloudflare
2. Настройте DNS записи
3. Включите SSL в режиме "Full"

## 🤖 Настройка Telegram бота

### 1. Создание бота

1. Напишите @BotFather в Telegram
2. Выполните `/newbot`
3. Следуйте инструкциям
4. Сохраните токен и username

### 2. Настройка домена бота

```bash
# Установите домен для авторизации (замените токен и домен!)
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setDomainWhitelist" \
     -H "Content-Type: application/json" \
     -d '{"domain": "yourdomain.com"}'
```

## 🔧 Полезные команды

```bash
# Просмотр логов
make logs                    # Все сервисы
make logs-backend           # Только Laravel
make logs-frontend          # Только React

# Управление контейнерами
make start                  # Запуск
make stop                   # Остановка
make restart                # Перезапуск
make status                 # Статус

# Вход в контейнеры
make shell-backend          # Laravel контейнер
make shell-frontend         # React контейнер

# Миграции и кэш
make migrate                # Запуск миграций
docker-compose -f docker-compose.dev.yml exec backend php artisan config:cache
docker-compose -f docker-compose.dev.yml exec backend php artisan route:cache
```

## 🛡️ Безопасность

### Обязательные настройки:

1. **Измените все пароли по умолчанию**
2. **Используйте HTTPS**
3. **Настройте файрвол**:
   ```bash
   sudo ufw allow 22    # SSH
   sudo ufw allow 80    # HTTP
   sudo ufw allow 443   # HTTPS
   sudo ufw enable
   ```
4. **Отключите отладку в продакшн**:
   ```env
   APP_DEBUG=false
   APP_ENV=production
   ```

## 📊 Мониторинг

```bash
# Использование ресурсов
docker stats

# Размер контейнеров
docker system df

# Логи системы
sudo journalctl -u docker.service
```

## 🔄 Резервное копирование

```bash
# Создание бэкапа базы данных
docker-compose -f docker-compose.dev.yml exec postgres pg_dump -U dialist_user dialist > backup_$(date +%Y%m%d_%H%M%S).sql

# Восстановление из бэкапа
docker-compose -f docker-compose.dev.yml exec -T postgres psql -U dialist_user dialist < backup.sql
```

## 🚨 Устранение неполадок

### Проблемы с запуском:

```bash
# Полная пересборка
docker-compose -f docker-compose.dev.yml down
docker system prune -f
make start

# Проверка логов
make logs
```

### Проблемы с Telegram авторизацией:

1. Проверьте токен и username бота
2. Убедитесь, что домен доступен из интернета
3. Проверьте CORS настройки

### Проблемы с базой данных:

```bash
# Проверка подключения
docker-compose -f docker-compose.dev.yml exec backend php artisan tinker
# В tinker: DB::connection()->getPdo();
```

## ✅ Чек-лист перед запуском

- [ ] Установлен Docker и Docker Compose
- [ ] Настроены все .env файлы с реальными значениями
- [ ] Сгенерирован APP_KEY для Laravel
- [ ] Создан и настроен Telegram бот
- [ ] Настроен домен в DNS
- [ ] Настроен SSL сертификат
- [ ] Настроен файрвол
- [ ] Проверена работоспособность всех сервисов

---

**⚠️ Важно**: После развертывания обязательно протестируйте авторизацию через Telegram!