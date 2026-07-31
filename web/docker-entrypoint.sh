#!/bin/sh
# Runs on every container start:
# 1. Applies any pending Prisma migrations to the (persisted, volume-mounted)
#    SQLite database — safe to run every time, it's a no-op if already applied.
# 2. Seeds the first admin user — also safe to run every time, the seed
#    script skips if that email already exists.
# 3. Starts the Next.js production server.
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Ensuring admin user exists..."
npm run db:seed || true

echo "Starting server..."
exec npm run start
