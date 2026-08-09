# Full-Stack Starter — Next.js

The agency's production-ready **full-stack** starter based on [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter).

## ⚠️ When to use this template

Use this starter **ONLY** for full-stack projects that need:

- A database (PostgreSQL / Neon / Prisma)
- Authentication and user accounts
- Server-side business logic (API routes, server actions)
- Dashboards, admin panels, CRMs, SaaS apps

**Do NOT use this starter for pure frontend work.** For landing pages, marketing sites, or static websites (no database, no auth, no backend), start from a lightweight frontend-only scaffold instead. Forcing Prisma, PostgreSQL, and auth into a project that does not need them is a violation of agency engineering standards.

| Project type | Template |
|---|---|
| Landing page / marketing site / static | Frontend-only scaffold (no Prisma, no DB, no auth) |
| Dashboard / admin / CRM / SaaS / full-stack app | **This starter** |

## Included

- Bun package manager and lockfile
- Next.js 16.2.12, React, TypeScript, App Router
- Tailwind CSS v4 and shadcn/ui
- PostgreSQL + Prisma ORM 7
- React Hook Form + Zod + `@hookform/resolvers`
- ESLint 9 + Next config
- Oxlint + Oxfmt
- Prettier + Tailwind plugin
- Prisma schema with starter `User` and `HealthCheck` models
- Prisma scripts: generate, migrate dev/deploy, studio

## Setup

```bash
bun install
cp .env.example .env.local
bun run db:generate
bun run dev
```

Set `DATABASE_URL` in `.env.local` to a PostgreSQL or Neon connection string before running migrations:

```bash
bun run db:migrate
```

## Quality checks

```bash
bun run format:check
bun run lint
bun run lint:eslint
bun run typecheck
bun run build
```

The upstream starter's demo code produces five non-blocking ESLint warnings; there are no lint errors, type errors, or build errors.

## Project structure

```text
src/app/          App Router pages and route handlers
src/components/   Shared UI and layout components
src/features/     Feature modules
src/hooks/        Reusable hooks
src/lib/          Utilities and data helpers
prisma/           Prisma schema and database config
```

## Database commands

```bash
bun run db:generate
bun run db:migrate
bun run db:deploy
bun run db:studio
```

Never commit `.env`, `.env.local`, `DATABASE_URL`, or other credentials.

## Agency workflow

For every new full-stack customer project:

1. Create a GitHub repository under the agency organization
2. Create an isolated Neon project/database for the customer
3. Clone this starter into the project workspace
4. Configure `DATABASE_URL` and secrets as environment variables
5. Implement requirements (Prisma models, server actions, UI)
6. Run migrations, lint, typecheck, build
7. Push to GitHub and deploy to Vercel
8. Verify the deployment and return the URL

## Source

Original starter created by Kiranism. This repository adds the agency full-stack baseline without removing the original dashboard features.

## License

See [LICENSE](./LICENSE).
