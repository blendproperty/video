// Mirrors remotion/src/data/schema.ts's PropertySchema. Kept as a separate
// copy for now rather than a cross-package import, to avoid Next.js build
// complications resolving TypeScript files outside its project root.
//
// KNOWN GAP: if you change the property shape in remotion/src/data/schema.ts,
// update this file to match, or the render call will fail Zod validation on
// the remotion side even though the form here accepted the input. Worth
// consolidating into a shared package later (e.g. an npm workspace).

import { z } from 'zod';

export const PROPERTY_CATEGORIES = ['warehouse', 'commercial', 'land'] as const;
export type PropertyCategory = (typeof PROPERTY_CATEGORIES)[number];

export const PROPERTY_CATEGORY_LABELS: Record<PropertyCategory, string> = {
  warehouse: 'Warehouse',
  commercial: 'Commercial (Office)',
  land: 'Land / Yard',
};

export const PropertyFormSchema = z.object({
  propertyCategory: z.enum(PROPERTY_CATEGORIES),

  propertyName: z.string().min(1),
  propertyType: z.string().min(1),
  location: z.string().min(1),
  address: z.string().min(1),

  listingLabel: z.string().min(1),

  totalArea: z.coerce.number().positive(),
  totalAreaLabel: z.string().min(1),
  secondaryArea: z.coerce.number().nonnegative(),
  secondaryAreaLabel: z.string().min(1),

  monthlyRental: z.coerce.number().positive(),
  ratePerSquareMetre: z.coerce.number().positive(),
  excludingVat: z.boolean().default(true),

  availability: z.string().min(1),
  buildingGrade: z.string().min(1),

  headline: z.string().min(1),
  description: z.string().min(1),

  stats: z
    .array(z.object({ label: z.string().min(1), value: z.string().min(1) }))
    .length(3),

  featuresHeadline: z.string().min(1),
  features: z.array(z.string()).min(1),

  contact: z.object({
    name: z.string().min(1),
    title: z.string().min(1),
    phone: z.string().min(1),
    email: z.string().email(),
  }),

  listingUrl: z.string().min(1),
  listingUrlFull: z.string().url(),
  callToAction: z.string().min(1),
});

export type PropertyFormValues = z.infer<typeof PropertyFormSchema>;

// Per-category defaults the wizard pre-fills when the category is chosen
// (all still editable). Keeps the form usable without forcing the agent to
// know exactly what "clear-span warehouse space" vs "usable yard space"
// should say for their listing.
export const CATEGORY_PRESETS: Record<
  PropertyCategory,
  {
    listingLabel: string;
    totalAreaLabel: string;
    secondaryAreaLabel: string;
    buildingGrade: string;
    featuresHeadline: string;
    stats: { label: string; value: string }[];
  }
> = {
  warehouse: {
    listingLabel: 'To Let',
    totalAreaLabel: 'Total GLA',
    secondaryAreaLabel: 'of clear-span warehouse space',
    buildingGrade: 'Warehousing',
    featuresHeadline: 'Built for business',
    stats: [
      { label: 'Height to eaves', value: '15m' },
      { label: 'Load bearing', value: '3 000 kg/m²' },
      { label: 'Power supply', value: '2.5 MVA' },
    ],
  },
  commercial: {
    listingLabel: 'To Let',
    totalAreaLabel: 'Total GLA',
    secondaryAreaLabel: 'of premium office space',
    buildingGrade: 'A-Grade',
    featuresHeadline: 'Built for business',
    stats: [
      { label: 'Floors', value: '4' },
      { label: 'Parking ratio', value: '4 bays / 100m²' },
      { label: 'Backup power', value: 'Full generator backup' },
    ],
  },
  land: {
    listingLabel: 'To Let',
    totalAreaLabel: 'Total Erf Size',
    secondaryAreaLabel: 'of usable yard space',
    buildingGrade: 'Zoned Industrial',
    featuresHeadline: 'Ready to develop',
    stats: [
      { label: 'Zoning', value: 'Industrial 1' },
      { label: 'Frontage', value: '120m' },
      { label: 'Fencing', value: 'Full perimeter palisade' },
    ],
  },
};

// One upload slot per scene in the video, in the same order they appear.
// This is the "manual assignment" UI — each slot has an explicit label so
// there's no ambiguity about which photo goes where. Same 9 keys for every
// category (matches remotion/src/data/schema.ts's MediaSchema exactly);
// only the guidance text changes per category.
export function getMediaSlots(
  category: PropertyCategory,
): { key: string; label: string; hint: string }[] {
  const common = [
    { key: 'exteriorA', label: 'Opening shot', hint: 'Best exterior/aerial photo — used first, ~2s' },
    { key: 'exteriorB', label: 'Positioning shot', hint: 'Another strong exterior/aerial angle' },
    { key: 'groundsWide', label: 'Location context', hint: 'Wider grounds, neighbourhood, or aerial shot' },
    { key: 'entranceFacade', label: 'Entrance / final shot', hint: 'Entrance or establishing shot — used in the closing scene' },
  ];

  if (category === 'warehouse') {
    return [
      common[0],
      common[1],
      { key: 'primaryAreaBackdrop', label: 'Warehouse interior (GLA counter scene)', hint: 'Backdrop behind the big GLA number' },
      { key: 'secondaryAreaBackdrop', label: 'Warehouse interior (main space scene)', hint: 'Primary warehouse floor shot' },
      { key: 'featureShot', label: 'Loading / operations', hint: 'Docks, canopy, loading area' },
      { key: 'infrastructureShot', label: 'Infrastructure', hint: 'Generator, plant room, parking/carports' },
      common[2],
      { key: 'availabilityBackdrop', label: 'Dock corridor', hint: 'Row of loading doors / corridor' },
      common[3],
    ];
  }

  if (category === 'commercial') {
    return [
      common[0],
      common[1],
      { key: 'primaryAreaBackdrop', label: 'Office interior (GLA counter scene)', hint: 'Backdrop behind the big GLA number' },
      { key: 'secondaryAreaBackdrop', label: 'Office interior (main space scene)', hint: 'Open-plan floor or main office space' },
      { key: 'featureShot', label: 'Reception / boardroom', hint: 'Reception area, boardroom, or meeting room' },
      { key: 'infrastructureShot', label: 'Infrastructure', hint: 'Parking, generator, building lobby' },
      common[2],
      { key: 'availabilityBackdrop', label: 'Office corridor', hint: 'Corridor, breakaway area, or workspace' },
      common[3],
    ];
  }

  // land
  return [
    common[0],
    common[1],
    { key: 'primaryAreaBackdrop', label: 'Wide site shot (Erf size counter scene)', hint: 'Backdrop behind the big Erf size number' },
    { key: 'secondaryAreaBackdrop', label: 'Open yard / land shot (main space scene)', hint: 'Open, usable area of the site' },
    { key: 'featureShot', label: 'Access / boundary', hint: 'Access road, gate, or boundary fencing' },
    { key: 'infrastructureShot', label: 'Site infrastructure', hint: 'Security, lighting, or services on site' },
    common[2],
    { key: 'availabilityBackdrop', label: 'Site overview', hint: 'Another open-site or perimeter shot' },
    common[3],
  ];
}
