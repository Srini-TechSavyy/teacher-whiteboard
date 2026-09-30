import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

type Db = NodePgDatabase<typeof schema>

async function resolveConnectionString(): Promise<string> {
  try {
    const { env } = await import("cloudflare:workers")
    const fromBinding = (env as { DATABASE_URL?: string }).DATABASE_URL
    if (fromBinding) {
      return fromBinding
    }
  } catch {
    // Not running in the Workers runtime (local Next.js dev, etc.).
  }

  const url = process.env.DATABASE_URL
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. For local dev, use .env.local or .env.dev. On Cloudflare, set the DATABASE_URL Worker secret.",
    )
  }
  return url
}

/** Short-lived pool per call — use Neon pooler URL in production. */
export async function getDb(): Promise<Db> {
  const connectionString = await resolveConnectionString()
  const pool = new Pool({ connectionString, max: 1 })
  return drizzle(pool, { schema })
}
