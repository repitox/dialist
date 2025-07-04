# Makefile для Dialist проекта

.PHONY: help start stop restart logs build clean status shell-backend shell-frontend migrate deploy-check

# Показать справку
help:
	@echo "🚀 Dialist - Команды для разработки:"
	@echo ""
	@echo "  make start         - Запустить весь стек (Laravel API + React + PostgreSQL)"
	@echo "  make stop          - Остановить все контейнеры"
	@echo "  make restart       - Перезапустить проект"
	@echo "  make logs          - Показать логи всех сервисов"
	@echo "  make logs-backend  - Показать логи Laravel API"
	@echo "  make logs-frontend - Показать логи React"
	@echo "  make build         - Пересобрать все контейнеры"
	@echo "  make status        - Статус всех контейнеров"
	@echo "  make shell-backend - Войти в контейнер Laravel"
	@echo "  make shell-frontend- Войти в контейнер React"
	@echo "  make migrate       - Запустить миграции Laravel"
	@echo "  make clean         - Очистить все контейнеры и образы"
	@echo ""
	@echo "🚀 Команды для развертывания:"
	@echo "  make deploy-check  - Проверить готовность к развертыванию"
	@echo "  make generate-key  - Сгенерировать APP_KEY для Laravel"
	@echo "  make health-check  - Проверить здоровье всех сервисов"
	@echo ""
	@echo "🌐 После запуска:"
	@echo "  - Фронтенд: http://localhost (через Nginx)"
	@echo "  - API: http://localhost/api"
	@echo "  - React Dev: http://localhost:3000"
	@echo "  - Laravel Dev: http://localhost:8000"

# Запустить проект
start:
	@echo "🚀 Запуск Dialist полного стека..."
	@mkdir -p docker/logs
	@docker-compose -f docker-compose.dev.yml up --build -d
	@echo "⏳ Ожидание запуска сервисов..."
	@sleep 10
	@echo "🔄 Запуск миграций..."
	@make migrate
	@echo "✅ Dialist запущен!"
	@echo "🌐 Откройте: http://localhost"

# Остановить контейнеры
stop:
	@echo "🛑 Остановка контейнеров..."
	@docker-compose -f docker-compose.dev.yml down
	@echo "✅ Контейнеры остановлены"

# Перезапустить
restart: stop start

# Показать логи всех сервисов
logs:
	@echo "📋 Логи всех сервисов (Ctrl+C для выхода):"
	@docker-compose -f docker-compose.dev.yml logs -f

# Логи backend
logs-backend:
	@echo "📋 Логи Laravel API:"
	@docker-compose -f docker-compose.dev.yml logs -f backend

# Логи frontend
logs-frontend:
	@echo "📋 Логи React:"
	@docker-compose -f docker-compose.dev.yml logs -f frontend

# Пересобрать контейнеры
build:
	@echo "🔨 Пересборка всех контейнеров..."
	@docker-compose -f docker-compose.dev.yml build --no-cache
	@echo "✅ Контейнеры пересобраны"

# Статус контейнеров
status:
	@echo "📊 Статус контейнеров:"
	@docker-compose -f docker-compose.dev.yml ps

# Войти в контейнер Laravel
shell-backend:
	@echo "🐚 Вход в контейнер Laravel..."
	@docker-compose -f docker-compose.dev.yml exec backend /bin/bash

# Войти в контейнер React
shell-frontend:
	@echo "🐚 Вход в контейнер React..."
	@docker-compose -f docker-compose.dev.yml exec frontend /bin/sh

# Запустить миграции
migrate:
	@echo "🔄 Запуск миграций Laravel..."
	@docker-compose -f docker-compose.dev.yml exec backend php artisan migrate --force
	@echo "✅ Миграции выполнены"

# Полная очистка
clean:
	@echo "🧹 Очистка контейнеров и образов..."
	@docker-compose -f docker-compose.dev.yml down --volumes --rmi all
	@docker system prune -f
	@echo "✅ Очистка завершена"

# Проверка готовности к развертыванию
deploy-check:
	@echo "🔍 Проверка готовности к развертыванию..."
	@echo "📋 Проверяем конфигурационные файлы:"
	@if [ ! -f .env ]; then echo "❌ Отсутствует .env файл"; exit 1; else echo "✅ .env найден"; fi
	@if [ ! -f backend/.env ]; then echo "❌ Отсутствует backend/.env файл"; exit 1; else echo "✅ backend/.env найден"; fi
	@if [ ! -f frontend/.env ]; then echo "❌ Отсутствует frontend/.env файл"; exit 1; else echo "✅ frontend/.env найден"; fi
	@echo "📋 Проверяем критические переменные:"
	@if grep -q "your_bot_token_here" .env 2>/dev/null; then echo "❌ Не настроен TELEGRAM_BOT_TOKEN в .env"; exit 1; else echo "✅ TELEGRAM_BOT_TOKEN настроен"; fi
	@if grep -q "your_bot_username_here" .env 2>/dev/null; then echo "❌ Не настроен TELEGRAM_BOT_USERNAME в .env"; exit 1; else echo "✅ TELEGRAM_BOT_USERNAME настроен"; fi
	@if grep -q "localhost" frontend/.env 2>/dev/null; then echo "⚠️  В frontend/.env используется localhost - измените на ваш домен"; fi
	@echo "✅ Базовая проверка пройдена!"
	@echo "📖 Для полной инструкции по развертыванию см. SERVER_SETUP.md"

# Генерация APP_KEY для Laravel
generate-key:
	@echo "🔑 Генерация APP_KEY для Laravel..."
	@docker run --rm -v $(PWD)/backend:/var/www/html php:8.2-cli-alpine sh -c "cd /var/www/html && php artisan key:generate --show"

# Проверка здоровья всех сервисов
health-check:
	@echo "🏥 Проверка здоровья сервисов..."
	@echo "📊 Статус контейнеров:"
	@docker-compose -f docker-compose.dev.yml ps
	@echo "🔍 Проверка API:"
	@curl -f http://localhost/api/health || echo "❌ API не отвечает"
	@echo "🔍 Проверка фронтенда:"
	@curl -f http://localhost > /dev/null && echo "✅ Фронтенд работает" || echo "❌ Фронтенд не отвечает"

# По умолчанию показываем справку
.DEFAULT_GOAL := help