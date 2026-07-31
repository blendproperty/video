# Follows Remotion's official Docker guidance for Chromium dependencies:
# https://www.remotion.dev/docs/docker
#
# This single image holds BOTH remotion/ (the video composition) and web/
# (the portal) since web/lib/render.ts references ../remotion by relative
# path at runtime.

FROM node:22-bookworm-slim

# --- Chrome Headless Shell dependencies (per Remotion's Docker docs) ------
RUN apt-get update && apt-get install -y \
  libnss3 \
  libdbus-1-3 \
  libatk1.0-0 \
  libgbm-dev \
  libasound2 \
  libxrandr2 \
  libxkbcommon-dev \
  libxfixes3 \
  libxcomposite1 \
  libxdamage1 \
  libatk-bridge2.0-0 \
  libpango-1.0-0 \
  libcairo2 \
  libcups2 \
  openssl \
  ca-certificates \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- remotion/ --------------------------------------------------------
COPY remotion/package.json remotion/package-lock.json* ./remotion/
RUN cd remotion && npm install

COPY remotion ./remotion

# Downloads Chrome Headless Shell into the image so it doesn't need to
# fetch it on first render (which is what caused a slow first-render
# earlier when we ran this outside Docker).
RUN cd remotion && npx remotion browser ensure

# --- web/ ---------------------------------------------------------------
COPY web/package.json web/package-lock.json* ./web/
RUN cd web && npm install

COPY web ./web

WORKDIR /app/web
RUN npm run build

COPY web/docker-entrypoint.sh /app/web/docker-entrypoint.sh
RUN chmod +x /app/web/docker-entrypoint.sh

EXPOSE 3100

CMD ["./docker-entrypoint.sh"]
