# Makefile для Dialist проекта

.PHONY: help start stop restart logs build clean status shell

# Показать справку
help:
	@echo "🚀 Dialist - Команды для разработки:"
	@echo ""
	@echo "  make start    - Запустить проект в Docker"
	@echo "  make stop     - Остановить контейнеры"
	@echo "  make restart  - Перезапустить проект"
	@echo "  make logs     - Показать логи"
	@echo "  make build    - Пересобрать контейнер"
	@echo "  make status   - Статус контейнеров"
	@echo "  make shell    - Войти в контейнер"
	@echo "  make clean    - Очистить все контейнеры и образы"
	@echo ""
	@echo "🌐 После запуска откройте: http://localhost:3000"

# Запустить проект
start:
	@echo "🚀 Запуск Dialist..."
	@mkdir -p docker/logs
	@docker-compose up --build -d
	@echo "✅ Dialist запущен на http://localhost:3000"

# Остановить контейнеры
stop:
	@echo "🛑 Остановка контейнеров..."
	@docker-compose down
	@echo "✅ Контейнеры остановлены"

# Перезапустить
restart: stop start

# Показать логи
logs:
	@echo "📋 Логи контейнера (Ctrl+C для выхода):"
	@docker-compose logs -f dialist-web

# Пересобрать контейнер
build:
	@echo "🔨 Пересборка контейнера..."
	@docker-compose build --no-cache
	@echo "✅ Контейнер пересобран"

# Статус контейнеров
status:
	@echo "📊 Статус контейнеров:"
	@docker-compose ps

# Войти в контейнер
shell:
	@echo "🐚 Вход в контейнер..."
	@docker-compose exec dialist-web /bin/bash

# Полная очистка
clean:
	@echo "🧹 Очистка контейнеров и образов..."
	@docker-compose down --volumes --rmi all
	@docker system prune -f
	@echo "✅ Очистка завершена"

# По умолчанию показываем справку
.DEFAULT_GOAL := help