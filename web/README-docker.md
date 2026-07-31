# Running the portal with Docker (recommended)

This replaces `pm2` / manual `npm run dev` entirely — the container handles
building, running, database migrations, and seeding automatically every time
it starts. It also guarantees the exact Chrome/Linux dependencies Remotion
needs are present, regardless of what's installed on the host VPS.

## One-time setup

From the **repo root** (not inside `web/`):

```bash
cd /opt/midpoint-video-monorepo
```

Create `web/.env` if you haven't already (see `web/.env.example`):

```bash
SECRET=$(openssl rand -base64 32)

cat > web/.env << EOF
DATABASE_URL="file:./prisma/dev.db"
AUTH_SECRET="$SECRET"
ADMIN_EMAIL="brettd@blendproperty.co.za"
ADMIN_PASSWORD="ChangeThisPassword123!"
EOF
```

## Build and start

```bash
docker compose up -d --build
```

First build will take a few minutes (installing Chrome and its
dependencies, building the Next.js app). Subsequent restarts are fast.

Check it's actually running:

```bash
docker compose ps
docker compose logs -f video-portal
```

You should see migration output, "Created admin user..." (or "already
exists"), then "Ready" from Next.js. Press Ctrl+C to stop following logs
(the container keeps running — that only stops watching the log output).

## Verifying it

Same as before — either the SSH tunnel:

```powershell
ssh -L 3100:localhost:3100 root@93.127.186.194
```

then `http://localhost:3100`, **or**, once nginx + DNS are set up (see the
main `web/README.md`), just visit `https://video.onpointoffices.co.za`
directly — no tunnel needed at all.

## Common operations

Restart after a code change (`git pull` first):

```bash
docker compose up -d --build
```

Stop it:

```bash
docker compose down
```

(Your database, uploads, and rendered videos are safe — they live in
`./data/` on the host via the volume mounts, not inside the container.)

View logs:

```bash
docker compose logs -f video-portal
```

Open a shell inside the running container (for debugging):

```bash
docker compose exec video-portal sh
```

## Auto-start on server reboot

Docker's `restart: unless-stopped` policy (already set in
`docker-compose.yml`) means the container restarts automatically if the
Docker daemon restarts — and Docker itself is enabled to start on boot by
default on most VPS setups. Confirm with:

```bash
systemctl is-enabled docker
```

If that doesn't say `enabled`, run `systemctl enable docker`.
