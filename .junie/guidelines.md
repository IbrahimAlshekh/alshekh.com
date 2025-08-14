Project-specific Development Guidelines

Audience: This document targets experienced Laravel + Inertia/React developers working on this repository. It focuses on the project’s concrete build, test, and development conventions rather than generic Laravel instructions.

1. Build and Configuration

Backend (Laravel 12)
- PHP version: The codebase targets PHP ^8.4 (composer.json). CI currently uses PHP 8.4; keep compatibility with 8.2–8.4.
- Dependencies: composer install --no-interaction --prefer-dist --optimize-autoloader
- Environment: cp .env.example .env and then php artisan key:generate
- App bootstrap: bootstrap/app.php uses the new Laravel 12 configuration API with:
  - withRouting(web: routes/web.php, commands: routes/console.php, health: /up)
  - withMiddleware: adds HandleAppearance, HandleInertiaRequests and AddLinkHeadersForPreloadedAssets to the web stack
  - Health endpoint: GET /up returns application health (useful for ops and smoke checks)
- Dev runner: composer dev runs a multiprocess dev loop via npx concurrently:
  - php artisan serve (HTTP server)
  - php artisan queue:listen --tries=1 (queue)
  - php artisan pail --timeout=0 (live application logs)
  - npm run dev (Vite)
  Notes:
  - Requires Node and npm in PATH. npx will download concurrently if missing.
  - Stop any previous php artisan serve before running this.

Frontend (Vite + React + Tailwind v4)
- Node version: CI uses Node 22; local usage of Node >=20 is recommended. Align with Vite 7.
- Install deps: npm ci (preferred in CI) or npm install
- Build:
  - npm run build for client build
  - npm run build:ssr for client + SSR bundles
- Dev server(s): npm run dev starts Vite (used by composer dev or run standalone during frontend-only work)
- Vite config highlights (vite.config.ts):
  - laravel-vite-plugin with input: resources/css/app.css and resources/js/app.tsx
  - SSR entry: resources/js/ssr.tsx
  - tailwindcss() plugin enabled; alias ziggy-js to vendor/tightenco/ziggy

2. Testing: How to Run, Add, and Structure Tests

Framework and tooling
- Test runner: Pest 3 with Laravel plugin (pestphp/pest, pestphp/pest-plugin-laravel). You may still write raw PHPUnit tests, but Pest style is preferred.
- Default DB for tests: In-memory SQLite configured in phpunit.xml
  - DB_CONNECTION=sqlite
  - DB_DATABASE=:memory:
  - Tests using RefreshDatabase will run migrations automatically against the ephemeral database.
- phpunit.xml also optimizes for test speed: reduced bcrypt rounds, array mailer, array session, sync queue, etc.

Testing strategy
- Prefer unit tests where practical (assert business logic at the method/class level).
- Prefer light integration tests over end-to-end browser tests. HTTP Feature tests should focus on controller and routing behavior.
- Keep tests fast and deterministic; avoid external services. Use Laravel fakes/mocks (Notification::fake, Mail::fake, Bus::fake, Event::fake) and in-memory SQLite.

Running tests
- Full suite:
  - composer test (runs: php artisan config:clear && php artisan test)
  - Or: ./vendor/bin/pest
- Single file:
  - ./vendor/bin/pest tests/Feature/ExampleTest.php
- Single test by name filter (regex):
  - ./vendor/bin/pest -f "returns a successful response"
- Tests with coverage (requires Xdebug or PCOV):
  - ./vendor/bin/pest --coverage

Creating a new test (Pest style)
- Location: tests/Feature for HTTP/integration and tests/Unit for isolated logic
- Example minimal Feature test file (uses the HTTP kernel and no DB):
  tests/Feature/HealthcheckTest.php
  <?php
  it('responds to the health endpoint', function () {
      $this->get('/up')->assertOk();
  });
- Example with DB using RefreshDatabase and model factory:
  tests/Feature/ExampleUserTest.php
  <?php
  use App\Models\User;
  uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);
  test('can create user via factory', function () {
      $user = User::factory()->create();
      expect($user->exists)->toBeTrue();
  });

