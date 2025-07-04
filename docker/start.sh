#!/bin/bash

echo "🚀 Запуск Dialist в Docker..."

# Создаем папку для логов
mkdir -p docker/logs

# Останавливаем контейнеры если запущены
docker-compose down

# Собираем и запускаем
docker-compose up --build -d

echo "✅ Dialist запущен!"
echo "🌐 Откройте в браузере: http://localhost:3000"
echo "📊 Статус: docker-compose ps"
echo "📋 Логи: docker-compose logs -f"
echo "🛑 Остановить: docker-compose down"