# ✅ Чек-лист для развертывания dialist.ru

## 🎯 Готово к развертыванию!

Все основные настройки уже сконфигурированы:

### ✅ Настроенные параметры:

- **🤖 Telegram Bot**: `rptx_bot` (токен: `7105955108:AAHf4cICJWShQfoixAfvVBt_5a3KleCJw_Q`)
- **🌐 Домен**: `dialist.ru` (с поддержкой `www.dialist.ru`)
- **🔧 Режим**: Production (отладка отключена)
- **📡 API URL**: `https://dialist.ru/api`

## 🚀 Команды для развертывания на сервере:

```bash
# 1. Клонирование репозитория
git clone <your-repository-url> dialist
cd dialist

# 2. Проверка готовности
make deploy-check

# 3. Запуск приложения
make start

# 4. Проверка здоровья
make health-check
```

## ⚠️ Что нужно сделать на сервере:

### 1. Установить Docker
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

### 2. Установить Docker Compose
```bash
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 3. Настроить DNS
Убедитесь, что DNS записи указывают на ваш сервер:
- `A` запись: `dialist.ru` → IP сервера
- `CNAME` запись: `www.dialist.ru` → `dialist.ru`

### 4. Настроить SSL (рекомендуется Cloudflare)
- Добавьте домен в Cloudflare
- Включите SSL в режиме "Full"
- Или используйте Let's Encrypt

### 5. Настроить файрвол
```bash
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 🔒 Безопасность (ВАЖНО!)

### Обязательно измените на сервере:

1. **Пароль базы данных** в `.env`:
   ```env
   POSTGRES_PASSWORD=ваш_новый_безопасный_пароль
   ```

2. **APP_KEY** для Laravel (сгенерируйте новый):
   ```bash
   make generate-key
   # Скопируйте результат в backend/.env
   ```

## 🧪 Тестирование после развертывания:

1. **Проверьте API**: `curl https://dialist.ru/api/health`
2. **Откройте сайт**: `https://dialist.ru`
3. **Протестируйте авторизацию** через Telegram
4. **Проверьте логи**: `make logs`

## 📞 Поддержка

Если что-то не работает:

1. **Проверьте статус**: `make status`
2. **Посмотрите логи**: `make logs`
3. **Проверьте здоровье**: `make health-check`
4. **Перезапустите**: `make restart`

## 🎉 После успешного развертывания:

- ✅ Сайт доступен по адресу: https://dialist.ru
- ✅ API работает: https://dialist.ru/api
- ✅ Telegram авторизация через @rptx_bot
- ✅ Все сервисы в Docker контейнерах

---

**🚀 Готово к запуску на сервере!**