Existing tests (reference)
- A lightweight smoke test exists: tests/Feature/ExampleTest.php which does GET / and expects 200.
- Comprehensive auth/profile flows exist under tests/Feature/Auth/* and tests/Feature/Settings/*.

Notes and pitfalls
- Ensure Tests\TestCase boots the application (createApplication hook implemented) so the HTTP kernel is available for Feature tests.
- If you introduce migrations required by tests, either:
  - Add uses(RefreshDatabase::class) in the Pest file, or
  - Setup the DB explicitly in the test or a Pest beforeEach hook.
- When changing routes, keep in mind multiple tests rely on:
  - /, /login, /register, /dashboard, /settings/profile, /verify-email, /forgot-password, /reset-password, /confirm-password

3. Linting, Formatting, and Code Style

PHP
- Use Laravel Pint: vendor/bin/pint (CI runs it). Configure via pint.json if needed (not present by default).
- Keep code compatible with PHP 8.2–8.4. Avoid bleeding-edge 8.4-only features.
- Add strict types and type declarations when possible (typed properties, return types, parameter types). Use docblocks for complex generics/array shapes.

JavaScript/TypeScript/React
- Source files should be .ts/.tsx. Avoid adding new .js/.jsx files.
- Avoid any types. Prefer precise types using React.FC<Props>, utility types, and inference from libraries. If absolutely necessary, narrow unknown rather than using any.
- Prefer functional components with hooks. No class components.
- State: Use React hooks for local state. Introduce global state only when multiple distant components need it. If you add a store later, prefer lightweight solutions; Redux is not currently used in this repo.
- UI libraries: Avoid importing Ant Design directly. We use TailwindCSS utilities, Radix UI primitives, and Headless UI patterns already present in dependencies.
- ESLint (flat config) is configured with typescript-eslint and react plugins. Run npm run lint to fix issues.
- Prettier with organize-imports and tailwindcss plugins: npm run format; check with npm run format:check.
- Type checking: npm run types (tsc --noEmit).
- Ignore patterns: vendor, node_modules, public, bootstrap/ssr, tailwind.config.js.

Frontend testing (future-proof guidance only)
- The repo currently does not include a JS test runner. If/when we introduce frontend tests, prefer Jest or Vitest combined with React Testing Library.
- Testing Library principles: test behavior, not implementation; avoid shallow rendering; no Enzyme.
- Do not add Cypress unless strictly necessary; prefer unit/integration tests.

4. Local Development Workflows

Full stack dev (recommended):
- Terminal 1: composer dev
  - Runs PHP server, queue worker, pail (live logs), and Vite dev server concurrently.
- Alternatively, separate processes:
  - php artisan serve
  - php artisan queue:listen --tries=1
  - php artisan pail --timeout=0
  - npm run dev

SSR development
- Build client & SSR bundles: npm run build:ssr
- Start SSR (if enabled): composer dev:ssr (includes inertia:start-ssr in the concurrent process list)

Environment and configuration tips
- .env is required for local HTTP server even though tests use phpunit.xml overrides.
- For email-related features in tests, MAIL_MAILER is set to array; no external SMTP is needed for the suite.
- For DB in tests, you do not need a local database server; all runs in-memory via SQLite.

5. CI/CD and Project Conventions

GitHub Actions
- tests.yml:
  - Node 22: npm ci && npm run build
  - PHP 8.4: composer install, then cp .env.example .env, php artisan key:generate
  - Runs ./vendor/bin/pest
- linter.yml:
  - composer install and npm install
  - Runs Pint, Prettier (npm run format), and ESLint (npm run lint)

Commit hygiene
- Keep feature commits focused and update related tests in the same PR.
- Run composer test and npm run lint locally before pushing.

6. Troubleshooting and Debugging

- Tests fail to bootstrap the app: Ensure Tests\TestCase defines createApplication() and that bootstrap/app.php exists and is compatible.
- Route changes break multiple tests: search tests/Feature for endpoints and update assertions accordingly.
- CSS/JS changes not reflected: In dev, ensure npm run dev is running; in CI or prod builds, run npm run build.
- SQLite errors during tests: If you switch DB drivers, update phpunit.xml accordingly, or remove uses(RefreshDatabase::class) where not needed.
- Slow tests locally: Disable Xdebug unless you need coverage; php -n or set Xdebug off.

7. Quick start command snippets

- Install & build:
  - composer install
  - cp .env.example .env && php artisan key:generate
  - npm ci && npm run build
- Run tests:
  - composer test
  - ./vendor/bin/pest tests/Feature/ExampleTest.php
- Dev loop:
  - composer dev

8. Additional Architecture & Data Guidelines (Laravel-specific)
- Prefer Eloquent factories and seeders for test data; avoid hard-coded IDs.
- When filtering booleans in queries, use whereTrue()/whereFalse() helpers (or where('flag', true/false)) instead of equality on raw booleans in PHP conditions.
- Consider ULIDs for new models (Laravel supports ULIDs out of the box) if you need globally unique identifiers. If you introduce ULIDs, update validation, routes, and any tests asserting integer IDs.

Note about temporary demo tests: When creating quick demonstration tests for documentation or experiments, prefer placing them under tests/Feature and removing them before committing if they do not provide long-term value. The repository already includes tests/Feature/ExampleTest.php, which you can use as a minimal smoke test.
