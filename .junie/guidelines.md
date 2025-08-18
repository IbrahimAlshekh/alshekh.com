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

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

The Laravel Boost guidelines are specifically curated by Laravel maintainers for this application. These guidelines should be followed closely to enhance the user's satisfaction building Laravel applications.

## Foundational Context
This application is a Laravel application and its main Laravel ecosystems package & versions are below. You are an expert with them all. Ensure you abide by these specific packages & versions.

- php - 8.4.11
- inertiajs/inertia-laravel (INERTIA) - v2
- laravel/framework (LARAVEL) - v12
- laravel/prompts (PROMPTS) - v0
- tightenco/ziggy (ZIGGY) - v2
- laravel/pint (PINT) - v1
- pestphp/pest (PEST) - v3
- @inertiajs/react (INERTIA) - v2
- react (REACT) - v19
- tailwindcss (TAILWINDCSS) - v4


## Conventions
- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts
- Do not create verification scripts or tinker when tests cover that functionality and prove it works. Unit and feature tests are more important.

## Application Structure & Architecture
- Stick to existing directory structure - don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling
- If the user doesn't see a frontend change reflected in the UI, it could mean they need to run `npm run build`, `npm run dev`, or `composer run dev`. Ask them.

## Replies
- Be concise in your explanations - focus on what's important rather than explaining obvious details.

## Documentation Files
- You must only create documentation files if explicitly requested by the user.


=== boost rules ===

## Laravel Boost
- Laravel Boost is an MCP server that comes with powerful tools designed specifically for this application. Use them.

## Artisan
- Use the `list-artisan-commands` tool when you need to call an Artisan command to double check the available parameters.

## URLs
- Whenever you share a project URL with the user you should use the `get-absolute-url` tool to ensure you're using the correct scheme, domain / IP, and port.

## Tinker / Debugging
- You should use the `tinker` tool when you need to execute PHP to debug code or query Eloquent models directly.
- Use the `database-query` tool when you only need to read from the database.

## Reading Browser Logs With the `browser-logs` Tool
- You can read browser logs, errors, and exceptions using the `browser-logs` tool from Boost.
- Only recent browser logs will be useful - ignore old logs.

## Searching Documentation (Critically Important)
- Boost comes with a powerful `search-docs` tool you should use before any other approaches. This tool automatically passes a list of installed packages and their versions to the remote Boost API, so it returns only version-specific documentation specific for the user's circumstance. You should pass an array of packages to filter on if you know you need docs for particular packages.
- The 'search-docs' tool is perfect for all Laravel related packages, including Laravel, Inertia, Livewire, Filament, Tailwind, Pest, Nova, Nightwatch, etc.
- You must use this tool to search for Laravel-ecosystem documentation before falling back to other approaches.
- Search the documentation before making code changes to ensure we are taking the correct approach.
- Use multiple, broad, simple, topic based queries to start. For example: `['rate limiting', 'routing rate limiting', 'routing']`.
- Do not add package names to queries - package information is already shared. For example, use `test resource table`, not `filament 4 test resource table`.

### Available Search Syntax
- You can and should pass multiple queries at once. The most relevant results will be returned first.

1. Simple Word Searches with auto-stemming - query=authentication - finds 'authenticate' and 'auth'
2. Multiple Words (AND Logic) - query=rate limit - finds knowledge containing both "rate" AND "limit"
3. Quoted Phrases (Exact Position) - query="infinite scroll" - Words must be adjacent and in that order
4. Mixed Queries - query=middleware "rate limit" - "middleware" AND exact phrase "rate limit"
5. Multiple Queries - queries=["authentication", "middleware"] - ANY of these terms


=== php rules ===

## PHP

- Always use curly braces for control structures, even if it has one line.

### Constructors
- Use PHP 8 constructor property promotion in `__construct()`.
    - <code-snippet>public function __construct(public GitHub $github) { }</code-snippet>
- Do not allow empty `__construct()` methods with zero parameters.

### Type Declarations
- Always use explicit return type declarations for methods and functions.
- Use appropriate PHP type hints for method parameters.

<code-snippet name="Explicit Return Types and Method Params" lang="php">
protected function isAccessible(User $user, ?string $path = null): bool
{
    ...
}
</code-snippet>

## Comments
- Prefer PHPDoc blocks over comments. Never use comments within the code itself unless there is something _very_ complex going on.

## PHPDoc Blocks
- Add useful array shape type definitions for arrays when appropriate.

## Enums
- Typically, keys in an Enum should be TitleCase. For example: `FavoritePerson`, `BestLake`, `Monthly`.


=== herd rules ===

## Laravel Herd

- The application is served by Laravel Herd and will be available at: https?://[kebab-case-project-dir].test. Use the `get-absolute-url` tool to generate URLs for the user to ensure valid URLs.
- You must not run any commands to make the site available via HTTP(s). It is _always_ available through Laravel Herd.


