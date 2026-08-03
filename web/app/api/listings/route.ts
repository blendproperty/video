import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { fetchListings, ListingsApiNotConfiguredError } from '@/lib/listings-client';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const search = req.nextUrl.searchParams.get('search') ?? undefined;

  try {
    const listings = await fetchListings(search);
    return NextResponse.json({ listings });
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
