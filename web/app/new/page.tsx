'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CATEGORY_PRESETS,
  PROPERTY_CATEGORIES,
  PROPERTY_CATEGORY_LABELS,
  getMediaSlots,
  type PropertyCategory,
} from '@/lib/schema';

const emptyProperty = {
  propertyCategory: 'warehouse' as PropertyCategory,
  propertyName: '',
  propertyType: '',
  location: '',
  address: '',
  listingLabel: CATEGORY_PRESETS.warehouse.listingLabel,
  totalArea: '',
  totalAreaLabel: CATEGORY_PRESETS.warehouse.totalAreaLabel,
  secondaryArea: '',
  secondaryAreaLabel: CATEGORY_PRESETS.warehouse.secondaryAreaLabel,
  monthlyRental: '',
  ratePerSquareMetre: '',
  excludingVat: true,
  availability: 'Available now',
  buildingGrade: CATEGORY_PRESETS.warehouse.buildingGrade,
  headline: '',
  description: '',
  stats: CATEGORY_PRESETS.warehouse.stats.map((s) => ({ ...s })),
  featuresHeadline: CATEGORY_PRESETS.warehouse.featuresHeadline,
  featuresText: '',
  contact: { name: '', title: '', phone: '', email: '' },
  listingUrl: '',
  listingUrlFull: '',
  callToAction: 'Book a viewing',
};

type FormState = typeof emptyProperty;

// Maps listings-blend's PropertyType enum onto our 3 video categories.
const PROPERTY_TYPE_TO_CATEGORY: Record<string, PropertyCategory> = {
  OFFICE: 'commercial',
  RETAIL: 'commercial',
  MIXED_USE: 'commercial',
  INDUSTRIAL: 'warehouse',
  YARD: 'land',
  LAND: 'land',
};

// Warehouse (total GLA vs. clear-span warehouse floor) and Land (total erf
// vs. usable yard) both have a meaningful "primary vs secondary area"
// breakdown. A small serviced office doesn't — there's usually just one
// number. Rather than ask for a figure that doesn't exist, we hide the
// field for Commercial and quietly mirror totalArea into secondaryArea at
// submit time (see onSubmit).
const CATEGORIES_WITH_SECONDARY_AREA: PropertyCategory[] = ['warehouse', 'land'];

type ListingImage = { url: string | null; altText: string | null; position: number; isHero: boolean };
type ListingContact = { name: string | null; jobTitle: string | null; phone: string | null; whatsapp: string | null; email: string | null };
type Listing = {
  id: string;
  name: string;
  propertyType: string;
  availability: string | null;
  gla: number | null;
  ratePerM2: number | null;
  monthlyRental: number | null;
  description: string | null;
  summary: string | null;
  features: string[];
  location: { addressLine1: string | null; suburb: string; city: string; province: string };
  images: ListingImage[];
  contacts: ListingContact[];
  listingUrl: string;
};

// Photo slots can now be filled either by uploading a file, or by picking
// one of a selected listing's existing photos (no re-upload needed).
type PhotoSelection = { type: 'file'; file: File } | { type: 'url'; url: string };

const STEPS = ['Choose listing', 'Category & format', 'Property details', 'Story & contact', 'Photos'] as const;
type Step = (typeof STEPS)[number];

