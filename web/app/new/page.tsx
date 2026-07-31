'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MEDIA_SLOTS } from '@/lib/schema';

const emptyProperty = {
  propertyName: '',
  propertyType: '',
  location: '',
  address: '',
  totalGla: '',
  warehouseArea: '',
  officeArea: '',
  yardArea: '',
  monthlyRental: '',
  ratePerSquareMetre: '',
  excludingVat: true,
  availability: 'Available now',
  buildingGrade: '',
  headline: '',
  description: '',
  stats: { heightToEavesMetres: '', loadBearingKgPerSqm: '', powerMva: '' },
  featuresText: '',
  contact: { name: '', title: '', phone: '', email: '' },
  listingUrl: '',
  listingUrlFull: '',
  callToAction: 'Book a viewing',
};

type FormState = typeof emptyProperty;

export default function NewJobPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyProperty);
  const [aspect, setAspect] = useState<'landscape' | 'vertical'>('landscape');
  const [photos, setPhotos] = useState<Record<string, File | null>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const missing = MEDIA_SLOTS.filter((s) => !photos[s.key]);
    if (missing.length > 0) {
      setError(`Please upload a photo for: ${missing.map((m) => m.label).join(', ')}`);
      return;
    }

    setSubmitting(true);

    const property = {
      ...form,
      totalGla: Number(form.totalGla),
      warehouseArea: Number(form.warehouseArea),
      officeArea: Number(form.officeArea),
      yardArea: Number(form.yardArea),
      monthlyRental: Number(form.monthlyRental),
      ratePerSquareMetre: Number(form.ratePerSquareMetre),
      stats: {
        heightToEavesMetres: Number(form.stats.heightToEavesMetres),
        loadBearingKgPerSqm: Number(form.stats.loadBearingKgPerSqm),
        powerMva: Number(form.stats.powerMva),
      },
      features: form.featuresText
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean),
    } as Record<string, unknown>;
    delete property.featuresText;

    const fd = new FormData();
    fd.append('property', JSON.stringify(property));
    fd.append('aspect', aspect);
    for (const slot of MEDIA_SLOTS) {
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

  return (
    <div className="page">
      <h1>New property video</h1>
      <form onSubmit={onSubmit} className="job-form">
        <fieldset>
          <legend>Format</legend>
          <label>
            <input type="radio" checked={aspect === 'landscape'} onChange={() => setAspect('landscape')} /> Landscape
            (16:9, YouTube)
          </label>
          <label>
            <input type="radio" checked={aspect === 'vertical'} onChange={() => setAspect('vertical')} /> Vertical
            (9:16, Reels/Stories)
          </label>
        </fieldset>

        <fieldset>
          <legend>Unit spec</legend>
          <label>
            Property name
            <input value={form.propertyName} onChange={(e) => update('propertyName', e.target.value)} required />
          </label>
          <label>
            Property type
            <input value={form.propertyType} onChange={(e) => update('propertyType', e.target.value)} required />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => update('location', e.target.value)} required />
          </label>
          <label>
            Address
            <input value={form.address} onChange={(e) => update('address', e.target.value)} required />
          </label>
          <label>
            Building grade
            <input value={form.buildingGrade} onChange={(e) => update('buildingGrade', e.target.value)} required />
          </label>
          <label>
            Availability
            <input value={form.availability} onChange={(e) => update('availability', e.target.value)} required />
          </label>
          <label>
            Total GLA (m²)
            <input type="number" value={form.totalGla} onChange={(e) => update('totalGla', e.target.value)} required />
          </label>
          <label>
            Warehouse area (m²)
            <input
              type="number"
              value={form.warehouseArea}
              onChange={(e) => update('warehouseArea', e.target.value)}
              required
            />
          </label>
          <label>
            Office area (m²)
            <input
              type="number"
              value={form.officeArea}
              onChange={(e) => update('officeArea', e.target.value)}
              required
            />
          </label>
          <label>
            Yard area (m²)
            <input type="number" value={form.yardArea} onChange={(e) => update('yardArea', e.target.value)} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>Financials</legend>
          <label>
            Monthly rental (R)
            <input
              type="number"
              value={form.monthlyRental}
              onChange={(e) => update('monthlyRental', e.target.value)}
              required
            />
          </label>
          <label>
            Rate per m² (R)
            <input
              type="number"
              value={form.ratePerSquareMetre}
              onChange={(e) => update('ratePerSquareMetre', e.target.value)}
              required
            />
          </label>
          <label>
            <input
              type="checkbox"
              checked={form.excludingVat}
              onChange={(e) => update('excludingVat', e.target.checked)}
            />{' '}
            Excluding VAT
          </label>
        </fieldset>

        <fieldset>
          <legend>Additional info</legend>
          <label>
            Headline (use a line break for a two-line headline)
            <textarea value={form.headline} onChange={(e) => update('headline', e.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} required />
          </label>
          <label>
            Height to eaves (m)
            <input
              type="number"
              value={form.stats.heightToEavesMetres}
              onChange={(e) => update('stats.heightToEavesMetres', e.target.value)}
              required
            />
          </label>
          <label>
            Load bearing (kg/m²)
            <input
              type="number"
              value={form.stats.loadBearingKgPerSqm}
              onChange={(e) => update('stats.loadBearingKgPerSqm', e.target.value)}
              required
            />
          </label>
          <label>
            Power (MVA)
            <input
              type="number"
              step="0.1"
              value={form.stats.powerMva}
              onChange={(e) => update('stats.powerMva', e.target.value)}
              required
            />
          </label>
          <label>
            Features (comma-separated)
            <input
              value={form.featuresText}
              onChange={(e) => update('featuresText', e.target.value)}
              placeholder="Backup Power, 24-hour Security, ..."
              required
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Contact</legend>
          <label>
            Name
            <input value={form.contact.name} onChange={(e) => update('contact.name', e.target.value)} required />
          </label>
          <label>
            Title
            <input value={form.contact.title} onChange={(e) => update('contact.title', e.target.value)} required />
          </label>
          <label>
            Phone
            <input value={form.contact.phone} onChange={(e) => update('contact.phone', e.target.value)} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={form.contact.email}
              onChange={(e) => update('contact.email', e.target.value)}
              required
            />
          </label>
          <label>
            Listing URL (short, shown on screen)
            <input value={form.listingUrl} onChange={(e) => update('listingUrl', e.target.value)} required />
          </label>
          <label>
            Listing URL (full https://)
            <input
              value={form.listingUrlFull}
              onChange={(e) => update('listingUrlFull', e.target.value)}
              required
            />
          </label>
          <label>
            Call to action
            <input value={form.callToAction} onChange={(e) => update('callToAction', e.target.value)} required />
          </label>
        </fieldset>

        <fieldset>
          <legend>Photos — assign one to each scene</legend>
          {MEDIA_SLOTS.map((slot) => (
            <label key={slot.key} className="photo-slot">
              <span>{slot.label}</span>
              <small>{slot.hint}</small>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setPhotos((prev) => ({ ...prev, [slot.key]: e.target.files?.[0] ?? null }))
                }
              />
            </label>
          ))}
        </fieldset>

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={submitting} className="primary-button">
          {submitting ? 'Creating…' : 'Generate video'}
        </button>
      </form>
    </div>
  );
}
