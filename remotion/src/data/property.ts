// src/data/property.ts
//
// Keeps the real 6 Weaver Avenue data as the DEFAULT (so `npx remotion
// studio` still works out of the box with no props passed), but everything
// here can now be overridden per-render via props matching PropertySchema.

import type { PropertyInput } from './schema';

export const defaultProperty: PropertyInput = {
  propertyCategory: 'warehouse',

  propertyName: '6 Weaver Avenue',
  propertyType: 'Warehouse & Office',
  location: 'Halfway House, Midrand',
  address: '6 Weaver Avenue, Halfway House, Midrand',

  listingLabel: 'To Let',

  totalArea: 11443,
  totalAreaLabel: 'Total GLA',
  secondaryArea: 10150,
  secondaryAreaLabel: 'of clear-span warehouse space',

  monthlyRental: 1247287,
  ratePerSquareMetre: 109,
  excludingVat: true,

  availability: 'Available now',
  buildingGrade: 'Warehousing',

  headline: 'Warehouse and offices,\nall under one roof',

  description:
    'Premium frontage overlooking a landscaped dam, with exceptional signage exposure to the N1 and full design flexibility across the façade, entry points and internal layout.',

  stats: [
    { label: 'Height to eaves', value: '15m' },
    { label: 'Load bearing', value: '3 000 kg/m²' },
    { label: 'Power supply', value: '2.5 MVA' },
  ],

  featuresHeadline: 'Built for business',
  features: [
    'Warehousing',
    'Prime Offices',
    '24-hour Security',
    'Backup Power',
    'Backup Water',
    'Ample Parking',
    'Padel Court',
    'Gym',
    'Running Trails',
    'Restaurant',
    'Coffee Shop',
  ],

  contact: {
    name: 'Boitumelo Nkuna',
    title: 'Midpoint - Property Manager',
    phone: '+27 83 717 0201',
    email: 'boitumelo@blendproperty.co.za',
  },

  listingUrl: 'listings.blendproperty.co.za/listings/6-weaver-avenue',
  listingUrlFull: 'https://listings.blendproperty.co.za/listings/6-weaver-avenue',

  callToAction: 'Book a viewing',
};

// --- Formatting helpers -------------------------------------------------

export const formatZaNumber = (value: number, decimals = 0): string => {
  const rounded = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
  const [intPart, decPart] = rounded.split('.');
  const withSpaces = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decPart ? `${withSpaces}.${decPart}` : withSpaces;
};

export const formatZaCurrency = (value: number, decimals = 0): string => {
  return `R ${formatZaNumber(value, decimals)}`;
};
