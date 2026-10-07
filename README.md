whiteboard

Next.js teacher whiteboard with local-first IndexedDB sync and PostgreSQL on the server.

## Local development

```bash
pnpm install
cp .env.example .env.dev
# Set DATABASE_URL in .env.dev, then:
pnpm run db:schema   # first time only
pnpm dev
```

`pnpm dev` loads variables from `.env.dev` when present (via `dotenv-cli`).

Open [http://localhost:3000](http://localhost:3000).

For **local Worker preview** (`pnpm preview`), copy the same URL into `.dev.vars` (Wrangler local secrets, gitignored):

```bash
DATABASE_URL="postgresql://..."
```

## Deploy to Cloudflare Workers

This app runs on Cloudflare Workers via [vinext](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/). Postgres (e.g. [Neon](https://neon.tech)) is reached with **`DATABASE_URL`** — no Hyperdrive required for typical traffic (use Neon’s pooler URL).

### One-time setup

1. **Authenticate**

   ```bash
   npx cf auth login
   ```

2. **Schema** (if tables are not already present)

   ```bash
   pnpm run db:schema
   ```

3. **Deploy** (builds with vinext, uploads with Wrangler — uses `wrangler login` or `CLOUDFLARE_API_TOKEN`)

   ```bash
   pnpm run deploy
   ```

   Alternative full `cf` flow after `npx cf auth login`: `pnpm run deploy:cf`

4. **Production database URL** (encrypted Worker secret; not in git)

   ```bash
   npx wrangler secret put DATABASE_URL
   ```

   Or: Worker → **Settings** → **Variables and Secrets** → add encrypted `DATABASE_URL`.

### GitHub Workers Builds (CI)

In the Cloudflare dashboard: **Workers & Pages** → **teacher-whiteboard** → **Settings** → **Builds** → connect [Srini-TechSavyy/teacher-whiteboard](https://github.com/Srini-TechSavyy/teacher-whiteboard) (install the Cloudflare GitHub app when prompted).

| Setting | Value |
|---------|--------|
| Production branch | `main` |
| Build command | *(leave empty)* |
| Deploy command | `pnpm run deploy` |

Set **`DATABASE_URL` as an encrypted secret** on the Worker for runtime (dashboard or `wrangler secret put DATABASE_URL` once; secrets persist across deploys). Do not use a plain-text build variable for the connection string.

Workers Builds uses Cloudflare’s own deploy credentials when the repo is connected in the dashboard; you only need to configure the Worker secret above once.

The deploy step does not need database access for this app (`force-dynamic` home page).

### Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next.js dev server (loads `.env.dev`) |
| `pnpm dev:vinext` | vinext dev server (port 3001) |
| `pnpm build:vinext` | Production build for Workers |
| `pnpm preview` | Build + local Worker preview |
| `pnpm deploy` | Build and deploy to Cloudflare |
| `pnpm db:schema` | Apply `scripts/schema.sql` to `DATABASE_URL` |
| `pnpm cf-typegen` | Generate Worker binding types |

### v0 / Vercel

This repo is linked to [v0](https://v0.app/chat/projects/prj_lAY6m8paWRKboLIYGKGz6CaxpLmw). If v0 still auto-deploys to Vercel on `main`, disable that pipeline or use a separate branch so you do not run two production deploys.

## Built with v0

[Continue working on v0 →](https://v0.app/chat/projects/prj_lAY6m8paWRKboLIYGKGz6CaxpLmw)
