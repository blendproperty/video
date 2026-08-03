import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PropertyFormSchema, getMediaSlots } from '@/lib/schema';
import { renderVideoForJob } from '@/lib/render';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();

  const propertyRaw = formData.get('property');
  if (typeof propertyRaw !== 'string') {
    return NextResponse.json({ error: 'Missing property data' }, { status: 400 });
  }

  let propertyParsed;
  try {
    propertyParsed = PropertyFormSchema.parse(JSON.parse(propertyRaw));
  } catch (e) {
    return NextResponse.json(
      { error: 'Invalid property data', details: e instanceof Error ? e.message : String(e) },
      { status: 400 },
    );
  }

  const aspect = formData.get('aspect') === 'vertical' ? 'vertical' : 'landscape';
  const mediaSlots = getMediaSlots(propertyParsed.propertyCategory);

  const job = await prisma.job.create({
    data: {
      userId: session.user.id as string,
      status: 'PENDING',
      aspect,
      propertyJson: JSON.stringify(propertyParsed),
      mediaJson: '{}',
    },
  });

  const jobPhotoDir = path.join(process.cwd(), '..', 'remotion', 'public', 'images', 'jobs', job.id);
  await fs.mkdir(jobPhotoDir, { recursive: true });

  const media: Record<string, string> = {};
  for (const slot of mediaSlots) {
    const file = formData.get(`photo_${slot.key}`);
    const remoteUrl = formData.get(`photo_url_${slot.key}`);

    if (file instanceof File) {
      const ext = file.name.split('.').pop() || 'jpg';
      const filename = `${slot.key}.${ext}`;
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(path.join(jobPhotoDir, filename), buffer);
      media[slot.key] = `images/jobs/${job.id}/${filename}`;
      continue;
    }

    // Photo picked from a listing's existing gallery instead of uploaded —
    // Remotion's <MediaScene> already renders remote https:// URLs
    // directly, so there's no need to download and re-save these.
    if (typeof remoteUrl === 'string' && /^https?:\/\//.test(remoteUrl)) {
      media[slot.key] = remoteUrl;
      continue;
    }

    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'FAILED', errorMessage: `Missing photo for "${slot.label}"` },
    });
    return NextResponse.json({ error: `Missing photo for "${slot.label}"` }, { status: 400 });
  }

  await prisma.job.update({
    where: { id: job.id },
    data: { mediaJson: JSON.stringify(media), status: 'RENDERING' },
  });

  // Fire-and-forget: the client polls GET /api/jobs/[id] for status instead
  // of waiting on this request, since a render takes 1-2 minutes.
  renderVideoForJob(job.id).catch(async (err) => {
    await prisma.job.update({
      where: { id: job.id },
      data: { status: 'FAILED', errorMessage: err instanceof Error ? err.message : String(err) },
    });
  });

  return NextResponse.json({ id: job.id });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobs = await prisma.job.findMany({
    where: { userId: session.user.id as string },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ jobs });
}
