# alshekh.com — Personal Portfolio & Knowledge Hub

This repository contains my personal portfolio web application. It showcases my work and serves as a hub for tools and resources I want to share with others. It also doubles as a private platform to manage my work and organize content for my courses.

The project is built with Laravel 12 (PHP 8.2–8.4 compatible) and a modern front end using Inertia, React, Vite, and Tailwind CSS v4.

## Why this project
- Share tools, snippets, and resources I find useful
- Publish portfolio projects, notes, and writings
- Manage coursework materials (curriculum, lessons, assets) in a structured way
- Keep a single place to organize and iterate on my work

## Features
Current
- Laravel 12 backend with modern configuration API
- Inertia + React front-end, Vite build tool, Tailwind v4
- Health endpoint at `/up` for simple smoke checks
- Basic auth and profile/settings flows (see tests)

Planned / Roadmap
- Tools & Resources directory with tags, search, and filters
- Course content manager (modules, lessons, assets) with draft/publish workflow
- Public portfolio pages with projects, blog/notes
- Structured content authoring (Markdown + blocks) and embeddable snippets
- SSR for Inertia (optional), better SEO

## Tech Stack
- Backend: Laravel 12, PHP 8.2–8.4
- Frontend: Inertia.js, React, TypeScript, Tailwind CSS v4
- Build: Vite 7
- Testing: Pest 3 (with Laravel plugin), in-memory SQLite for tests
- Tooling: Pint (PHP), ESLint, Prettier, TypeScript

## Requirements
- PHP 8.2–8.4 with required PHP extensions for Laravel
- Composer
- Node.js >= 20 (CI uses Node 22)
- npm (or compatible package manager)

## Quick start
1) Install PHP dependencies
```
composer install --no-interaction --prefer-dist --optimize-autoloader
```

2) Configure environment
```
cp .env.example .env
php artisan key:generate
```

3) Install Node dependencies
```
npm ci
```

4) Build assets (optional for dev; required for CI/prod)
```
npm run build
```

5) Run the full dev loop (PHP server, queue listener, logs, and Vite)
```
composer dev
```
Notes:
- If `php artisan serve` is already running, stop it before starting the multiprocess dev loop.
- You can also run processes separately: `php artisan serve`, `php artisan queue:listen --tries=1`, `php artisan pail --timeout=0`, and `npm run dev`.

## Testing
Pest is configured with an in-memory SQLite database for fast, deterministic tests.

- Full suite
```
composer test
```
- Direct Pest invocation
```
./vendor/bin/pest
```
- Single file
```
./vendor/bin/pest tests/Feature/ExampleTest.php
```
- Filter by test name
```
./vendor/bin/pest -f "returns a successful response"
```
- With coverage (requires Xdebug or PCOV)
```
./vendor/bin/pest --coverage
```

Common routes used by tests (keep stable if possible):
- `/`, `/login`, `/register`, `/dashboard`, `/settings/profile`
- `/verify-email`, `/forgot-password`, `/reset-password`, `/confirm-password`
- Health check: `/up`

## Build and SSR
- Client build only:
```
npm run build
```
- Client + SSR bundle:
```
npm run build:ssr
```
- Start SSR in dev (if enabled):
```
composer dev:ssr
```

Vite configuration uses `laravel-vite-plugin` with inputs:
- `resources/css/app.css`
- `resources/js/app.tsx`
- SSR entry: `resources/js/ssr.tsx`

## Linting, Formatting, and Types
- PHP style (Pint):
```
vendor/bin/pint
```
- ESLint (flat config):
```
npm run lint
```
- Prettier with organize-imports and Tailwind plugins:
```
npm run format
```
- Type checking:
```
npm run types
```

## Troubleshooting
- App won’t boot in tests: ensure `Tests\TestCase::createApplication()` is correct and `bootstrap/app.php` exists.
- Route changes can break multiple tests: search `tests/Feature` for expectations and update accordingly.
- CSS/JS not updating in dev: ensure `npm run dev` is running.
- SQLite errors in tests: tests default to in-memory SQLite; avoid switching drivers unless you update `phpunit.xml` and tests.
- Slow local tests: disable Xdebug when not collecting coverage.

## Project scripts
- `composer dev` — multiprocess dev loop (PHP serve, queue:listen, pail, Vite)
- `composer test` — clears config and runs tests
- `npm run dev` — Vite dev server
- `npm run build` — production client build
- `npm run build:ssr` — client + SSR bundles
- `npm run lint` — ESLint
- `npm run format` — Prettier
- `npm run types` — TypeScript type check

## Directory overview
- `app/` — Laravel application code
- `resources/js/` — Inertia + React (TS/TSX) front end
- `resources/css/` — Tailwind entry
- `routes/` — HTTP and console routes
- `tests/` — Pest tests (Feature and Unit)

## License & Ownership
This is my personal portfolio and knowledge hub. Unless stated otherwise, content and code are © their respective owners. If you want to use portions of this project, please open an issue to discuss.

---

Future work includes a structured Tools & Resources section and a Course Content Manager to author, organize, and publish course material. Stay tuned.
