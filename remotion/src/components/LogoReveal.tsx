// src/components/LogoReveal.tsx
//
// No Midpoint logo file has been supplied yet (only property photos), so
// this renders a clean text wordmark with an animated accent underline as a
// placeholder that still looks intentional, not broken.
//
// When you have the real logo:
//   1. Save it at public/logos/midpoint-logo.png
//   2. Uncomment the <Img> block below and delete the <TextWordmark> block
//   3. Keep the same accent underline animation for consistency

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
// import { Img, staticFile } from 'remotion';
import { theme } from '../styles/theme';

const TextWordmark: React.FC<{ frame: number }> = ({ frame }) => {
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

  return (
    <div
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        fontFamily: theme.fonts.heading,
        fontSize: 56,
        fontWeight: theme.weights.heading,
        letterSpacing: 4,
        color: theme.colors.textPrimary,
        textTransform: 'uppercase',
      }}
    >
      Midpoint
    </div>
  );
};

export const LogoReveal: React.FC<{ delay?: number }> = ({ delay = 0 }) => {
  const frame = useCurrentFrame() - delay;

  if (frame < 0) {
    return null;
  }

  const underlineWidth = interpolate(frame, [10, 30], [0, 140], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <TextWordmark frame={frame} />
      {/*
      <Img
        src={staticFile('logos/midpoint-logo.png')}
        style={{
          height: 64,
          opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }),
        }}
      />
      */}
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
