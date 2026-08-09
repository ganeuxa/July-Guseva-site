# Безопасный деплой

Сайт статический: backend, API, формы, cookies и сторонние JavaScript-библиотеки не используются. Перед публикацией отдавайте только production-файлы из корня проекта: `index.html`, `css/`, `js/`, `assets/`, `_headers`, `vercel.json`, `.htaccess`, `README.md` и `SECURITY.md`.

## Заголовки

В проект добавлены конфиги для популярных хостингов:

- `_headers` — Netlify и Cloudflare Pages;
- `vercel.json` — Vercel;
- `.htaccess` — Apache-хостинг.

Если хостинг не читает эти файлы, вручную настройте те же HTTP-заголовки:

```http
Content-Security-Policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self' 'sha256-tJb2+sEC9OIqojvtC56dvuCRMYKgbpU3hrcwJX4SrCc='; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'none'; frame-src 'none'; frame-ancestors 'none'; form-action 'none'; upgrade-insecure-requests
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: accelerometer=(), autoplay=(), camera=(), clipboard-read=(), clipboard-write=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), publickey-credentials-get=(), usb=(), web-share=()
Strict-Transport-Security: max-age=31536000
```

Для файлов `assets/docs/*.docx` желательно отдавать:

```http
Content-Disposition: attachment
X-Content-Type-Options: nosniff
```

## Что проверять при изменениях

- Не добавлять inline-скрипты и обработчики вроде `onclick`.
- Не подключать сторонние JS/CSS без отдельной проверки и обновления CSP.
- Не публиковать рабочие макеты, архивы, `.DS_Store`, `.env` и другие служебные файлы.
- Перед заменой изображений удалять EXIF/геометки.
- DOCX-файлы публиковать без макросов: расширение должно быть `.docx`, не `.docm`.
