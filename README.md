# Stark Electronic Base

Интерактивный лендинг сервиса голосового ведения клиентской базы. Проект
создан на Next.js App Router, TypeScript и Tailwind CSS, использует GSAP для
скролл-сцены и серверный Route Handler для отправки заявок через Telegram.

## Локальный запуск

Требования: Node.js 20.9 или новее и npm.

```bash
npm install
copy .env.example .env.local
npm run dev
```

Сайт будет доступен по адресу `http://localhost:3000`.

Проверки и production-запуск:

```bash
npm run lint
npm test
npm run build
npm run start
```

Для browser smoke-тестов сначала один раз установите Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

## Переменные окружения

```env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NEXT_PUBLIC_SITE_URL=
```

- `TELEGRAM_BOT_TOKEN` используется только серверным маршрутом и не должен
  иметь префикс `NEXT_PUBLIC_`.
- `TELEGRAM_CHAT_ID` — ID пользователя, группы или канала для получения заявок.
- `NEXT_PUBLIC_SITE_URL` — полный production URL без завершающего `/`, например
  `https://stark-electronic-base.vercel.app`.

Файлы `.env.local` и остальные `.env*` исключены из Git. `.env.example`
содержит только названия переменных и безопасно хранится в репозитории.

## Настройка Telegram

1. Откройте `@BotFather` в Telegram и выполните `/newbot`.
2. Сохраните полученный токен в `TELEGRAM_BOT_TOKEN`.
3. Напишите созданному боту любое сообщение.
4. Откройте в браузере
   `https://api.telegram.org/bot<ТОКЕН>/getUpdates`.
5. Найдите `message.chat.id` и сохраните значение в `TELEGRAM_CHAT_ID`.
6. Для группы добавьте бота в группу, отправьте сообщение и снова вызовите
   `getUpdates`. ID группы обычно отрицательный.
7. Перезапустите локальный сервер после изменения `.env.local`.

Не публикуйте токен, ответ `getUpdates` или содержимое реальных заявок.

## Форма и защита

`POST /api/contact` валидирует данные через Zod и отправляет их в Telegram Bot
API. В коде реализованы:

- honeypot;
- проверка минимального времени заполнения и same-origin;
- ограничение размера запроса;
- блокировка дублей и до трёх запросов за десять минут на одном тёплом
  серверном инстансе;
- безопасное логирование без контактов и текста заявки.

Память Vercel Functions не является общей и постоянной. Поэтому встроенный
лимит — best effort. Для строгого глобального ограничения настройте Vercel
Firewall или подключите внешний Redis/Upstash.

## Изменение содержимого

- Все тексты, контакты, тарифы, демо-данные и настройки отдельных надписей
  находятся в `content/site-content.xlsx` на листе `Тексты`.
- Редактируйте столбец `text` и при необходимости `fontSize`,
  `fontSizeMobile`, `color`, `fontWeight`, `lineHeight`, `letterSpacing`,
  `textTransform` и `textAlign`. Столбец `key` менять нельзя.
- `npm run dev`, `npm run build` и `npm run start` автоматически запускают
  `npm run content:sync`, проверяют таблицу и обновляют файлы в
  `src/generated/`.
- Пустой стилевой параметр оставляет действующим исходный CSS. Общие стили и
  дизайн-токены по-прежнему находятся в `src/app/globals.css`.
- Демонстрационные изображения — в `public/images/demo`.
- Open Graph-карточка — `public/og.png`.

Тексты с переменными вида `{name}` или `{email}` должны сохранять эти
переменные. При ошибке в таблице синхронизация остановит запуск и укажет номер
строки. Все сведения о клиентах на сайте должны оставаться вымышленными.

## Первая публикация на Vercel

1. Создайте новый репозиторий проекта на GitHub.
2. Загрузите исходный код:

   ```bash
   git remote add origin <URL_РЕПОЗИТОРИЯ>
   git push -u origin main
   ```

3. В Vercel выберите **Add New → Project** и импортируйте репозиторий.
4. Убедитесь, что Vercel автоматически определил фреймворк **Next.js**.
5. В **Settings → Environment Variables** добавьте:

   ```env
   TELEGRAM_BOT_TOKEN=
   TELEGRAM_CHAT_ID=
   NEXT_PUBLIC_SITE_URL=
   ```

6. Выполните первый deployment.
7. Скопируйте полученный production URL вида `https://....vercel.app` и
   запишите его в `NEXT_PUBLIC_SITE_URL` для Production.
8. Выполните Redeploy: новые значения переменных не применяются к уже
   созданным deployment.
9. Откройте опубликованный сайт и отправьте тестовую заявку.
10. Убедитесь, что сообщение пришло в нужный Telegram-чат.
11. При необходимости подключите домен в **Settings → Domains**, замените
    `NEXT_PUBLIC_SITE_URL` на пользовательский URL и снова выполните Redeploy.

После подключения домена проверьте `/privacy`, `/robots.txt`, `/sitemap.xml`,
исходный canonical URL и Open Graph-изображение.

## Preview и Production

Vercel позволяет задавать отдельные значения переменных для Development,
Preview и Production. Если тестовые заявки не должны поступать в основной чат,
создайте отдельного бота или Telegram-чат для Preview и задайте соответствующие
`TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` только для этого окружения.

Для Preview можно указать branch-specific переменные. `NEXT_PUBLIC_SITE_URL` в
Production должен указывать на основной домен; для сгенерированных Preview URL
приложение имеет безопасный fallback на системные переменные Vercel.

## Последующие обновления

Зафиксируйте изменения и отправьте их в `main`:

```bash
npm run lint
npm test
npm run build
git add .
git commit -m "Update landing"
git push origin main
```

Vercel автоматически создаст новый Production Deployment. Изменения в других
ветках и pull request создают Preview Deployment. Если менялись переменные
окружения или домен, после сохранения значений запустите Redeploy вручную.

## Финальная проверка опубликованного сайта

- главная и `/privacy` открываются напрямую без 404;
- меню, CTA и карточки тарифов приводят к нужным разделам;
- скролл-сцена работает вперёд и назад на desktop;
- мобильная версия не имеет горизонтальной прокрутки;
- reduced-motion показывает читаемую последовательность;
- форма валидирует поля и отправляет заявку;
- сообщение приходит в правильный Telegram-чат;
- в консоли браузера нет ошибок;
- canonical, sitemap, robots и Open Graph используют production URL.
