# 🐳 Docker разработка для Dialist

## 🚀 Быстрый старт

### Запуск проекта:
```bash
make start
# или
./docker/start.sh
# или
docker-compose up --build -d
```

Откройте в браузере: **http://localhost:3000**

## 📋 Основные команды

| Команда | Описание |
|---------|----------|
| `make start` | Запустить проект |
| `make stop` | Остановить проект |
| `make restart` | Перезапустить |
| `make logs` | Показать логи |
| `make status` | Статус контейнеров |
| `make shell` | Войти в контейнер |
| `make clean` | Полная очистка |

## 🔧 Особенности разработки

### Live Reload
Файлы автоматически обновляются в контейнере:
- `index.html` - главная страница
- `styles.css` - стили
- `script.js` - JavaScript код

Просто сохраните файл и обновите страницу в браузере!

### Структура проекта в Docker:
```
/usr/share/nginx/html/
├── index.html      # Главная страница
├── styles.css      # Стили
├── script.js       # JavaScript
├── README.md       # Документация
├── images/         # Изображения (если есть)
└── assets/         # Ресурсы (если есть)
```

### Логи и отладка:
```bash
# Логи веб-сервера
make logs

# Логи в файлах
ls docker/logs/

# Войти в контейнер для отладки
make shell
```

## 🌐 Доступ к сайту

- **Основной сайт**: http://localhost:3000
- **Статус Nginx**: http://localhost:3000/nginx-status (только с localhost)

## 🛠️ Настройка портов

По умолчанию используется порт **3000**. Чтобы изменить:

1. Отредактируйте `docker-compose.yml`:
   ```yaml
   ports:
     - "8080:80"  # Изменить на нужный порт
   ```

2. Перезапустите:
   ```bash
   make restart
   ```

## 📦 Что включено в контейнер

- **Nginx Alpine** - легкий веб-сервер
- **Curl** - для HTTP запросов
- **Nano** - текстовый редактор
- **Bash** - удобная оболочка

## 🔍 Отладка проблем

### Контейнер не запускается:
```bash
# Проверить статус
docker-compose ps

# Посмотреть логи
docker-compose logs

# Пересобрать контейнер
make build
```

### Порт занят:
```bash
# Найти процесс на порту 3000
lsof -i :3000

# Остановить все контейнеры
make stop

# Изменить порт в docker-compose.yml
```

### Файлы не обновляются:
```bash
# Перезапустить контейнер
make restart

# Проверить монтирование
docker-compose exec dialist-web ls -la /usr/share/nginx/html/
```

## 🚀 Продвинутые возможности

### Запуск с инструментами разработки:
```bash
# Запустить с Node.js контейнером
docker-compose --profile tools up -d

# Войти в Node.js контейнер
docker-compose exec dialist-tools sh
```

### Кастомная конфигурация Nginx:
Отредактируйте `docker/nginx.conf` и перезапустите контейнер.

### Добавление новых файлов:
1. Добавьте файлы в проект
2. Обновите `docker-compose.yml` для монтирования
3. Перезапустите: `make restart`

## 📊 Мониторинг

### Использование ресурсов:
```bash
# Статистика контейнера
docker stats dialist-dev

# Размер образа
docker images | grep dialist
```

### Логи Nginx:
```bash
# Логи доступа
tail -f docker/logs/access.log

# Логи ошибок
tail -f docker/logs/error.log
```

## 🧹 Очистка

### Остановить и удалить:
```bash
make clean
```

### Ручная очистка:
```bash
# Остановить контейнеры
docker-compose down

# Удалить образы
docker rmi $(docker images -q dialist*)

# Очистить систему
docker system prune -f
```

## 💡 Советы

1. **Используйте make команды** - они проще и понятнее
2. **Следите за логами** - `make logs` покажет все ошибки
3. **Перезапускайте при изменении конфигурации** - `make restart`
4. **Используйте shell для отладки** - `make shell`

## 🔗 Полезные ссылки

- [Docker Compose документация](https://docs.docker.com/compose/)
- [Nginx документация](https://nginx.org/ru/docs/)
- [Docker лучшие практики](https://docs.docker.com/develop/dev-best-practices/)