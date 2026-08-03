// src/data/schema.ts
//
// Zod schema for the property promo. This is what lets the portal pass a
// *different* listing's data into the same composition without editing
// source files — pass it via defaultProps in Root.tsx for local preview, or
// via inputProps when rendering programmatically (@remotion/renderer's
// renderMedia({ inputProps }) or the CLI's --props flag).
//
// Supports three property categories (warehouse / commercial / land)
// through generic fields rather than one rigid warehouse-shaped schema:
//   - totalArea/totalAreaLabel + secondaryArea/secondaryAreaLabel replace
//     the old fixed totalGla/warehouseArea/officeArea/yardArea, so any
//     category can show "Total GLA" + "clear-span warehouse space", or
//     "Total Erf Size" + "usable yard space", etc.
//   - stats is now 3 free-form {label, value} pairs instead of a fixed
//     warehouse-specific shape (height to eaves / load bearing / power),
//     so commercial (floors, parking) and land (zoning, frontage) listings
//     can use the same 3 feature-badge scene.

import { z } from 'zod';
import { zColor } from '@remotion/zod-types';

export const PropertyCategorySchema = z.enum(['warehouse', 'commercial', 'land']);
export type PropertyCategory = z.infer<typeof PropertyCategorySchema>;

export const PropertyStatSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const PropertySchema = z.object({
  propertyCategory: PropertyCategorySchema,

  propertyName: z.string(),
  propertyType: z.string(),
  location: z.string(),
  address: z.string(),

  listingLabel: z.string(), // e.g. "To Let" / "For Sale"

  totalArea: z.number(),
  totalAreaLabel: z.string(), // e.g. "Total GLA" / "Total Erf Size"
  secondaryArea: z.number(),
  secondaryAreaLabel: z.string(), // e.g. "of clear-span warehouse space"

  monthlyRental: z.number(),
  ratePerSquareMetre: z.number(),
  excludingVat: z.boolean(),

  availability: z.string(),
  buildingGrade: z.string(),

  headline: z.string(),
  description: z.string(),

  // Exactly 3 feature stats, rendered as badges — free-form so each
  // category can show what's actually relevant (eaves height/load
  // bearing/power for a warehouse; floors/parking for an office; zoning/
  // frontage for land).
  stats: z.array(PropertyStatSchema).length(3),

  // Rendered as up to 3 badges in the "Built for business" scene.
  featuresHeadline: z.string(),
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
// staticFile()) OR a full https:// URL. Nine keys, one per scene — every
// key here is actually used somewhere in PropertyPromo.tsx (an earlier
// 11-key version had 2 dead slots that were collected from users but never
// rendered anywhere).
export const MediaSchema = z.object({
  exteriorA: z.string(), // opening scene
  exteriorB: z.string(), // positioning scene
  primaryAreaBackdrop: z.string(), // behind the big "total area" counter
  secondaryAreaBackdrop: z.string(), // behind the secondary area counter
  featureShot: z.string(), // operational features scene (docks/reception/access)
  infrastructureShot: z.string(), // "built for business" scene backdrop
  groundsWide: z.string(), // location scene — grounds/context shot
  availabilityBackdrop: z.string(), // rental/availability scene backdrop
  entranceFacade: z.string(), // closing scene
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
