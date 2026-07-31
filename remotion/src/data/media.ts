// src/data/media.ts
//
// Default media manifest for 6 Weaver Avenue (matches what's actually on
// the production server right now). Overridable per-render via props
// matching MediaSchema — this is what the future portal will populate from
// user uploads.

import type { MediaInput } from './schema';

export const defaultMedia: MediaInput = {
  exteriorCornerA: 'images/exterior-corner.png',
  exteriorCornerB: 'images/parking-rightside.png',
  pondPathway: 'images/pond-pathway.png',
  carportsGenerator: 'images/parking-leftside.png',
  pondWide: 'images/pond-wide.png',
  warehouseInteriorA: 'images/warehouse-interior-a.png',
  loadingCanopy: 'images/loading-canopy.png',
  warehouseInteriorB: 'images/warehouse-interior-b.png',
  dockCorridor: 'images/load-docks.png',
  warehouseInteriorC: 'images/warehouse-interior.png',
  entranceFacade: 'images/exterior-facade.png',
};
