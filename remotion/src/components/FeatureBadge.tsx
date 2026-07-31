// src/components/FeatureBadge.tsx
//
// A single animated feature pill: staggered entrance, width-expanding
// outline, small accent dot, restrained glow. Designed to be used up to
// three at a time (see PropertyPromo.tsx) so a scene never feels cluttered.

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { theme } from '../styles/theme';

export const FeatureBadge: React.FC<{
  label: string;
  delay?: number;
}> = ({ label, delay = 0 }) => {
  const frame = useCurrentFrame() - delay;

  const progress = interpolate(frame, [0, 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.bezier(0.22, 1, 0.36, 1),
  });

  const translateX = interpolate(progress, [0, 1], [-24, 0]);
  const opacity = progress;
  const scaleX = progress;

  return (
    <div
      style={{
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        padding: '12px 22px',
        borderRadius: 999,
        border: `1.5px solid ${theme.colors.accent}`,
        backgroundColor: 'rgba(255,255,255,0.04)',
        boxShadow: `0 0 ${18 * progress}px rgba(59,110,165,${0.35 * progress})`,
        transformOrigin: 'left center',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: 999,
          backgroundColor: theme.colors.accent,
          transform: `scale(${scaleX})`,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontFamily: theme.fonts.body,
          fontSize: 30,
          fontWeight: 600,
          color: theme.colors.textPrimary,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
};
