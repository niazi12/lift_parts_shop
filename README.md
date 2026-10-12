# Lift Parts Shop

Standalone UK shop for lift parts: a stocked catalogue with Stripe checkout, plus quote requests for parts not in stock.

- `web/`: Next.js (App Router, TypeScript, Tailwind, shadcn/ui). Renders every public page.
- `api/`: Django 5.2 + Django Ninja. Holds the data and the admin, and handles payments and email.

The browser only ever talks to Next.js. Next.js calls Django server side with `X-Api-Key`.

## Local setup

Requires Node 22, Python 3.12, and Docker (or Postgres 16).

```bash
# API
cp api/.env.example api/.env
docker compose up -d db           # or point DATABASE_URL at your own Postgres
cd api
python3.12 -m venv .venv && . .venv/bin/activate
pip install -r requirements-dev.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver        # http://localhost:8000/api/v1/docs

# Web (new terminal)
cd web
cp .env.example .env.local
npm install
npm run dev                       # http://localhost:3000
```

The admin is at `/backoffice/` (set with `ADMIN_PATH`), never `/admin/`.

## API contract

Django Ninja's OpenAPI schema is the contract. After you change an endpoint:

```bash
cd api && python manage.py export_openapi       # writes api/openapi.json
cd ../web && npm run api:types                  # regenerates src/lib/api-types.ts
```

CI fails if either generated file is stale.

## Checks

```bash
cd api && ruff check . && ruff format --check . && pytest
cd web && npm run lint && npm run typecheck && npm test && npm run build
```

## Build phases

1. **Foundation** (done): repo, Docker, Postgres, Django core, Ninja skeleton, health check, Next.js app, CI
2. Catalogue: Brand, Category, Product, ProductImage, search, revalidation hook
3. Quotes: QuoteRequest, presigned R2 uploads, Turnstile, emails
4. Cart and checkout: cookie cart, Stripe Checkout + Tax, webhook, stock reduction
5. Launch: legal pages, Sentry, backups, live keys