export default function NewJobPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(emptyProperty);
  const [aspect, setAspect] = useState<'landscape' | 'vertical'>('landscape');
  const [photos, setPhotos] = useState<Record<string, PhotoSelection | undefined>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [source, setSource] = useState<'unset' | 'listing' | 'manual'>('unset');
  const [listingSearch, setListingSearch] = useState('');
  const [listings, setListings] = useState<Listing[]>([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [listingsError, setListingsError] = useState<string | null>(null);
  const [selectedListingName, setSelectedListingName] = useState<string | null>(null);
  const [listingImages, setListingImages] = useState<ListingImage[]>([]);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const mediaSlots = getMediaSlots(form.propertyCategory);
  const hasSecondaryArea = CATEGORIES_WITH_SECONDARY_AREA.includes(form.propertyCategory);

  const update = (path: string, value: unknown) => {
    setForm((prev) => {
      const next: any = structuredClone(prev);
      const parts = path.split('.');
      let obj = next;
      for (let i = 0; i < parts.length - 1; i++) obj = obj[parts[i]];
      obj[parts[parts.length - 1]] = value;
      return next;
    });
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    setForm((prev) => {
      const next = structuredClone(prev);
      next.stats[index][field] = value;
      return next;
    });
  };

  const onCategoryChange = (category: PropertyCategory) => {
    const preset = CATEGORY_PRESETS[category];
    setForm((prev) => ({
      ...prev,
      propertyCategory: category,
      listingLabel: preset.listingLabel,
      totalAreaLabel: preset.totalAreaLabel,
      secondaryAreaLabel: preset.secondaryAreaLabel,
      buildingGrade: preset.buildingGrade,
      featuresHeadline: preset.featuresHeadline,
      stats: preset.stats.map((s) => ({ ...s })),
    }));
  };

  const loadListings = async (search?: string) => {
    setListingsLoading(true);
    setListingsError(null);
    try {
      const url = search ? `/api/listings?search=${encodeURIComponent(search)}` : '/api/listings';
      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) {
        setListingsError(
          data.error === 'not_configured'
            ? 'Listings integration isn’t set up yet — switch to manual entry below.'
            : data.details || 'Could not load listings.',
        );
        setListings([]);
        return;
      }
      setListings(data.listings ?? []);
    } catch {
      setListingsError('Could not reach the listings service.');
    } finally {
      setListingsLoading(false);
    }
  };

  const chooseSource = (choice: 'listing' | 'manual') => {
    setSource(choice);
    if (choice === 'listing' && listings.length === 0 && !listingsLoading) {
      loadListings();
    }
    if (choice === 'manual') {
      setStepIndex(1);
    }
  };

  const applyListing = (listing: Listing) => {
    const category = PROPERTY_TYPE_TO_CATEGORY[listing.propertyType] ?? 'warehouse';
    const preset = CATEGORY_PRESETS[category];
    const primaryContact = listing.contacts[0];

    setForm((prev) => ({
      ...prev,
      propertyCategory: category,
      listingLabel: preset.listingLabel,
      totalAreaLabel: preset.totalAreaLabel,
      secondaryAreaLabel: preset.secondaryAreaLabel,
      buildingGrade: preset.buildingGrade,
      featuresHeadline: preset.featuresHeadline,
      stats: preset.stats.map((s) => ({ ...s })),
      propertyName: listing.name,
      propertyType: listing.propertyType,
      location: [listing.location.suburb, listing.location.city].filter(Boolean).join(', '),
      address:
        listing.location.addressLine1 ||
        [listing.location.suburb, listing.location.city].filter(Boolean).join(', '),
      totalArea: listing.gla != null ? String(listing.gla) : prev.totalArea,
      monthlyRental: listing.monthlyRental != null ? String(listing.monthlyRental) : prev.monthlyRental,
      ratePerSquareMetre: listing.ratePerM2 != null ? String(listing.ratePerM2) : prev.ratePerSquareMetre,
      availability: listing.availability || prev.availability,
      // The listings API doesn't have a dedicated "video tagline" field —
      // `summary` (short marketing blurb) is the closest fit, so use that
      // for the punchy headline and reserve `description` (full body copy)
      // for the description field below. Falls back to a category-aware
      // generic line if the listing has no summary set, so this is never
      // left blank when pulling from a listing.
      headline:
        listing.summary ||
        `${
          category === 'commercial'
            ? 'Premium office space'
            : category === 'land'
              ? 'Prime land opportunity'
              : 'Warehouse and offices,\nall under one roof'
        }${listing.location.suburb ? ` in ${listing.location.suburb}` : ''}`,
      description: listing.description || listing.summary || prev.description,
      featuresText: listing.features.length > 0 ? listing.features.join(', ') : prev.featuresText,
      contact: primaryContact
        ? {
            name: primaryContact.name || '',
            title: primaryContact.jobTitle || '',
            phone: primaryContact.phone || primaryContact.whatsapp || '',
            email: primaryContact.email || '',
          }
        : prev.contact,
      listingUrl: listing.listingUrl.replace(/^https?:\/\//, ''),
      listingUrlFull: listing.listingUrl,
    }));

    setListingImages(listing.images.filter((img) => img.url));
    setPhotos({});
    setSelectedListingName(listing.name);
    setError(null);
    setStepIndex(1);
  };

  const validateStep = (s: Step): string | null => {
    if (s === 'Choose listing' && source === 'unset') {
      return 'Choose a listing, or continue with manual entry.';
    }
    if (s === 'Property details') {
      const required: [string, unknown][] = [
        ['Property name', form.propertyName],
        ['Property type', form.propertyType],
        ['Location', form.location],
        ['Address', form.address],
        ['Building grade', form.buildingGrade],
        ['Availability', form.availability],
        [form.totalAreaLabel || 'Total area', form.totalArea],
        ['Monthly rental', form.monthlyRental],
        ['Rate per m²', form.ratePerSquareMetre],
        ...(hasSecondaryArea
          ? ([[form.secondaryAreaLabel || 'Secondary area', form.secondaryArea]] as [string, unknown][])
          : []),
      ];
      const missing = required.filter(([, v]) => v === '' || v === null || v === undefined);
      if (missing.length > 0) return `Please fill in: ${missing.map(([label]) => label).join(', ')}`;
    }
    if (s === 'Story & contact') {
      const required: [string, unknown][] = [
        ['Listing label', form.listingLabel],
        ['Headline', form.headline],
        ['Description', form.description],
        ['Features headline', form.featuresHeadline],
        ['Features', form.featuresText],
        ['Contact name', form.contact.name],
        ['Contact title', form.contact.title],
        ['Contact phone', form.contact.phone],
        ['Contact email', form.contact.email],
        ['Listing URL', form.listingUrl],
        ['Listing URL (full)', form.listingUrlFull],
        ['Call to action', form.callToAction],
      ];
      const missing = required.filter(([, v]) => v === '' || v === null || v === undefined);
      if (missing.length > 0) return `Please fill in: ${missing.map(([label]) => label).join(', ')}`;
      const statsMissing = form.stats.some((s) => !s.label || !s.value);
      if (statsMissing) return 'Please fill in all 3 feature stats (label and value).';
    }
    return null;
  };

  const goNext = () => {
    const err = validateStep(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const missing = mediaSlots.filter((s) => !photos[s.key]);
    if (missing.length > 0) {
      setError(`Please choose a photo for: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }

    setSubmitting(true);

    const property = {
      ...form,
      totalArea: Number(form.totalArea),
      // Commercial has no secondary-area field in the UI (nothing to break
      // a small office down into) — mirror the total area so the scene
      // that reads it still has a sensible number instead of 0/NaN.
      secondaryArea: hasSecondaryArea ? Number(form.secondaryArea) : Number(form.totalArea),
      monthlyRental: Number(form.monthlyRental),
      ratePerSquareMetre: Number(form.ratePerSquareMetre),
      features: form.featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    } as Record<string, unknown>;
    delete property.featuresText;

    const fd = new FormData();
    fd.append('property', JSON.stringify(property));
    fd.append('aspect', aspect);
    for (const slot of mediaSlots) {
      const selection = photos[slot.key];
      if (selection?.type === 'file') {
        fd.append(`photo_${slot.key}`, selection.file);
      } else if (selection?.type === 'url') {
        fd.append(`photo_url_${slot.key}`, selection.url);
      }
    }

    const res = await fetch('/api/jobs', { method: 'POST', body: fd });
    setSubmitting(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || 'Something went wrong creating the video.');
      return;
    }

    const data = await res.json();
    router.push(`/jobs/${data.id}`);
  };

  const photosAssigned = mediaSlots.filter((s) => photos[s.key]).length;

  return (
    <div className="page">
      <h1>New property video</h1>

      <ol className="wizard-steps">
        {STEPS.map((s, i) => (
          <li
            key={s}
            className={
              i === stepIndex ? 'wizard-step active' : i < stepIndex ? 'wizard-step done' : 'wizard-step'
            }
          >
            <span className="wizard-step-index">{i + 1}</span>
            <span>{s}</span>
          </li>
        ))}
      </ol>

      <form
        onSubmit={isLastStep ? onSubmit : (e) => e.preventDefault()}
        className="job-form"
      >
        {step === 'Choose listing' && (
          <fieldset>
            <legend>Where should this video come from?</legend>

            {source === 'unset' && (
              <div className="source-choice-grid">
                <button type="button" className="source-choice-card" onClick={() => chooseSource('listing')}>
                  <strong>Pull from a listing</strong>
                  <span>Pick an existing listing from listings.blendproperty.co.za — details and photos come in automatically.</span>
                </button>
                <button type="button" className="source-choice-card" onClick={() => chooseSource('manual')}>
                  <strong>Enter manually</strong>
                  <span>Fill everything in yourself over the next few steps.</span>
                </button>
              </div>
            )}

            {source === 'listing' && (
              <>
                <div className="listing-search-row">
                  <input
                    value={listingSearch}
                    onChange={(e) => setListingSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        loadListings(listingSearch);
                      }
                    }}
                    placeholder="Search by name, suburb, or reference…"
                  />
                  <button type="button" className="secondary-button" onClick={() => loadListings(listingSearch)}>
                    Search
                  </button>
                </div>

                {listingsLoading && <p className="hint-text">Loading listings…</p>}
                {listingsError && (
                  <>
                    <p className="error">{listingsError}</p>
                    <button type="button" className="secondary-button" onClick={() => chooseSource('manual')}>
                      Switch to manual entry
                    </button>
                  </>
                )}

                {!listingsLoading && !listingsError && (
                  <div className="listing-results">
                    {listings.map((listing) => {
                      const hero = listing.images.find((img) => img.isHero) ?? listing.images[0];
                      return (
                        <button
                          type="button"
                          key={listing.id}
                          className="listing-card"
                          onClick={() => applyListing(listing)}
                        >
                          {hero?.url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={hero.url} alt="" className="listing-card-thumb" />
                          ) : (
                            <div className="listing-card-thumb listing-card-thumb-empty" />
                          )}
                          <div className="listing-card-body">
                            <strong>{listing.name}</strong>
                            <small>
                              {[listing.location.suburb, listing.location.city].filter(Boolean).join(', ')}
                            </small>
                          </div>
                        </button>
                      );
                    })}
                    {listings.length === 0 && <p className="hint-text">No listings found.</p>}
                  </div>
                )}

                <p style={{ marginTop: 16 }}>
                  <button type="button" className="link-button" onClick={() => chooseSource('manual')}>
                    Skip — enter manually instead
                  </button>
                </p>
              </>
            )}

            {source === 'manual' && (
              <p className="hint-text">Manual entry selected — continue to the next step.</p>
            )}
          </fieldset>
        )}

        {step === 'Category & format' && (
          <>
            {selectedListingName && (
              <p className="hint-text">Pulled from listing: <strong>{selectedListingName}</strong></p>
            )}
            <fieldset>
              <legend>Property category</legend>
              {PROPERTY_CATEGORIES.map((cat) => (
                <label key={cat} className="radio-row">
                  <input
                    type="radio"
                    checked={form.propertyCategory === cat}
                    onChange={() => onCategoryChange(cat)}
                  />
                  {PROPERTY_CATEGORY_LABELS[cat]}
                </label>
              ))}
              <p className="hint-text">
                Sets sensible defaults for labels and feature stats below — all still editable.
              </p>
            </fieldset>

            <fieldset>
              <legend>Format</legend>
              <label className="radio-row">
                <input type="radio" checked={aspect === 'landscape'} onChange={() => setAspect('landscape')} />
                Landscape (16:9, YouTube)
              </label>
              <label className="radio-row">
                <input type="radio" checked={aspect === 'vertical'} onChange={() => setAspect('vertical')} />
                Vertical (9:16, Reels/Stories)
              </label>
            </fieldset>
          </>
        )}

        {step === 'Property details' && (
          <>
            <fieldset>
              <legend>Unit spec</legend>
              <label>
                Property name
                <input value={form.propertyName} onChange={(e) => update('propertyName', e.target.value)} />
              </label>
              <label>
                Property type
                <input value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} />
              </label>
              <label>
                Location
                <input value={form.location} onChange={(e) => update('location', e.target.value)} />
              </label>
              <label>
                Address
                <input value={form.address} onChange={(e) => update('address', e.target.value)} />
              </label>
              <label>
                Building grade
                <input value={form.buildingGrade} onChange={(e) => update('buildingGrade', e.target.value)} />
              </label>
              <label>
                Availability
                <input value={form.availability} onChange={(e) => update('availability', e.target.value)} />
              </label>
              <div className="field-grid">
                <label>
                  {form.totalAreaLabel || 'Total area'} (m²)
                  <input type="number" value={form.totalArea} onChange={(e) => update('totalArea', e.target.value)} />
                </label>
                <label>
                  Label for above
                  <input value={form.totalAreaLabel} onChange={(e) => update('totalAreaLabel', e.target.value)} />
                </label>
                {hasSecondaryArea && (
                  <>
                    <label>
                      Secondary area (m²)
                      <input
                        type="number"
                        value={form.secondaryArea}
                        onChange={(e) => update('secondaryArea', e.target.value)}
                      />
                    </label>
                    <label>
                      Caption for above
                      <input
                        value={form.secondaryAreaLabel}
                        onChange={(e) => update('secondaryAreaLabel', e.target.value)}
                        placeholder="e.g. of clear-span warehouse space"
                      />
                    </label>
                  </>
                )}
              </div>
            </fieldset>

            <fieldset>
              <legend>Financials</legend>
              <div className="field-grid">
                <label>
                  Monthly rental (R)
                  <input
                    type="number"
                    value={form.monthlyRental}
                    onChange={(e) => update('monthlyRental', e.target.value)}
                  />
                </label>
                <label>
                  Rate per m² (R)
                  <input
                    type="number"
                    value={form.ratePerSquareMetre}
                    onChange={(e) => update('ratePerSquareMetre', e.target.value)}
                  />
                </label>
              </div>
              <label className="radio-row">
                <input
                  type="checkbox"
                  checked={form.excludingVat}
                  onChange={(e) => update('excludingVat', e.target.checked)}
                />
                Excluding VAT
              </label>
            </fieldset>
          </>
        )}

        {step === 'Story & contact' && (
          <>
            <fieldset>
              <legend>Additional info</legend>
              <label>
                Listing label (shown top-left in the opening scene)
                <input value={form.listingLabel} onChange={(e) => update('listingLabel', e.target.value)} placeholder="To Let / For Sale" />
              </label>
              <label>
                Headline (use a line break for a two-line headline)
                <textarea value={form.headline} onChange={(e) => update('headline', e.target.value)} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => update('description', e.target.value)} />
              </label>

              <p className="hint-text">3 feature stats, shown as badges (e.g. "Height to eaves" / "15m"):</p>
              <div className="stats-grid">
                {form.stats.map((stat, i) => (
                  <div key={i} className="stats-row">
                    <input
                      value={stat.label}
                      onChange={(e) => updateStat(i, 'label', e.target.value)}
                      placeholder="Label"
                    />
                    <input
                      value={stat.value}
                      onChange={(e) => updateStat(i, 'value', e.target.value)}
                      placeholder="Value"
                    />
                  </div>
                ))}
              </div>

              <label>
                Features headline (e.g. "Built for business")
                <input value={form.featuresHeadline} onChange={(e) => update('featuresHeadline', e.target.value)} />
              </label>
              <label>
                Features (comma-separated — first 3 shown as badges)
                <input
                  value={form.featuresText}
                  onChange={(e) => update('featuresText', e.target.value)}
                  placeholder="Backup Power, 24-hour Security, ..."
                />
              </label>
            </fieldset>

            <fieldset>
              <legend>Contact</legend>
              <div className="field-grid">
                <label>
                  Name
                  <input value={form.contact.name} onChange={(e) => update('contact.name', e.target.value)} />
                </label>
                <label>
                  Title
                  <input value={form.contact.title} onChange={(e) => update('contact.title', e.target.value)} />
                </label>
                <label>
                  Phone
                  <input value={form.contact.phone} onChange={(e) => update('contact.phone', e.target.value)} />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={form.contact.email}
                    onChange={(e) => update('contact.email', e.target.value)}
                  />
                </label>
              </div>
              <label>
                Listing URL (short, shown on screen)
                <input value={form.listingUrl} onChange={(e) => update('listingUrl', e.target.value)} />
              </label>
              <label>
                Listing URL (full https://)
                <input value={form.listingUrlFull} onChange={(e) => update('listingUrlFull', e.target.value)} />
              </label>
              <label>
                Call to action
                <input value={form.callToAction} onChange={(e) => update('callToAction', e.target.value)} />
              </label>
            </fieldset>
          </>
        )}

        {step === 'Photos' && (
          <fieldset>
            <legend>
              Photos — assign one to each scene ({photosAssigned}/{mediaSlots.length})
            </legend>
            {listingImages.length > 0 && (
              <p className="hint-text">
                Click a photo from {selectedListingName ?? 'the listing'} for each scene below, or upload your own instead.
              </p>
            )}
            <div className="photo-grid">
              {mediaSlots.map((slot) => {
                const selection = photos[slot.key];
                const isFilled = !!selection;
                return (
                  <div key={slot.key} className={isFilled ? 'photo-slot photo-slot-filled' : 'photo-slot'}>
                    <span>{slot.label}</span>
                    <small>{slot.hint}</small>

                    {listingImages.length > 0 && (
                      <div className="listing-thumb-row">
                        {listingImages.map((img) => (
                          <button
                            type="button"
                            key={img.url}
                            className={
                              selection?.type === 'url' && selection.url === img.url
                                ? 'listing-thumb listing-thumb-selected'
                                : 'listing-thumb'
                            }
                            onClick={() =>
                              setPhotos((prev) => ({ ...prev, [slot.key]: { type: 'url', url: img.url as string } }))
                            }
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.url as string} alt="" />
                          </button>
                        ))}
                      </div>
                    )}

                    <label className="upload-fallback">
                      {listingImages.length > 0 ? 'or upload your own:' : ''}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setPhotos((prev) => ({
                            ...prev,
                            [slot.key]: file ? { type: 'file', file } : undefined,
                          }));
                        }}
                      />
                    </label>
                    {selection?.type === 'file' && <small className="photo-slot-filename">{selection.file.name}</small>}
                  </div>
                );
              })}
            </div>
          </fieldset>
        )}

        {error && <p className="error">{error}</p>}

        <div className="wizard-nav">
          {stepIndex > 0 && (
            <button type="button" className="secondary-button" onClick={goBack}>
              Back
            </button>
          )}
          <div className="wizard-nav-spacer" />
          {!isLastStep && step !== 'Choose listing' && (
            <button type="button" className="primary-button" onClick={goNext}>
              Next
            </button>
          )}
          {isLastStep && (
            <button type="submit" disabled={submitting} className="primary-button">
              {submitting ? 'Creating…' : 'Generate video'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
