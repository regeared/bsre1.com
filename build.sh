#!/usr/bin/env bash
# Minify site scripts. Sources stay readable; pages load the .min.js builds.
# Requires Node (uses npx terser). Run after editing any .js file.
set -euo pipefail
cd "$(dirname "$0")"
for f in base/analytics.js base/injector.js static/js/opt-out.js static/js/redirect.js; do
  out="${f%.js}.min.js"
  npx --yes terser@5 "$f" --compress --mangle --comments false -o "$out"
  printf '%-28s %6s -> %6s bytes\n' "$f" "$(wc -c < "$f")" "$(wc -c < "$out")"
done
