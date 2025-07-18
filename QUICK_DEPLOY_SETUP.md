# 🚀 Быстрая настройка деплоя для NetAngels

## 📋 Что нужно сделать (5 минут):

### 1. Найдите данные для подключения к NetAngels

В панели управления NetAngels найдите:
- **IP адрес сервера** (например: `185.xxx.xxx.xxx`)
- **Ваш логин** (тот же, что для входа в панель)
- **Ваш пароль** (тот же, что для входа в панель)

### 2. Добавьте секреты в GitHub

Перейдите: https://github.com/repitox/dialist/settings/secrets/actions

Нажмите **"New repository secret"** и добавьте **3 секрета**:

| Название | Значение |
|----------|----------|
| `SSH_HOST` | IP адрес вашего сервера NetAngels |
| `SSH_USERNAME` | Ваш логин от NetAngels |
| `SSH_PASSWORD` | Ваш пароль от NetAngels |

### 3. Настройте домен в NetAngels (если нужно)

1. В панели NetAngels добавьте домен `dialist.ru` (или ваш домен)
2. Укажите папку сайта: `www`
3. Полный путь будет: `/home/ваш_логин/dialist.ru/www`

### 4. Протестируйте деплой

1. Сделайте любое изменение в коде (например, измените текст в `index.html`)
2. Сделайте commit и push:
   ```bash
   git add .
   git commit -m "Test deploy"
   git push
   ```
3. Проверьте статус деплоя: https://github.com/repitox/dialist/actions

## ✅ Готово!

После успешного деплоя ваш сайт будет доступен по адресу:
- `http://dialist.ru` (если настроили домен)
- `http://ваш-ip/dialist.ru/www` (прямой доступ)

## 🔧 Если что-то не работает:

1. **Проверьте секреты** - они должны быть точно такими же, как данные для входа в NetAngels
2. **Проверьте путь** - убедитесь, что папка `dialist.ru` существует на сервере
3. **Посмотрите логи** - в разделе Actions на GitHub будут подробные логи ошибок

## 📞 Поддержка NetAngels:
- Email: support@netangels.ru  
- Телефон: +7 (812) 385-41-36