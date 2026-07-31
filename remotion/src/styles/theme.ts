// src/styles/theme.ts
//
// Central place for all colours, fonts and spacing used across the promo.
// No official Midpoint CI file has been supplied yet, so these are a
// professional, neutral fallback picked to match the building's own
// navy/white cladding. Replace the hex values below once you have the real
// brand guide and every scene updates automatically.

export const theme = {
  colors: {
    background: '#0B0F14',
    backgroundAlt: '#11161D',

    textPrimary: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.72)',
    textMuted: 'rgba(255,255,255,0.5)',

    accent: '#3B6EA5',
    accentDeep: '#1B2A41',

    secondaryAccent: '#C9A227',

    panelOverlay: 'rgba(11,15,20,0.55)',
    gradientBottom:
      'linear-gradient(to bottom, rgba(11,15,20,0) 0%, rgba(11,15,20,0.85) 100%)',
    gradientTop:
      'linear-gradient(to top, rgba(11,15,20,0) 0%, rgba(11,15,20,0.65) 100%)',
  },

  fonts: {
    heading: '"Helvetica Neue", Arial, sans-serif',
    body: '"Helvetica Neue", Arial, sans-serif',
  },

  layout: {
    safeLeft: 70,
    safeRight: 70,
    safeTop: 140,
    safeBottom: 240,
  },
};

export type Theme = typeof theme;
