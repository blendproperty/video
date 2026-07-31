# Midpoint / Blend Property — Video Production Module

This repo will house the full video-production system for Blend Property Group / Midpoint listings:

```
remotion/   The Remotion video composition (property promo template).
            Renders a branded property video from structured data + photos.
web/        (coming next) The internal portal: upload photos, fill in
            listing details, preview, and download the final video.
            Wraps remotion/ — calls it programmatically to render on demand.
```

## Current status

- `remotion/` — done and proven. This is the exact composition already running
  and rendering successfully on the production VPS for the 6 Weaver Avenue /
  Midpoint listing (11,443 m² warehouse & offices). It now accepts property
  data and photo paths as **props** (validated by a Zod schema in
  `remotion/src/data/schema.ts`) instead of hard-coded files, so different
  listings can be rendered without editing source code.
- `web/` — not started yet. This will be the portal: login, upload photos,
  fill in a form (unit spec, financials, features, contact), preview the
  generated video, and download the final MP4. It will call into `remotion/`
  programmatically via `@remotion/renderer`.

## Quick start (remotion/ only, for now)

```bash
cd remotion
npm install
npx remotion studio
```

Select **PropertyPromo** (1080×1920, vertical) or **PropertyPromoLandscape**
(1920×1080, for YouTube) in the sidebar.

To render a specific listing without touching code, pass props as JSON:

```bash
npx remotion render PropertyPromoLandscape out/my-listing.mp4 \
  --props='{"property": {...}, "media": {...}}'
```

See `remotion/src/data/schema.ts` for the exact shape `property` and `media`
must match.
