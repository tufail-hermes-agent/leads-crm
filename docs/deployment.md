# Deployment

The starter deploys to Vercel out of the box, or anywhere Docker runs. `next.config.ts` sets `output: 'standalone'`, so production builds are optimized for self-hosting.

## Vercel (Agency default)

This starter is designed for the agency's standard pipeline:

1. Create a **GitHub repository** under the agency organization
2. Create an **isolated Neon project** for this customer (one project per customer application)
3. Push the starter + implementation to the GitHub repo
4. In Vercel, create a project and link it to the GitHub repo
5. Add environment variables (see below)
6. Deploy and verify

Each customer application gets its own Vercel project and its own Neon database. Never mix unrelated customer data in a shared database.

## Environment Variables for Production

Ensure these are set in your Vercel project (or deployment platform):

- `DATABASE_URL` — the customer's Neon connection string (never commit this)
- `AUTH_SECRET` (or equivalent auth secret) — long random string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` if using Clerk
- All `NEXT_PUBLIC_*` variables for client-side access
- `SENTRY_*` variables if using error tracking

Never mark a deployment successful if the build failed. If deployment fails: inspect logs, identify the root cause, fix the code/configuration, redeploy, and verify again.

## Docker

Two production-ready Dockerfiles are included: `Dockerfile` (Node.js) and `Dockerfile.bun` (Bun). Pass `NEXT_PUBLIC_*` variables as `--build-arg` at build time and runtime secrets via `-e` at run time.

Build the image:

```bash
# Node.js
docker build \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx \
  -t shadcn-dashboard .

# OR Bun
docker build -f Dockerfile.bun \
  --build-arg NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx \
  -t shadcn-dashboard .
```

Run the container:

```bash
docker run -d -p 3000:3000 \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx \
  -e CLERK_SECRET_KEY=sk_live_xxxxx \
  -e DATABASE_URL=postgresql://... \
  --restart unless-stopped \
  --name shadcn-dashboard \
  shadcn-dashboard
```

## Migration before deploy

Run database migrations before or during deployment:

```bash
bun run db:deploy   # applies prisma/migrations to the production database
```

Never manually modify the production database when a migration should be used.
