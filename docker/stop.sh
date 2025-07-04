#!/bin/bash

echo "🛑 Остановка Dialist Docker контейнеров..."

docker-compose down

echo "✅ Контейнеры остановлены!"
echo "🧹 Для полной очистки: docker-compose down --volumes --rmi all"