=== inertia-laravel/core rules ===

## Inertia Core

- Inertia.js components should be placed in the `resources/js/Pages` directory unless specified differently in the JS bundler (vite.config.js).
- Use `Inertia::render()` for server-side routing instead of traditional Blade views.

<code-snippet lang="php" name="Inertia::render Example">
// routes/web.php example
Route::get('/users', function () {
    return Inertia::render('Users/Index', [
        'users' => User::all()
    ]);
});
</code-snippet>


=== inertia-laravel/v2 rules ===

## Inertia v2

- Make use of all Inertia features from v1 & v2. Check the documentation before making any changes to ensure we are taking the correct approach.

### Inertia v2 New Features
- Polling
- Prefetching
- Deferred props
- Infinite scrolling using merging props and `WhenVisible`
- Lazy loading data on scroll

### Deferred Props & Empty States
- When using deferred props on the frontend, you should add a nice empty state with pulsing / animated skeleton.


=== laravel/core rules ===

## Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using the `list-artisan-commands` tool.
- If you're creating a generic PHP class, use `artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Database
- Always use proper Eloquent relationship methods with return type hints. Prefer relationship methods over raw queries or manual joins.
- Use Eloquent models and relationships before suggesting raw database queries
- Avoid `DB::`; prefer `Model::query()`. Generate code that leverages Laravel's ORM capabilities rather than bypassing them.
- Generate code that prevents N+1 query problems by using eager loading.
- Use Laravel's query builder for very complex database operations.

### Model Creation
- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `list-artisan-commands` to check the available options to `php artisan make:model`.

### APIs & Eloquent Resources
- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

### Controllers & Validation
- Always create Form Request classes for validation rather than inline validation in controllers. Include both validation rules and custom error messages.
- Check sibling Form Requests to see if the application uses array or string based validation rules.

### Queues
- Use queued jobs for time-consuming operations with the `ShouldQueue` interface.

### Authentication & Authorization
- Use Laravel's built-in authentication and authorization features (gates, policies, Sanctum, etc.).

### URL Generation
- When generating links to other pages, prefer named routes and the `route()` function.

### Configuration
- Use environment variables only in configuration files - never use the `env()` function directly outside of config files. Always use `config('app.name')`, not `env('APP_NAME')`.

### Testing
- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] <name>` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

### Vite Error
- If you receive an "Illuminate\Foundation\ViteException: Unable to locate file in Vite manifest" error, you can run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.


=== laravel/v12 rules ===

## Laravel 12

- Use the `search-docs` tool to get version specific documentation.
- Since Laravel 11, Laravel has a new streamlined file structure which this project uses.

### Laravel 12 Structure
- No middleware files in `app/Http/Middleware/`.
- `bootstrap/app.php` is the file to register middleware, exceptions, and routing files.
- `bootstrap/providers.php` contains application specific service providers.
- **No app\Console\Kernel.php** - use `bootstrap/app.php` or `routes/console.php` for console configuration.
- **Commands auto-register** - files in `app/Console/Commands/` are automatically available and do not require manual registration.

### Database
- When modifying a column, the migration must include all of the attributes that were previously defined on the column. Otherwise, they will be dropped and lost.
- Laravel 11 allows limiting eagerly loaded records natively, without external packages: `$query->latest()->limit(10);`.

### Models
- Casts can and likely should be set in a `casts()` method on a model rather than the `$casts` property. Follow existing conventions from other models.


=== pint/core rules ===

## Laravel Pint Code Formatter

- You must run `vendor/bin/pint --dirty` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test`, simply run `vendor/bin/pint` to fix any formatting issues.


=== pest/core rules ===

## Pest

### Testing
- If you need to verify a feature is working, write or update a Unit / Feature test.

### Pest Tests
- All tests must be written using Pest. Use `php artisan make:test --pest <name>`.
- You must not remove any tests or test files from the tests directory without approval. These are not temporary or helper files - these are core to the application.
- Tests should test all of the happy paths, failure paths, and weird paths.
- Tests live in the `tests/Feature` and `tests/Unit` directories.
- Pest tests look and behave like this:
<code-snippet name="Basic Pest Test Example" lang="php">
it('is true', function () {
    expect(true)->toBeTrue();
});
</code-snippet>

### Running Tests
- Run the minimal number of tests using an appropriate filter before finalizing code edits.
- To run all tests: `php artisan test`.
- To run all tests in a file: `php artisan test tests/Feature/ExampleTest.php`.
- To filter on a particular test name: `php artisan test --filter=testName` (recommended after making a change to a related file).
- When the tests relating to your changes are passing, ask the user if they would like to run the entire test suite to ensure everything is still passing.

