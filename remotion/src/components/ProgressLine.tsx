// src/components/ProgressLine.tsx
//
// A thin animated line at the very top of the frame showing how far through
// the video the viewer is. Deterministic (frame-based), safe for rendering.

import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { theme } from '../styles/theme';

export const ProgressLine: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const progress = interpolate(frame, [0, durationInFrames - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.12)',
      }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress * 100}%`,
          backgroundColor: theme.colors.accent,
        }}
      />
    </div>
  );
};
