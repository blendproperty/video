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

const STEPS = ['Category & format', 'Property details', 'Story & contact', 'Photos'] as const;
type Step = (typeof STEPS)[number];

export default function NewJobPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<FormState>(emptyProperty);
  const [aspect, setAspect] = useState<'landscape' | 'vertical'>('landscape');
  const [photos, setPhotos] = useState<Record<string, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;
  const mediaSlots = getMediaSlots(form.propertyCategory);

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
    // Photos already picked don't necessarily map to the new category's
    // slot guidance — clear them so nothing gets silently mismatched.
    setPhotos({});
  };

  const validateStep = (s: Step): string | null => {
    if (s === 'Property details') {
      const required: [string, unknown][] = [
        ['Property name', form.propertyName],
        ['Property type', form.propertyType],
        ['Location', form.location],
        ['Address', form.address],
        ['Building grade', form.buildingGrade],
        ['Availability', form.availability],
        [form.totalAreaLabel || 'Total area', form.totalArea],
        [form.secondaryAreaLabel || 'Secondary area', form.secondaryArea],
        ['Monthly rental', form.monthlyRental],
        ['Rate per m²', form.ratePerSquareMetre],
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
      setError(`Please upload a photo for: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }

    setSubmitting(true);

    const property = {
      ...form,
      totalArea: Number(form.totalArea),
      secondaryArea: Number(form.secondaryArea),
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
      fd.append(`photo_${slot.key}`, photos[slot.key] as File);
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

  const photosUploaded = mediaSlots.filter((s) => photos[s.key]).length;

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
        {step === 'Category & format' && (
          <>
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
              Photos — assign one to each scene ({photosUploaded}/{mediaSlots.length})
            </legend>
            <div className="photo-grid">
              {mediaSlots.map((slot) => {
                const file = photos[slot.key];
                return (
                  <label key={slot.key} className={file ? 'photo-slot photo-slot-filled' : 'photo-slot'}>
                    <span>{slot.label}</span>
                    <small>{slot.hint}</small>
                    {file && <small className="photo-slot-filename">{file.name}</small>}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setPhotos((prev) => ({ ...prev, [slot.key]: e.target.files?.[0] ?? null }))
                      }
                    />
                  </label>
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
          {!isLastStep && (
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
