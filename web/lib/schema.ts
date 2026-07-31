// Mirrors remotion/src/data/schema.ts's PropertySchema. Kept as a separate
// copy for now rather than a cross-package import, to avoid Next.js build
// complications resolving TypeScript files outside its project root.
//
// KNOWN GAP: if you change the property shape in remotion/src/data/schema.ts,
// update this file to match, or the render call will fail Zod validation on
// the remotion side even though the form here accepted the input. Worth
// consolidating into a shared package later (e.g. an npm workspace).

import { z } from 'zod';

export const PropertyFormSchema = z.object({
  propertyName: z.string().min(1),
  propertyType: z.string().min(1),
  location: z.string().min(1),
  address: z.string().min(1),

  totalGla: z.coerce.number().positive(),
  warehouseArea: z.coerce.number().nonnegative(),
  officeArea: z.coerce.number().nonnegative(),
  yardArea: z.coerce.number().nonnegative(),

  monthlyRental: z.coerce.number().positive(),
  ratePerSquareMetre: z.coerce.number().positive(),
  excludingVat: z.boolean().default(true),

  availability: z.string().min(1),
  buildingGrade: z.string().min(1),

  headline: z.string().min(1),
  description: z.string().min(1),

  stats: z.object({
    heightToEavesMetres: z.coerce.number().nonnegative(),
    loadBearingKgPerSqm: z.coerce.number().nonnegative(),
    powerMva: z.coerce.number().nonnegative(),
  }),

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

// One upload slot per scene in the video, in the same order they appear.
// This is the "manual assignment" UI — each slot has an explicit label so
// there's no ambiguity about which photo goes where (this is exactly the
// problem we hit doing this by hand over SSH — this form exists so nobody
// has to do that again).
export const MEDIA_SLOTS: { key: string; label: string; hint: string }[] = [
  { key: 'exteriorCornerA', label: 'Opening shot', hint: 'Best exterior/hero photo — used first, ~2s' },
  { key: 'exteriorCornerB', label: 'Positioning shot', hint: 'Another strong exterior angle' },
  { key: 'pondPathway', label: 'Amenity / grounds', hint: 'Landscaping, walkway, dam, etc.' },
  { key: 'carportsGenerator', label: 'Infrastructure', hint: 'Generator, plant room, parking/carports' },
  { key: 'pondWide', label: 'Location context', hint: 'Wider grounds or neighbourhood shot' },
  { key: 'warehouseInteriorA', label: 'Warehouse interior (main space scene)', hint: 'Primary warehouse floor shot' },
  { key: 'loadingCanopy', label: 'Loading / operations', hint: 'Docks, canopy, loading area' },
  { key: 'warehouseInteriorB', label: 'Warehouse interior (GLA counter scene)', hint: 'Backdrop behind the big GLA number' },
  { key: 'dockCorridor', label: 'Dock corridor', hint: 'Row of loading doors / corridor' },
  { key: 'warehouseInteriorC', label: 'Warehouse interior (alt angle)', hint: 'Third interior angle, e.g. mezzanine' },
  { key: 'entranceFacade', label: 'Entrance / final shot', hint: 'Office entrance — used in the closing scene' },
];
