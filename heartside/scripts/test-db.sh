#!/usr/bin/env bash
# Applies the Supabase stub and every migration to an empty, disposable PostgreSQL
# database, then runs the policy tests. Never point this at a real Supabase project.
set -euo pipefail
: "${DATABASE_URL:?Set DATABASE_URL to an empty, disposable PostgreSQL database}"
cd "$(dirname "$0")/.."

run_sql() { psql -X -q -v ON_ERROR_STOP=1 "$DATABASE_URL" "$@"; }

run_sql -f supabase/tests/supabase_stub.sql
for migration in supabase/migrations/*.sql; do run_sql -f "$migration"; done
run_sql -f supabase/tests/policies.test.sql
