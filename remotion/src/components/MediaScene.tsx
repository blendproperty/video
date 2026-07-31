// src/components/MediaScene.tsx
//
// Full-bleed background image with a subtle, deterministic push-in/pan
// (frame-driven, so it renders identically every time) plus a dark gradient
// so overlay text stays readable. No random/browser-dependent motion.

import React from 'react';
import { AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { theme } from '../styles/theme';

export const MediaScene: React.FC<{
  src: string;
  durationInFrames: number;
  panDirection?: 'in' | 'out' | 'left' | 'right';
  gradient?: 'bottom' | 'top' | 'both' | 'none';
  children?: React.ReactNode;
}> = ({ src, durationInFrames, panDirection = 'in', gradient = 'bottom', children }) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  let scale = 1;
  let translateX = 0;

  if (panDirection === 'in') {
    scale = interpolate(progress, [0, 1], [1, 1.08]);
  } else if (panDirection === 'out') {
    scale = interpolate(progress, [0, 1], [1.08, 1]);
  } else if (panDirection === 'left') {
    scale = 1.06;
    translateX = interpolate(progress, [0, 1], [20, -20]);
  } else if (panDirection === 'right') {
    scale = 1.06;
    translateX = interpolate(progress, [0, 1], [-20, 20]);
  }

  const isRemote = /^https?:\/\//.test(src);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.colors.background }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translateX(${translateX}px)`,
        }}
      >
        <Img
          src={isRemote ? src : staticFile(src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </AbsoluteFill>

      {(gradient === 'bottom' || gradient === 'both') && (
        <AbsoluteFill style={{ background: theme.colors.gradientBottom }} />
      )}
      {(gradient === 'top' || gradient === 'both') && (
        <AbsoluteFill style={{ background: theme.colors.gradientTop }} />
      )}

      {children}
    </AbsoluteFill>
  );
};
