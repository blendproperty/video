// src/components/LogoReveal.tsx
//
// Fades/slides in the real Midpoint lockup (public/logos/midpoint-lockup.svg)
// with an animated cyan underline. Used in the opening and closing scenes.

import React from 'react';
import { Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { theme } from '../styles/theme';

export const LogoReveal: React.FC<{ delay?: number; height?: number }> = ({
  delay = 0,
  height = 56,
}) => {
  const frame = useCurrentFrame() - delay;

  if (frame < 0) {
    return null;
  }

  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const translateY = interpolate(frame, [0, 15], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });

  const underlineWidth = interpolate(frame, [10, 30], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Img
        src={staticFile('logos/midpoint-lockup.svg')}
        style={{
          height,
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      />
      <div
        style={{
          width: underlineWidth,
          height: 3,
          backgroundColor: theme.colors.accent,
        }}
      />
    </div>
  );
};
