// Server-only client for listings-blend's video-portal listings feed
// (GET /api/public/v1/video-portal/listings). Keeps the Bearer API key out
// of the browser entirely — the browser calls our own /api/listings route,
// which calls this.

export type ListingImage = {
  url: string | null;
  altText: string | null;
  position: number;
  isHero: boolean;
};

export type ListingContact = {
  name: string | null;
  jobTitle: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
};

export type Listing = {
  id: string;
  reference: string;
  name: string;
  slug: string;
  status: string;
  transaction: string;
  marketSector: string;
  propertyType: string;
  availability: string | null;
  gla: number | null;
  ratePerM2: number | null;
  monthlyRental: number | null;
  description: string | null;
  summary: string | null;
  features: string[];
  location: {
    addressLine1: string | null;
    suburb: string;
    city: string;
    province: string;
  };
  images: ListingImage[];
  contacts: ListingContact[];
  listingUrl: string;
};

export class ListingsApiNotConfiguredError extends Error {
  constructor() {
    super('LISTINGS_API_URL / LISTINGS_API_KEY are not configured.');
    this.name = 'ListingsApiNotConfiguredError';
  }
}

export async function fetchListings(search?: string): Promise<Listing[]> {
  const baseUrl = process.env.LISTINGS_API_URL;
  const apiKey = process.env.LISTINGS_API_KEY;

  if (!baseUrl || !apiKey) {
    throw new ListingsApiNotConfiguredError();
  }

  const url = new URL('/api/public/v1/video-portal/listings', baseUrl);
  url.searchParams.set('limit', '100');
  if (search) url.searchParams.set('search', search);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Always fetch fresh — this is a picker, not something to cache.
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Listings API returned ${res.status}: ${body.slice(0, 500)}`);
  }

  const json = await res.json();
  return json.data as Listing[];
}
