# Full-Stack Starter Next.js

Agency starter kit based on [Kiranism/next-shadcn-dashboard-starter](https://github.com/Kiranism/next-shadcn-dashboard-starter), prepared for full-stack application development.

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

## Source

Original starter created by Kiranism. This repository adds the agency full-stack baseline without removing the original dashboard features.

## License

See [LICENSE](./LICENSE).
