#!/usr/bin/env bash
# Apply scripts/schema.sql to the database in DATABASE_URL.
set -euo pipefail
if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Set DATABASE_URL to your Postgres connection string." >&2
  exit 1
fi
if command -v psql >/dev/null 2>&1; then
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$(dirname "$0")/schema.sql"
  echo "Schema applied."
else
  node "$(dirname "$0")/apply-schema.mjs"
fi
