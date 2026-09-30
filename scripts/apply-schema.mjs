import { readFileSync } from "node:fs"
import { dirname, join } from "node:path"
import { fileURLToPath } from "node:url"
import pg from "pg"

const url = process.env.DATABASE_URL
if (!url) {
  console.error("Set DATABASE_URL to your Postgres connection string.")
  process.exit(1)
}

const sqlPath = join(dirname(fileURLToPath(import.meta.url)), "schema.sql")
const sql = readFileSync(sqlPath, "utf8")

const client = new pg.Client({ connectionString: url })
await client.connect()
try {
  await client.query(sql)
  console.log("Schema applied.")
} finally {
  await client.end()
}
