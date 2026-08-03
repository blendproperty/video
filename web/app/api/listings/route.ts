import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { fetchListings, ListingsApiNotConfiguredError } from '@/lib/listings-client';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  try {
    const listings = await fetchListings(search);

    // Annotate each listing with any video jobs already generated for it
    // (agency-wide, not just this user — the point is to stop anyone from
    // duplicating a colleague's work), so the picker can badge "already
    // generated" listings and confirm before letting someone regenerate.
    const listingIds = listings.map((l) => l.id);
    const jobs =
      listingIds.length > 0
        ? await prisma.job.findMany({
            where: { listingId: { in: listingIds } },
            select: { id: true, listingId: true, status: true, createdAt: true },
            orderBy: { createdAt: 'desc' },
          })
        : [];

    const videosByListing = new Map<string, typeof jobs>();
    for (const job of jobs) {
      if (!job.listingId) continue;
      const arr = videosByListing.get(job.listingId) ?? [];
      arr.push(job);
      videosByListing.set(job.listingId, arr);
    }

    const annotated = listings.map((l) => ({
      ...l,
      videos: videosByListing.get(l.id) ?? [],
    }));

    return NextResponse.json({ listings: annotated });
  } catch (err) {
    if (err instanceof ListingsApiNotConfiguredError) {
      return NextResponse.json({ error: 'not_configured' }, { status: 501 });
    }
    return NextResponse.json(
      { error: 'Failed to load listings', details: err instanceof Error ? err.message : String(err) },
      { status: 502 },
    );
  }
}