### Pest Assertions
- When asserting status codes on a response, use the specific method like `assertForbidden` and `assertNotFound` instead of using `assertStatus(403)` or similar, e.g.:
<code-snippet name="Pest Example Asserting postJson Response" lang="php">
it('returns all', function () {
    $response = $this->postJson('/api/docs', []);

    $response->assertSuccessful();
});
</code-snippet>

### Mocking
- Mocking can be very helpful when appropriate.
- When mocking, you can use the `Pest\Laravel\mock` Pest function, but always import it via `use function Pest\Laravel\mock;` before using it. Alternatively, you can use `$this->mock()` if existing tests do.
- You can also create partial mocks using the same import or self method.

### Datasets
- Use datasets in Pest to simplify tests which have a lot of duplicated data. This is often the case when testing validation rules, so consider going with this solution when writing tests for validation rules.

<code-snippet name="Pest Dataset Example" lang="php">
it('has emails', function (string $email) {
    expect($email)->not->toBeEmpty();
})->with([
    'james' => 'james@laravel.com',
    'taylor' => 'taylor@laravel.com',
]);
</code-snippet>


=== inertia-react/core rules ===

## Inertia + React

- Use `router.visit()` or `<Link>` for navigation instead of traditional links.

<code-snippet lang="react" name="Inertia Client Navigation">
    import { Link } from '@inertiajs/react'

    <Link href="/">Home</Link>
</code-snippet>

- For form handling, use `router.post` and related methods. Do not use regular forms.

<code-snippet lang="react" name="Inertia React Form Example">
import { useState } from 'react'
import { router } from '@inertiajs/react'

export default function Edit() {
    const [values, setValues] = useState({
        first_name: "",
        last_name: "",
        email: "",
    })

    function handleChange(e) {
        const key = e.target.id;
        const value = e.target.value

        setValues(values => ({
            ...values,
            [key]: value,
        }))
    }

    function handleSubmit(e) {
        e.preventDefault()

        router.post('/users', values)
    }

    return (
    <form onSubmit={handleSubmit}>
        <label htmlFor="first_name">First name:</label>
        <input id="first_name" value={values.first_name} onChange={handleChange} />
        <label htmlFor="last_name">Last name:</label>
        <input id="last_name" value={values.last_name} onChange={handleChange} />
        <label htmlFor="email">Email:</label>
        <input id="email" value={values.email} onChange={handleChange} />
        <button type="submit">Submit</button>
    </form>
    )
}
</code-snippet>


=== tailwindcss/core rules ===

## Tailwind Core

- Use Tailwind CSS classes to style HTML, check and use existing tailwind conventions within the project before writing your own.
- Offer to extract repeated patterns into components that match the project's conventions (i.e. Blade, JSX, Vue, etc..)
- Think through class placement, order, priority, and defaults - remove redundant classes, add classes to parent or child carefully to limit repetition, group elements logically
- You can use the `search-docs` tool to get exact examples from the official documentation when needed.

### Spacing
- When listing items, use gap utilities for spacing, don't use margins.

    <code-snippet name="Valid Flex Gap Spacing Example" lang="html">
        <div class="flex gap-8">
            <div>Superior</div>
            <div>Michigan</div>
            <div>Erie</div>
        </div>
    </code-snippet>


### Dark Mode
- If existing pages and components support dark mode, new pages and components must support dark mode in a similar way, typically using `dark:`.


=== tailwindcss/v4 rules ===

## Tailwind 4

- Always use Tailwind CSS v4 - do not use the deprecated utilities.
- `corePlugins` is not supported in Tailwind v4.
- In Tailwind v4, you import Tailwind using a regular CSS `@import` statement, not using the `@tailwind` directives used in v3:

<code-snippet name="Tailwind v4 Import Tailwind Diff" lang="diff"
   - @tailwind base;
   - @tailwind components;
   - @tailwind utilities;
   + @import "tailwindcss";
</code-snippet>


### Replaced Utilities
- Tailwind v4 removed deprecated utilities. Do not use the deprecated option - use the replacement.
- Opacity values are still numeric.

| Deprecated |	Replacement |
|------------+--------------|
| bg-opacity-* | bg-black/* |
| text-opacity-* | text-black/* |
| border-opacity-* | border-black/* |
| divide-opacity-* | divide-black/* |
| ring-opacity-* | ring-black/* |
| placeholder-opacity-* | placeholder-black/* |
| flex-shrink-* | shrink-* |
| flex-grow-* | grow-* |
| overflow-ellipsis | text-ellipsis |
| decoration-slice | box-decoration-slice |
| decoration-clone | box-decoration-clone |


=== tests rules ===

## Test Enforcement

- Every change must be programmatically tested. Write a new test or update an existing test, then run the affected tests to make sure they pass.
- Run the minimum number of tests needed to ensure code quality and speed. Use `php artisan test` with a specific filename or filter.
</laravel-boost-guidelines>