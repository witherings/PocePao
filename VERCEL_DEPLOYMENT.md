# Развертывание на Vercel

## ✅ Проект готов к развертыванию!

Ваш проект полностью настроен для работы на Vercel с базой данных Neon PostgreSQL.

---

## Что уже сделано:

### 1. **Конфигурация базы данных** ✅
- `server/db.ts` настроен для работы как на Replit (WebSocket), так и на Vercel (HTTP/Fetch)
- Использует `@neondatabase/serverless` драйвер
- Автоматически определяет окружение и выбирает правильный метод подключения

### 2. **Serverless функции** ✅
- Создан `api/index.ts` для Vercel serverless функций
- Все API маршруты (`/api/*`) работают через serverless
- Статические файлы и изображения обслуживаются корректно

### 3. **Конфигурация Vercel** ✅
- `vercel.json` настроен с правильной маршрутизацией
- Фронтенд билдится в `dist/public`
- API запросы перенаправляются на serverless функции

### 4. **Build скрипты** ✅
- `npm run build` собирает только фронтенд (vite build)
- Vercel автоматически обрабатывает serverless функции

---

## Шаги для развертывания:

### Шаг 1: Подготовка базы данных Neon

1. **Создайте проект на Neon.tech:**
   - Перейдите на https://neon.tech
   - Зарегистрируйтесь или войдите
   - Создайте новый проект
   - Скопируйте Connection String (он будет выглядеть так):
     ```
     postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
     ```

2. **Примените схему базы данных:**
   
   На вашем локальном компьютере (или в Replit), выполните:
   ```bash
   # Установите переменную окружения с вашей строкой подключения Neon
   export DATABASE_URL="postgresql://username:password@..."
   
   # Примените схему к базе данных
   npm run db:push
   ```

3. **Заполните базу данных (если нужно):**
   
   Если у вас есть seed скрипт:
   ```bash
   tsx server/seed.ts
   ```

### Шаг 2: Развертывание на Vercel

#### Вариант A: Через Vercel Dashboard (Рекомендуется)

1. **Загрузите проект на GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment"
   git branch -M main
   git remote add origin https://github.com/ваш-username/ваш-repo.git
   git push -u origin main
   ```

2. **Импортируйте в Vercel:**
   - Перейдите на https://vercel.com
   - Нажмите "Add New Project"
   - Импортируйте ваш GitHub репозиторий
   - Vercel автоматически определит настройки

3. **Настройте переменные окружения:**
   
   В настройках проекта Vercel добавьте:
   ```
   DATABASE_URL = postgresql://username:password@ep-xxxxx.region.aws.neon.tech/neondb?sslmode=require
   NODE_ENV = production
   ```

4. **Deploy:**
   - Нажмите "Deploy"
   - Дождитесь завершения сборки
   - Ваш сайт будет доступен по адресу `https://ваш-проект.vercel.app`

#### Вариант B: Через Vercel CLI

1. **Установите Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Войдите в Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy проект:**
   ```bash
   vercel
   ```

4. **Добавьте переменные окружения:**
   ```bash
   vercel env add DATABASE_URL
   # Введите вашу строку подключения к Neon
   
   vercel env add NODE_ENV
   # Введите: production
   ```

5. **Deploy в production:**
   ```bash
   vercel --prod
   ```

---

## Важные настройки Vercel (автоматические):

Благодаря `vercel.json`, следующие настройки применяются автоматически:

✅ **Build Command:** `npm run build` (собирает фронтенд)  
✅ **Output Directory:** `dist/public` (статические файлы)  
✅ **Serverless Functions:** `api/index.ts` (обрабатывает все API запросы)  
✅ **Routing:** Все `/api/*` маршруты идут на serverless функции, остальное на фронтенд

---

## Проверка работы на Vercel:

После деплоя проверьте:

1. **Главная страница:** `https://ваш-проект.vercel.app/`
2. **Меню:** `https://ваш-проект.vercel.app/menu`
3. **API тест:** `https://ваш-проект.vercel.app/api/categories` (должен вернуть JSON)

Если меню пустое, проверьте:
- ✅ Переменная `DATABASE_URL` установлена в Vercel
- ✅ База данных заполнена данными (выполнен seed)
- ✅ В логах Vercel Functions нет ошибок

---

## Структура проекта для Vercel:

```
.
├── api/
│   └── index.ts          # Serverless функции (обрабатывают /api/*)
├── server/
│   ├── db.ts             # Подключение к БД (поддерживает Vercel и Replit)
│   ├── routes.ts         # API маршруты
│   └── ...
├── client/               # React фронтенд
│   └── src/
├── dist/
│   └── public/           # Собранный фронтенд (создается при build)
├── vercel.json           # Конфигурация Vercel
└── package.json
```

---

## Отличия от Replit:

| Особенность | Replit | Vercel |
|------------|--------|--------|
| Окружение | `process.env.VERCEL` отсутствует | `process.env.VERCEL` = "1" |
| Подключение к БД | WebSocket (`ws`) | HTTP/Fetch |
| Сервер | Express всегда запущен | Serverless функции (запуск по запросу) |
| Статика | Обслуживается Express | Обслуживается Vercel CDN |

Код автоматически определяет окружение и работает правильно в обоих случаях! 🎉

---

## Troubleshooting:

### Проблема: Меню пустое (404 на API)

**Решение:**
1. Проверьте переменную `DATABASE_URL` в настройках Vercel
2. Откройте логи Functions в Vercel Dashboard
3. Убедитесь что база данных Neon доступна и содержит данные

### Проблема: Ошибка "WebSocket is not available"

**Решение:**
- Это нормально для Vercel! Код автоматически использует HTTP вместо WebSocket
- Убедитесь что `server/db.ts` содержит проверку `if (process.env.VERCEL)`

### Проблема: 500 Internal Server Error

**Решение:**
1. Откройте Vercel Dashboard → ваш проект → Functions
2. Посмотрите логи функции `api/index.ts`
3. Проверьте правильность `DATABASE_URL`

---

## Поддержка:

Если возникли проблемы:
1. Проверьте логи в Vercel Dashboard → Functions
2. Проверьте что все зависимости установлены (`package.json`)
3. Убедитесь что `DATABASE_URL` корректен

**Готово!** 🚀 Ваш проект теперь работает на Vercel с базой данных Neon!
