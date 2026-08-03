// src/data/media.ts
//
// Default media manifest for 6 Weaver Avenue (matches what's actually on
// the production server right now). Overridable per-render via props
// matching MediaSchema — this is what the portal populates from user
// uploads. Nine generic keys, each mapped to exactly one scene.

import type { MediaInput } from './schema';

export const defaultMedia: MediaInput = {
  exteriorA: 'images/exterior-corner.png',
  exteriorB: 'images/parking-rightside.png',
  primaryAreaBackdrop: 'images/warehouse-interior-b.png',
  secondaryAreaBackdrop: 'images/warehouse-interior-a.png',
  featureShot: 'images/loading-canopy.png',
  infrastructureShot: 'images/parking-leftside.png',
  groundsWide: 'images/pond-wide.png',
  availabilityBackdrop: 'images/load-docks.png',
  entranceFacade: 'images/exterior-facade.png',
};
