# Исправление package-lock.json для Railway

## Проблема
Railway использует `npm ci` для установки зависимостей, который требует точного соответствия между `package.json` и `package-lock.json`. Если `package-lock.json` устарел и не содержит запись о пакете `pg`, деплой падает с ошибкой `EUSAGE`.

## Решение

### Вариант 1: Регенерировать package-lock.json локально (РЕКОМЕНДУЕТСЯ)

Это лучшее решение, которое сохраняет воспроизводимость сборки.

**На вашем компьютере (Windows):**

```bash
cd C:\Users\Erikk\Desktop\PocePao

# Удалить старый package-lock.json
del package-lock.json

# Регенерировать новый package-lock.json
npm install

# Проверить, что pg теперь есть в lockfile
type package-lock.json | findstr "\"pg\""

# Закоммитить изменения
git add package-lock.json
git commit -m "Regenerate package-lock.json with pg dependency"
git push origin main
```

### Вариант 2: Удалить package-lock.json полностью

Если вам нужно быстро задеплоить, можно удалить lockfile. Railway автоматически создаст новый.

```bash
cd C:\Users\Erikk\Desktop\PocePao

# Удалить package-lock.json
del package-lock.json

# Закоммитить удаление
git add .
git commit -m "Remove package-lock.json - Railway will regenerate"
git push origin main
```

⚠️ **Недостаток:** Railway будет использовать `npm install` вместо `npm ci`, что медленнее и менее предсказуемо.

## Проверка

После пуша изменений, Railway автоматически начнёт новый деплой. Вы должны увидеть в логах:

```
✓ npm install completed successfully
✓ npm run build completed
✓ Starting application
```

Вместо ошибки:

```
npm ERR! code EUSAGE
npm ERR! `npm ci` can only install packages when your package.json and package-lock.json are in sync.
```

## Почему это случилось?

`package-lock.json` был создан до того, как зависимость `pg` была добавлена в `package.json`, или был изменён вручную без регенерации через `npm install`.

## Дополнительные команды

Если проблема повторяется:

```bash
# Очистить npm кэш
npm cache clean --force

# Удалить node_modules и lockfile
rd /s /q node_modules
del package-lock.json

# Переустановить всё заново
npm install
```
