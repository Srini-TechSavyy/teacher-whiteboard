#!/usr/bin/env bash
# Deploy vinext Build Output with Wrangler (uses wrangler OAuth or CLOUDFLARE_API_TOKEN).
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUNDLE="$ROOT/.cloudflare/output/v0/workers/default/bundle/index.js"
ASSETS="$ROOT/.cloudflare/output/v0/workers/default/assets"

if [[ ! -f "$BUNDLE" ]]; then
  echo "Missing build output. Run: pnpm run build:vinext" >&2
  exit 1
fi

npx wrangler deploy "$BUNDLE" \
  --name teacher-whiteboard \
  --compatibility-date 2026-09-30 \
  --compatibility-flags nodejs_compat \
  --assets "$ASSETS"
