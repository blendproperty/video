# Video Studio portal — deployment

**Status: first version, not yet deployed or tested end-to-end.** Expect to
debug a few things on first run — same as we did getting `remotion/` running
directly, just now with a database and auth layer on top. Go through this in
order and paste me any errors.

## What this is

A small internal Next.js app that wraps `../remotion`: log in, fill in a
property form, upload 11 photos (one per labelled scene slot), and it renders
a video using the composition in `../remotion` — no terminal/SSH/WinSCP
needed for day-to-day use once this is deployed.

## Known limitations (by design, for a v1)

- **SQLite, not Postgres.** Fine for a small internal team. If this ever
  needs to run on more than one server, switch `prisma/schema.prisma`'s
  datasource and `DATABASE_URL`.
- **No real render queue.** One render "fires and forget" per request. If
  two people generate videos at the exact same time, the VPS just does both
  at once — fine occasionally, could be slow if it happens a lot. Revisit
  with a proper queue (e.g. BullMQ + Redis) if this becomes a problem.
- **Photos stored on local disk**, copied into `../remotion/public/images/jobs/<jobId>/`.
  Not backed up anywhere else. Consider periodic backups of that folder.
- **The property/media Zod schema is duplicated** between `web/lib/schema.ts`
  and `remotion/src/data/schema.ts`. If you change the property shape,
  update both.

## Prerequisites

Node.js (same version already installed for `remotion/`), and this sitting
**next to** the `remotion/` folder (same parent directory) — the render code
references it via a relative path (`../remotion`).

## First-time setup

```bash
cd /opt/midpoint-video   # or wherever you clone blendproperty/video
git pull                 # or git clone https://github.com/blendproperty/video.git
cd web
npm install
cp .env.example .env
```

Edit `.env`:
- `AUTH_SECRET` — generate one with `openssl rand -base64 32`
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — your first login (delete these two lines from `.env` after seeding, they're not needed after that)

Then:

```bash
npx prisma migrate dev --name init
npm run db:seed
```

## Run it (development / first test)

```bash
npm run dev
```

This starts on port 3100. Same as with Remotion Studio earlier, you'll
likely need an SSH tunnel to reach it from your browser, since the VPS
firewall blocks arbitrary ports:

```powershell
ssh -L 3100:localhost:3100 root@93.127.186.194
```

Then open `http://localhost:3100` in your browser and log in with the admin
credentials you seeded.

## Running it for real (production)

```bash
npm run build
npm run start
```

Keep it running permanently with PM2 (simplest option):

```bash
npm i -g pm2
pm2 start npm --name video-portal -- start
pm2 save
pm2 startup   # follow the printed instructions to enable on server reboot
```

## Putting it on a real subdomain (e.g. video.mid-point.co.za)

1. In your DNS provider, add an A record: `video` → `93.127.186.194`.
2. Install nginx and certbot if not already present:
   ```bash
   apt install -y nginx certbot python3-certbot-nginx
   ```
3. Create `/etc/nginx/sites-available/video.mid-point.co.za`:
   ```nginx
   server {
       listen 80;
       server_name video.mid-point.co.za;

       location / {
           proxy_pass http://localhost:3100;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
           client_max_body_size 50M;
       }
   }
   ```
   (`client_max_body_size 50M` matters — you're uploading 11 photos per
   request, which can add up to well over nginx's 1MB default limit.)
4. Enable it and get a certificate:
   ```bash
   ln -s /etc/nginx/sites-available/video.mid-point.co.za /etc/nginx/sites-enabled/
   nginx -t && systemctl reload nginx
   certbot --nginx -d video.mid-point.co.za
   ```
5. Visit `https://video.mid-point.co.za` — no more SSH tunnel needed once
   this is in place.

## Updating property/media schema together

If you ever add/remove a field on the property form, update **both**
`web/lib/schema.ts` and `remotion/src/data/schema.ts` (see "Known
limitations" above) — otherwise the render step will reject the data even
though the form accepted it.
