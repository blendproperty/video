// Renders a job's video using the sibling ../remotion project, entirely
// server-side (no browser involved for the caller — Remotion itself spins
// up a headless Chrome instance to do the actual frame rendering).
//
// KNOWN LIMITATION: this bundles the Remotion project once and caches the
// bundle location in memory. If you edit remotion/src/**, restart the web
// app (`pm2 restart` / systemd restart) to pick up the change — it will not
// hot-reload. Also: only one render truly runs at a time in practice on a
// modest VPS; there's no real job queue here (no Redis/BullMQ), just
// "fire and forget" per request. Fine for occasional use by a small team;
// if multiple people start generating videos simultaneously and the VPS
// struggles, that's the first thing to revisit (add a proper queue).

import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs/promises';
import { prisma } from './prisma';

let cachedBundleLocation: string | null = null;
let cachedBundlePromise: Promise<string> | null = null;

async function getBundleLocation(): Promise<string> {
  if (cachedBundleLocation) return cachedBundleLocation;
  if (!cachedBundlePromise) {
    cachedBundlePromise = bundle({
      entryPoint: path.join(process.cwd(), '..', 'remotion', 'src', 'index.ts'),
    }).then((location) => {
      cachedBundleLocation = location;
      return location;
    });
  }
  return cachedBundlePromise;
}

export async function renderVideoForJob(jobId: string): Promise<void> {
  const job = await prisma.job.findUniqueOrThrow({ where: { id: jobId } });

  const property = JSON.parse(job.propertyJson);
  const media = JSON.parse(job.mediaJson);
  const brand = { accentColor: '#3B6EA5', accentDeep: '#1B2A41' };
  const inputProps = { property, media, brand };

  const compositionId = job.aspect === 'vertical' ? 'PropertyPromo' : 'PropertyPromoLandscape';
  const serveUrl = await getBundleLocation();

  const composition = await selectComposition({ serveUrl, id: compositionId, inputProps });

  const outputDir = path.join(process.cwd(), 'public', 'renders');
  await fs.mkdir(outputDir, { recursive: true });
  const outputLocation = path.join(outputDir, `${jobId}.mp4`);

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation,
    inputProps,
  });

  await prisma.job.update({
    where: { id: jobId },
    data: { status: 'DONE', outputPath: `/renders/${jobId}.mp4` },
  });
}
