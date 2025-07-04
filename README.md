# Dialist

Ежедневник со списком дел, задач и активностей для человека.

## Описание

Dialist - это веб-приложение для управления повседневными задачами и планирования активностей.

## Функциональность

- Создание и управление списками дел
- Планирование задач
- Отслеживание активностей
- Ежедневное планирование

## Установка

```bash
# Клонирование репозитория
git clone https://github.com/repitox/dialist.git
cd dialist

# Установка зависимостей
npm install

# Запуск проекта
npm start
```

## Технологии

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js
- База данных: SQLite/PostgreSQL

## 🐳 Локальная разработка с Docker

### Быстрый старт:
```bash
# Запуск проекта в Docker
make start

# Откройте в браузере: http://localhost:3000
```

### Основные команды:
```bash
make start    # Запустить проект
make stop     # Остановить
make logs     # Показать логи
make restart  # Перезапустить
```

Подробная документация: [DOCKER_DEV.md](DOCKER_DEV.md)

## Разработка

Проект находится в стадии активной разработки.

## 🚀 Автоматический деплой

Проект настроен для автоматического деплоя на сервер через GitHub Actions.

### Статус сборки:
![Deploy Status](https://github.com/repitox/dialist/actions/workflows/deploy-static.yml/badge.svg)
![Test Status](https://github.com/repitox/dialist/actions/workflows/test.yml/badge.svg)

### Как это работает:
- При каждом пуше в ветку `main` запускается автоматический деплой
- Сначала выполняются тесты и проверки
- Затем код деплоится на сервер через SSH
- Создается бэкап предыдущей версии

Подробная инструкция по настройке деплоя: [DEPLOYMENT.md](DEPLOYMENT.md)