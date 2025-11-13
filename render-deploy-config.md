# Проблемы с Render и их решение

## Обнаруженные проблемы:

### 1. ❌ Ошибка подключения к БД во время build
```
Error: connect ECONNREFUSED 10.218.48.109:443
```
**Причина**: `drizzle-kit push` в команде build выполняется ДО того, как база данных станет доступной

### 2. ❌ Неправильная последовательность команд
Текущая конфигурация:
- Build: `drizzle-kit push && vite build`
- Start: `NODE_ENV=production tsx server/index.ts`

**Проблема**: База данных недоступна на этапе build

## ✅ Правильная конфигурация для Render:

### Build Command:
```bash
npm install && npm run build
```

### Start Command:
```bash
npm run db:seed && npm run db:create-admin && npm run start
```

### Обновить package.json scripts:
```json
{
  "scripts": {
    "build": "vite build",
    "start": "NODE_ENV=production tsx server/index.ts",
    "db:push": "drizzle-kit push",
    "db:seed": "tsx server/seed.ts",
    "db:create-admin": "tsx server/create-admin.ts"
  }
}
```

## 📝 Настройки в Render Dashboard:

1. **Build Command**: `npm run build`
2. **Start Command**: `npm run db:push && npm run db:seed && npm run db:create-admin && npm run start`
3. **Environment Variables** (уже настроены ✅):
   - DATABASE_URL
   - SESSION_SECRET
   - ADMIN_USER (или ADMIN_USERNAME)
   - ADMIN_PASSWORD

## 🔧 Альтернативный вариант (рекомендуемый):

Создать Pre-Deploy Command для миграций:

**Pre-Deploy Hook**: `npm run db:push`
**Build Command**: `npm run build`
**Start Command**: `npm run db:create-admin; npm run start`

---

**Важно**: Убрать `drizzle-kit push` из build команды!
