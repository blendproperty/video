// src/styles/theme.ts
//
// Central place for all colours, fonts and spacing used across the promo.
// Values here are Midpoint's actual CI (as distinct from Blend's calmer
// black/green look): cyan-black base, bright cyan primary accent, reflective
// orange for secondary/CTA moments, Figtree as the single type family.
// Every scene reads from here, so this one file drives the whole video's
// look.

import { loadFont } from '@remotion/google-fonts/Figtree';

// Figtree at the two weights actually used: 400 for body copy, 600 for
// headings (per CI — "single family, weight ~600 for headings").
// loadFont(style, options) — style ("normal"/"italic") is the FIRST arg;
// passing the options object there instead fails at render time with
// "does not have a style [object Object]".
const { fontFamily } = loadFont('normal', { weights: ['400', '600'] });

export const theme = {
  colors: {
    background: '#082121', // cyan-black
    backgroundAlt: '#0D2E2E', // slightly lifted panel/alt background

    textPrimary: '#FFFFFF',
    textSecondary: '#CACDD5', // grey-200
    textMuted: '#6D7280', // grey-400

    accent: '#39EAE6', // cyan — primary highlight, used heavily
    accentDeep: '#0B3B3A', // deep cyan-black-adjacent, for glows/shadows

    secondaryAccent: '#FE6C23', // reflective orange — secondary accent / CTA

    panelOverlay: 'rgba(8,33,33,0.6)',
    gradientBottom:
      'linear-gradient(to bottom, rgba(8,33,33,0) 0%, rgba(8,33,33,0.9) 100%)',
    gradientTop:
      'linear-gradient(to top, rgba(8,33,33,0) 0%, rgba(8,33,33,0.7) 100%)',
  },

  fonts: {
    heading: `"${fontFamily}", Arial, sans-serif`,
    body: `"${fontFamily}", Arial, sans-serif`,
  },

  weights: {
    heading: 600, // CI calls for ~600 on headings, not 700/800
    body: 400,
  },

  radius: {
    md: 20, // CI's standard corner radius
    pill: 999,
  },

  layout: {
    safeLeft: 70,
    safeRight: 70,
    safeTop: 140,
    safeBottom: 240,
  },
};

export type Theme = typeof theme;
