// src/data/schema.ts
//
// Zod schema for the property promo. This is what lets the future portal
// (or anyone) pass a *different* listing's data into the same composition
// without editing source files — pass it via defaultProps in Root.tsx for
// local preview, or via inputProps when rendering programmatically
// (@remotion/renderer's renderMedia({ inputProps }) or the CLI's
// `--props='{"property": {...}}'` flag).

import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const PropertySchema = z.object({
  propertyName: z.string(),
  propertyType: z.string(),
  location: z.string(),
  address: z.string(),

  totalGla: z.number(),
  warehouseArea: z.number(),
  officeArea: z.number(),
  yardArea: z.number(),

  monthlyRental: z.number(),
  ratePerSquareMetre: z.number(),
  excludingVat: z.boolean(),

  availability: z.string(),
  buildingGrade: z.string(),

  headline: z.string(),
  description: z.string(),

  stats: z.object({
    heightToEavesMetres: z.number(),
    loadBearingKgPerSqm: z.number(),
    powerMva: z.number(),
  }),

  features: z.array(z.string()),

  contact: z.object({
    name: z.string(),
    title: z.string(),
    phone: z.string(),
    email: z.string(),
  }),

  listingUrl: z.string(),
  listingUrlFull: z.string(),
  callToAction: z.string(),
});

// Media manifest — every value is a path relative to public/ (used with
// staticFile()) OR a full https:// URL (Remotion's <Img>/staticFile both
// accept remote URLs, which matters once photos are stored off-server,
// e.g. S3, instead of in public/images).
export const MediaSchema = z.object({
  exteriorCornerA: z.string(),
  exteriorCornerB: z.string(),
  pondPathway: z.string(),
  carportsGenerator: z.string(),
  pondWide: z.string(),
  warehouseInteriorA: z.string(),
  loadingCanopy: z.string(),
  warehouseInteriorB: z.string(),
  dockCorridor: z.string(),
  warehouseInteriorC: z.string(),
  entranceFacade: z.string(),
});

// Optional brand override — lets a portal pass a different accent colour
// per client/listing without touching theme.ts. zColor() gives the portal
// UI a proper colour picker if you ever expose this as a form field.
export const BrandSchema = z.object({
  accentColor: zColor(),
  accentDeep: zColor(),
});

export const PropertyPromoPropsSchema = z.object({
  property: PropertySchema,
  media: MediaSchema,
  brand: BrandSchema,
});

export type PropertyPromoProps = z.infer<typeof PropertyPromoPropsSchema>;
export type PropertyInput = z.infer<typeof PropertySchema>;
export type MediaInput = z.infer<typeof MediaSchema>;
