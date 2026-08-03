// src/components/AnimatedCounter.tsx
//
// Animates a number from 0 up to its final value, formatted with South
// African style thousands separators (space) and an optional prefix/suffix.
// Settles exactly on the target — never overshoots into a wrong displayed
// number because we round only once, at display time, from the eased
// progress value.

import React from 'react';
import { Easing, interpolate, useCurrentFrame } from 'remotion';
import { formatZaNumber } from '../data/property';
import { theme } from '../styles/theme';

export const AnimatedCounter: React.FC<{
  from?: number;
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  durationInFrames?: number;
  delay?: number;
  fontSize?: number;
}> = ({
  from = 0,
  to,
  prefix = '',
  suffix = '',
  decimals = 0,
  durationInFrames = 36,
  delay = 0,
  fontSize = 120,
}) => {
  const frame = useCurrentFrame() - delay;

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const value = from + (to - from) * progress;
  const display = formatZaNumber(value, decimals);

  return (
    <div
      style={{
        fontFamily: theme.fonts.heading,
        fontSize,
        fontWeight: theme.weights.heading,
        color: theme.colors.textPrimary,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1,
      }}
    >
      {prefix}
      {display}
      {suffix}
    </div>
  );
};
