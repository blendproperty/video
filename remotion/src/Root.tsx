// src/Root.tsx
//
// Registers both compositions (vertical for social, landscape for YouTube),
// schema-validated so any renderer (Studio, CLI --props, or the future web
// portal) can pass a different listing's data safely.

import React from 'react';
import { Composition } from 'remotion';
import { PropertyPromo, TOTAL_DURATION } from './compositions/PropertyPromo';
import { PropertyPromoPropsSchema } from './data/schema';
import { defaultProperty } from './data/property';
import { defaultMedia } from './data/media';

const defaultProps = {
  property: defaultProperty,
  media: defaultMedia,
  // brand override isn't wired into components yet — reserved for later.
  brand: { accentColor: '#3B6EA5', accentDeep: '#1B2A41' },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PropertyPromoLandscape"
        component={PropertyPromo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1920}
        height={1080}
        schema={PropertyPromoPropsSchema}
        defaultProps={defaultProps}
      />

      <Composition
        id="PropertyPromo"
        component={PropertyPromo}
        durationInFrames={TOTAL_DURATION}
        fps={30}
        width={1080}
        height={1920}
        schema={PropertyPromoPropsSchema}
        defaultProps={defaultProps}
      />
    </>
  );
};
