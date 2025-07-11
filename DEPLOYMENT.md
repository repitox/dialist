# 🚀 Развертывание Dialist на сервере

Этот документ описывает, как развернуть полнофункциональное приложение Dialist (Laravel API + React + PostgreSQL) на вашем сервере.

## 📋 Необходимые секреты GitHub

Для работы автодеплоя нужно добавить следующие секреты в настройках репозитория:

### Как добавить секреты:
1. Перейдите в ваш репозиторий на GitHub
2. Откройте `Settings` → `Secrets and variables` → `Actions`
3. Нажмите `New repository secret`
4. Добавьте каждый секрет из списка ниже

### 🔐 Список секретов:

| Название секрета | Описание | Пример |
|------------------|----------|---------|
| `SSH_HOST` | IP адрес или домен сервера NetAngels | `185.xxx.xxx.xxx` или `your-domain.com` |
| `SSH_USERNAME` | Имя пользователя SSH (логин хостинга) | `your_login` |
| `SSH_PASSWORD` | Пароль от SSH (пароль хостинга) | `your_password` |

**Примечание**: Путь к сайту автоматически формируется как `/home/SSH_USERNAME/dialist.ru/www`

## 🔑 Получение данных для подключения

Для NetAngels вам понадобятся:

1. **SSH_HOST** - IP адрес сервера (найдите в панели управления NetAngels)
2. **SSH_USERNAME** - ваш логин от хостинга
3. **SSH_PASSWORD** - ваш пароль от хостинга

Эти данные такие же, как для входа в панель управления NetAngels.

## 📁 Структура на сервере NetAngels

Workflow автоматически создаст нужную структуру:

```
/home/your_username/
└── dialist.ru/
    └── www/
        ├── index.html
        ├── styles.css
        ├── script.js
        └── другие файлы проекта
```

**Важно**: Убедитесь, что домен `dialist.ru` настроен в панели NetAngels и указывает на папку `www`.

## 🌐 Настройка веб-сервера

### Nginx
Создайте конфигурацию для сайта:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/html/dialist/current;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Кэширование статических файлов
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Apache
Создайте виртуальный хост:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/html/dialist/current
    
    <Directory /var/www/html/dialist/current>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

## 🔄 Как работает деплой

1. **Триггер**: При пуше в ветку `main` или создании pull request
2. **Checkout**: Получение кода из репозитория
3. **Deploy**: Копирование всех файлов на сервер NetAngels через SCP
   - `rm: true` - удаляет старые файлы перед копированием
   - `strip_components: 0` - сохраняет структуру папок

### Особенности упрощенного деплоя:
- ✅ **Простота**: Всего один шаг - копирование файлов
- ✅ **Скорость**: Быстрый деплой без лишних операций  
- ✅ **Надежность**: Меньше шагов = меньше возможных ошибок
- ✅ **Универсальность**: Работает с любыми статическими файлами

## 📊 Мониторинг деплоя

Следить за процессом деплоя можно в разделе `Actions` вашего репозитория на GitHub.

### Статусы:
- ✅ **Success** - деплой прошел успешно
- ❌ **Failed** - произошла ошибка
- 🟡 **In progress** - деплой выполняется

## 🛠️ Отладка проблем

### Частые ошибки:

1. **SSH ключ не работает**
   - Проверьте формат ключа (должен начинаться с `-----BEGIN`)
   - Убедитесь, что публичный ключ добавлен на сервер

2. **Нет доступа к папке**
   - Проверьте права доступа: `ls -la /var/www/html/`
   - Измените владельца: `sudo chown user:user /path/to/folder`

3. **Порт SSH заблокирован**
   - Проверьте настройки файрвола
   - Убедитесь, что SSH сервис запущен

### Тестирование SSH подключения:

```bash
# Проверяем подключение к серверу
ssh -p 22 user@your-server.com

# Проверяем доступ к папке деплоя
ssh user@your-server.com "ls -la /var/www/html/dialist/"
```

## 🔧 Дополнительные настройки

### Уведомления в Telegram/Slack
Можно добавить уведомления о статусе деплоя в мессенджеры.

### Rollback (откат)
В случае проблем можно быстро откатиться к предыдущей версии:

```bash
cd /var/www/html/dialist/
rm -rf current
mv backup current
```

### Мультисредовый деплой
Можно настроить деплой на разные сервера (staging, production) в зависимости от ветки.

## 📞 Поддержка

Если возникли проблемы с настройкой деплоя, проверьте:
1. Логи в разделе Actions на GitHub
2. Логи SSH на сервере: `/var/log/auth.log`
3. Логи веб-сервера: `/var/log/nginx/error.log`