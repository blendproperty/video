import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { Readable } from 'stream';

// This route exists because relying on Next's implicit public/ static file
// serving for /renders/<jobId>.mp4 caused a nasty bug: the very first
// request for a not-yet-rendered file falls through to the App Router's
// not-found handler, and Next then caches that 404 (x-nextjs-cache: HIT,
// x-nextjs-prerender: 1) indefinitely — even after the real file shows up
// on disk. Serving explicitly through a force-dynamic route handler means
// every request re-checks disk, no caching involved.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function rendersDir() {
  return path.join(process.cwd(), 'public', 'renders');
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Only allow the exact shape we generate (cuid-ish id + .mp4) — blocks
  // path traversal via ../ etc.
  if (!/^[a-zA-Z0-9_-]+\.mp4$/.test(filename)) {
    return new Response('Not found', { status: 404 });
  }

  const filePath = path.join(rendersDir(), filename);

  let stat: fs.Stats;
  try {
    stat = await fs.promises.stat(filePath);
  } catch {
    return new Response('Not found', { status: 404 });
  }

  const fileSize = stat.size;
  const range = req.headers.get('range');

  const baseHeaders: Record<string, string> = {
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'no-store',
  };

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match && match[1] ? parseInt(match[1], 10) : 0;
    const end = match && match[2] ? parseInt(match[2], 10) : fileSize - 1;
    const chunkSize = end - start + 1;

    const nodeStream = fs.createReadStream(filePath, { start, end });
    const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

    return new Response(webStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Content-Length': String(chunkSize),
      },
    });
  }

  const nodeStream = fs.createReadStream(filePath);
  const webStream = Readable.toWeb(nodeStream) as unknown as ReadableStream;

  return new Response(webStream, {
    status: 200,
    headers: {
      ...baseHeaders,
      'Content-Length': String(fileSize),
      'Content-Disposition': `inline; filename="${filename}"`,
    },
  });
}
